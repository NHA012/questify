import express, { Request, Response } from 'express';
import fs from 'fs';
import { Island } from '../../models/island';
import { Level } from '../../models/level';
import {
  validateRequest,
  requireAuth,
  BadRequestError,
  NotAuthorizedError,
  ResourcePrefix,
  SlideType,
} from '@datn242/questify-common';
import { Course } from '../../models/course';
import { Challenge } from '../../models/challenge';
import { Slide } from '../../models/slide';
import { parsePDFToImages } from '../../services/upload-pdf';
import { SlideCreatedPublisher } from '../../events/publishers/slide-created-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { UploadedFile } from 'express-fileupload';
import { ChallengeCreatedPublisher } from '../../events/publishers/challenge-created-publisher';

const router = express.Router();

router.post(
  ResourcePrefix.CourseManagement + '/level/:level_id/pdf',
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const { level_id } = req.params;

    if (!req.files || !req.files.pdf) {
      throw new BadRequestError('PDF file is required');
    }

    const pdfFile = req.files.pdf as UploadedFile;

    if (pdfFile.mimetype !== 'application/pdf') {
      throw new BadRequestError('File must be a PDF');
    }

    const maxSize = 15 * 1024 * 1024;
    if (pdfFile.size > maxSize) {
      throw new BadRequestError('PDF file size exceeds the 15MB limit');
    }

    const level = await Level.findByPk(level_id);
    if (!level) {
      throw new BadRequestError('Level not found');
    }

    const island = await Island.findByPk(level.islandId, {
      include: [
        {
          model: Course,
          as: 'Course',
          required: false,
        },
      ],
    });

    if (!island) {
      throw new BadRequestError('Island not found');
    }

    const course = island.get('Course') as Course;
    if (!course || course.teacherId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    let challenge: Challenge | null = null;

    try {
      if (pdfFile.size === 0) {
        throw new BadRequestError('PDF file is empty');
      }

      challenge = Challenge.build({
        levelId: level_id,
      });
      await challenge.save();

      let pdfBuffer: Buffer | null = null;

      if (pdfFile.tempFilePath && fs.existsSync(pdfFile.tempFilePath)) {
        try {
          pdfBuffer = fs.readFileSync(pdfFile.tempFilePath);
        } catch (readError) {
          console.error('Failed to read from temp file:', readError);
        }
      }

      if (!pdfBuffer || pdfBuffer.length === 0) {
        if (Buffer.isBuffer(pdfFile.data)) {
          pdfBuffer = pdfFile.data;

          if (pdfBuffer.length === 0 && pdfFile.size > 0) {
            console.log(
              'WARNING: Buffer is empty but file size is reported as non-zero. This indicates a problem with the file upload.',
            );
          }
        } else if (typeof pdfFile.data === 'string') {
          pdfBuffer = Buffer.from(pdfFile.data, 'base64');
        } else if (pdfFile.data) {
          try {
            pdfBuffer = Buffer.from(pdfFile.data);
          } catch (conversionError) {
            console.error('Failed to convert file data to Buffer:', conversionError);
          }
        }
      }

      if (!pdfBuffer || pdfBuffer.length === 0) {
        throw new BadRequestError('The uploaded PDF file appears to be corrupted or empty');
      }

      const result = await parsePDFToImages(pdfBuffer, {
        folderPath: 'slides',
        challengeId: challenge.id,
      });

      if (result.pageCount === 0) {
        throw new BadRequestError('No slides were generated from the PDF');
      }

      const slidesToCreate = result.imageUrls.map((imageUrl, index) => {
        return {
          challengeId: challenge!.id,
          title: `Slide ${index + 1}`,
          description: '',
          slideNumber: index + 1,
          type: SlideType.PDF_SLIDE,
          imageUrl,
        };
      });

      const createdSlides = await Slide.bulkCreate(slidesToCreate);

      new ChallengeCreatedPublisher(natsWrapper.client).publish({
        id: challenge!.id,
        levelId: challenge!.levelId,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      for (const slide of createdSlides) {
        new SlideCreatedPublisher(natsWrapper.client).publish({
          id: slide.id,
          title: slide.title,
          description: slide.description,
          slideNumber: slide.slideNumber,
          type: slide.type,
          imageUrl: slide.imageUrl,
          videoUrl: slide.videoUrl,
          answers: slide.answers,
          challengeId: slide.challengeId,
        });
      }

      res.status(201).send({
        message: `Successfully created ${createdSlides.length} slides from PDF`,
        challenge: challenge,
        slides: createdSlides,
      });
    } catch (error: unknown) {
      console.error('Error processing PDF:', error);

      if (challenge && challenge.id) {
        try {
          await challenge.destroy();
          console.log(`Cleaned up challenge ${challenge.id} due to PDF processing failure`);
        } catch (cleanupError) {
          console.error('Error cleaning up challenge:', cleanupError);
        }
      }

      let errorMessage = 'Failed to process PDF';

      if (error instanceof Error) {
        errorMessage = `Failed to process PDF: ${error.message}`;

        if (error.message.includes('Document stream is empty')) {
          errorMessage =
            'The PDF file appears to be corrupted or empty. Please check the file and try again.';
        } else if (error.message.includes('Invalid PDF format')) {
          errorMessage =
            'The uploaded file is not a valid PDF. Please check the file format and try again.';
        }
      }

      throw new BadRequestError(errorMessage);
    }
  },
);

export { router as uploadPdfLevelRouter };
