import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import { uploadImage } from './firebase/uploadImage';

const execPromise = util.promisify(exec);
const mkdirPromise = util.promisify(fs.mkdir);
const unlinkPromise = util.promisify(fs.unlink);
const readdirPromise = util.promisify(fs.readdir);

async function validatePDF(pdfPath: string): Promise<boolean> {
  try {
    console.log(`Validating PDF file at ${pdfPath}`);

    const stats = fs.statSync(pdfPath);
    if (stats.size === 0) {
      throw new Error('PDF file is empty (zero bytes)');
    }
    console.log(`PDF file size: ${stats.size} bytes`);

    try {
      await execPromise(`qpdf --check "${pdfPath}"`);
      console.log('PDF validation with qpdf passed');
      return true;
    } catch (qpdfError: unknown) {
      const qpdfErrorMessage = qpdfError instanceof Error ? qpdfError.message : String(qpdfError);
      console.warn('qpdf validation failed:', qpdfErrorMessage);
    }

    try {
      await execPromise(`pdfinfo "${pdfPath}"`);
      console.log('PDF validation with pdfinfo passed');
      return true;
    } catch (pdfInfoError: unknown) {
      const pdfInfoErrorMessage =
        pdfInfoError instanceof Error ? pdfInfoError.message : String(pdfInfoError);
      console.warn('pdfinfo validation failed:', pdfInfoErrorMessage);
      // Continue to other methods if pdfinfo fails
    }

    // 4. Last resort - read first few bytes to confirm it's a PDF
    const fd = fs.openSync(pdfPath, 'r');
    const buffer = Buffer.alloc(100);
    fs.readSync(fd, buffer, 0, 100, 0);
    fs.closeSync(fd);

    const header = buffer.toString('utf8', 0, 100);
    if (header.includes('%PDF')) {
      console.log('PDF validation by signature passed');
      return true;
    }

    throw new Error('PDF validation failed: No PDF signature found');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`PDF validation failed: ${errorMessage}`);
    throw new Error(`Invalid PDF file: ${errorMessage}`);
  }
}

interface PDFParseOptions {
  /** Quality of output images (1-100) */
  quality?: number;
  /** Folder path in Firebase Storage */
  folderPath: string;
  /** Challenge ID associated with these slides */
  challengeId: string;
}

interface ParsedPDFResult {
  imageUrls: string[];
  /** Number of successfully parsed pages */
  pageCount: number;
}

/**
 * Parse a PDF file into multiple image files, upload them to Firebase, and return their URLs
 *
 * @param pdfBuffer - The PDF file buffer to parse
 * @param options - Options for parsing and uploading
 * @returns An array of Firebase URLs for the parsed images
 */
