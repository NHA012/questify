declare module 'express-fileupload' {
  import { Request, Response, NextFunction } from 'express';

  namespace fileUpload {
    interface UploadedFile {
      name: string;
      encoding: string;
      mimetype: string;
      data: Buffer;
      size: number;
      mv(path: string, callback: (err: unknown) => void): void;
      mv(path: string): Promise<void>;
      tempFilePath?: string;
      truncated?: boolean;
      md5?: string;
    }

    interface FileUploadOptions {
      createParentPath?: boolean;
      uriDecodeFileNames?: boolean;
      safeFileNames?: boolean;
      preserveExtension?: boolean | number;
      abortOnLimit?: boolean;
      responseOnLimit?: string;
      limitHandler?: (req: Request, res: Response, next: NextFunction) => void;
      useTempFiles?: boolean;
      tempFileDir?: string;
      parseNested?: boolean;
      debug?: boolean;
      uploadTimeout?: number;
      limits?: {
        fileSize?: number;
      };
    }
  }

  // Export the main function
  function fileUpload(
    options?: fileUpload.FileUploadOptions,
  ): (req: Request, res: Response, next: NextFunction) => void;

  export = fileUpload;
}

// Extend Express Request interface
declare namespace Express {
  interface Request {
    files?: {
      [fieldname: string]: fileUpload.UploadedFile | fileUpload.UploadedFile[];
    };
  }
}