export const parsePDFToImages = async (
  pdfBuffer: Buffer,
  options: PDFParseOptions,
): Promise<ParsedPDFResult> => {
  const { quality = 90, folderPath, challengeId } = options;

  // Create a temporary directory for processing
  const tempDir = path.join('/tmp', `pdf-${Date.now()}-${Math.floor(Math.random() * 10000)}`);
  const outputDir = path.join(tempDir, 'output');
  const pdfPath = path.join(tempDir, 'input.pdf');

  try {
    // Create temp directories
    await mkdirPromise(tempDir, { recursive: true });
    await mkdirPromise(outputDir, { recursive: true });

    // Check if PDF buffer is valid
    console.log(
      `Received PDF buffer of type: ${typeof pdfBuffer}, isBuffer: ${Buffer.isBuffer(pdfBuffer)}`,
    );

    // Double check buffer is actually a buffer and not null/undefined
    if (!pdfBuffer) {
      throw new Error('PDF buffer is null or undefined');
    }

    // Additional check to ensure it's a Buffer object
    if (!Buffer.isBuffer(pdfBuffer)) {
      console.log('Input is not a Buffer, attempting to convert to Buffer');
      try {
        // Try to convert to buffer if it's something else (like ArrayBuffer)
        pdfBuffer = Buffer.from(pdfBuffer);
      } catch (error) {
        console.error('Failed to convert to Buffer:', error);
        throw new Error('Input could not be converted to a valid Buffer');
      }
    }

    // Check if buffer has content
    if (pdfBuffer.length === 0) {
      throw new Error('PDF buffer is empty (zero length)');
    }

    console.log(`PDF buffer length: ${pdfBuffer.length} bytes`);

    // Debug: Show first bytes as hex and as string to diagnose encoding issues
    const firstBytes = pdfBuffer.slice(0, 50);
    console.log(`First 50 bytes (hex): ${firstBytes.toString('hex')}`);
    console.log(
      `First 50 bytes (utf8): ${firstBytes.toString('utf8').replace(/[^\x20-\x7E]/g, '?')}`,
    );

    // Less strict signature check - look for %PDF anywhere in first 100 bytes
    // Since some PDF files might have BOM markers or other metadata before the signature
    const checkLength = Math.min(100, pdfBuffer.length);
    const bufferStart = pdfBuffer.slice(0, checkLength);
    const bufferStartStr = bufferStart.toString('utf8', 0, checkLength);

    const pdfSignature = '%PDF';
    if (!bufferStartStr.includes(pdfSignature)) {
      console.log('PDF signature not found in standard encoding, trying alternative check...');

      // Try a binary search for the signature bytes
      const signatureBytes = Buffer.from(pdfSignature);
      let found = false;

      for (let i = 0; i <= bufferStart.length - signatureBytes.length; i++) {
        if (bufferStart.slice(i, i + signatureBytes.length).equals(signatureBytes)) {
          found = true;
          console.log(`PDF signature found at position ${i}`);
          break;
        }
      }

      if (!found) {
        throw new Error('Invalid PDF format: Could not find PDF signature in first 100 bytes');
      }
    }
    console.log('PDF signature validation passed');

    // Write the PDF to disk with explicit encoding and safe error handling
    try {
      // Write file directly to disk
      fs.writeFileSync(pdfPath, pdfBuffer);
      console.log(`PDF file written to ${pdfPath} with size ${fs.statSync(pdfPath).size} bytes`);
    } catch (writeError) {
      console.error('Error writing PDF file:', writeError);
      throw new Error(`Failed to write PDF to disk: ${(writeError as Error).message}`);
    }

    // Verify the file was written correctly and is a valid PDF
    if (!fs.existsSync(pdfPath) || fs.statSync(pdfPath).size === 0) {
      throw new Error('Failed to write PDF file to disk or file is empty');
    }

    // Use comprehensive validation function to check the PDF
    try {
      await validatePDF(pdfPath);
    } catch (validationError) {
      console.error('PDF validation failed:', validationError);

      // Try to repair the PDF as a last resort
      console.log('Attempting to repair PDF...');
      try {
        await execPromise(`qpdf --replace-input "${pdfPath}" --object-streams=disable`);
        console.log('PDF repair attempt completed');
      } catch (repairError) {
        console.error('PDF repair failed:', repairError);
        // Continue anyway, some conversion methods might still work
      }
    }

    // Use multiple PDF to image conversion approaches with fallback mechanisms
    // Using memory-optimized settings to prevent container OOM kills
    let conversionSuccess = false;

    // Try conversion with different tools in sequence until one works
    const conversionMethods = [
      // First method: pdftoppm with memory-optimized settings
      {
        name: 'pdftoppm-memory-optimized',
        command: `pdftoppm -jpeg -r 150 -jpegopt quality=${quality} -scale-to 1200 "${pdfPath}" "${outputDir}/page"`,
      },
      // Second method: pdftoppm with very low resolution
      {
        name: 'pdftoppm-low-res',
        command: `pdftoppm -jpeg -r 100 -jpegopt quality=${Math.min(85, quality)} -scale-to 800 "${pdfPath}" "${outputDir}/page"`,
      },
      // Third method: pdftoppm with minimum settings
      {
        name: 'pdftoppm-minimal',
        command: `pdftoppm -jpeg -r 72 -scale-to 600 "${pdfPath}" "${outputDir}/page"`,
      },
      // Fourth method: ghostscript with memory optimization
      {
        name: 'ghostscript',
        command: `gs -q -dNOPAUSE -dBATCH -sDEVICE=jpeg -dJPEGQ=${Math.min(80, quality)} -r150 -dMaxBitmap=500000000 -dAlignToPixels=0 -dGridFitTT=2 -sOutputFile="${outputDir}/gs-page-%d.jpg" "${pdfPath}"`,
      },
    ]; // First, try to determine the number of pages to adjust our approach for large PDFs
    let pageCount = 0;
    try {
      const pdfInfo = await execPromise(`pdfinfo "${pdfPath}"`);
      const match = pdfInfo.stdout.match(/Pages:\s+(\d+)/);
      if (match && match[1]) {
        pageCount = parseInt(match[1], 10);
        console.log(`PDF has ${pageCount} pages`);
      }
    } catch (error) {
      console.warn('Could not determine page count:', error);
    }

    // For very large PDFs (over 20 pages), use a more conservative approach
    if (pageCount > 20) {
      console.log('Large PDF detected, using page-by-page processing to conserve memory');

      try {
        // Process each page individually to avoid memory issues
        for (let i = 1; i <= pageCount; i++) {
          console.log(`Processing page ${i} of ${pageCount}...`);

          // Use the most memory-efficient settings
          await execPromise(
            `pdftoppm -jpeg -f ${i} -l ${i} -r 100 -scale-to 800 -jpegopt quality=75 "${pdfPath}" "${outputDir}/page"`,
          );

          // Short delay between pages to allow memory cleanup
          if (i % 5 === 0) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }
        console.log('Large PDF processed successfully page by page');
        conversionSuccess = true;
      } catch (pageError) {
        console.error('Page-by-page processing failed:', pageError);
        // Fall through to the standard methods if page-by-page fails
      }
    }

    // If page-by-page didn't succeed (or wasn't attempted), try standard methods
    if (!conversionSuccess) {
      for (const method of conversionMethods) {
        if (conversionSuccess) break;

        try {
          console.log(`Attempting PDF conversion with ${method.name}`);
          await execPromise(method.command);
          console.log(`PDF conversion successful with ${method.name}`);
          conversionSuccess = true;
        } catch (error) {
          console.error(`PDF conversion with ${method.name} failed:`, error);
        }
      }
    }

    if (!conversionSuccess) {
      throw new Error('Failed to convert PDF to images after trying multiple methods');
    }

    if (conversionSuccess) {
      console.log('PDF conversion successful');
    }

    // Get list of generated files
    const files = await readdirPromise(outputDir);
    console.log(`Generated files in output directory: ${files.join(', ')}`);

    const jpegFiles = files.filter((file) => file.endsWith('.jpg'));
    console.log(`Found ${jpegFiles.length} JPEG files`);

    const sortedFiles = jpegFiles.sort((a, b) => {
      // Extract page numbers from filenames and sort numerically
      // Handle different naming patterns from different tools:
      // - pdftoppm: "page-1.jpg", "page-2.jpg"
      // - gs: "gs-page-1.jpg", "gs-page-2.jpg"

      const extractNumber = (filename: string): number => {
        const match = filename.match(/(?:page|gs-page)-?(\d+)\.jpg/);
        if (match && match[1]) {
          return parseInt(match[1], 10);
        }
        // Fallback: try to find any number in the filename
        const numMatch = filename.match(/(\d+)\.jpg/);
        return numMatch ? parseInt(numMatch[1], 10) : 0;
      };

      return extractNumber(a) - extractNumber(b);
    });

    // Check if any images were generated
    if (sortedFiles.length === 0) {
      throw new Error('No images were generated from the PDF file');
    }

    console.log(`Generated ${sortedFiles.length} image files from PDF`);

    // Upload each image to Firebase
    const imageUrls: string[] = [];

    for (const file of sortedFiles) {
      const filePath = path.join(outputDir, file);
      const fileBuffer = fs.readFileSync(filePath);

      // Create a File object from buffer
      const fileObj = new File([fileBuffer], file, { type: 'image/jpeg' });

      // Upload to Firebase
      try {
        const firebasePath = `${folderPath}/${challengeId}`;
        const imageUrl = await uploadImage(fileObj, { folderPath: firebasePath });
        imageUrls.push(imageUrl);
      } catch (uploadError) {
        console.error(`Error uploading image to Firebase: ${file}`, uploadError);
        const errorMessage =
          uploadError instanceof Error ? uploadError.message : String(uploadError);
        throw new Error(`Failed to upload image to Firebase: ${errorMessage}`);
      }

      // Clean up the image file
      await unlinkPromise(filePath);
    }

    return {
      imageUrls,
      pageCount: imageUrls.length,
    };
  } catch (error) {
    console.error('Error converting PDF to images:', error);
    throw error;
  } finally {
    // Clean up the temp directory
    try {
      await execPromise(`rm -rf "${tempDir}"`);
    } catch (cleanupError) {
      console.error('Error cleaning up temp directory:', cleanupError);
    }
  }
};
