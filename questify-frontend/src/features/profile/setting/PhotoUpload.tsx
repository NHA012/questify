import Image from 'next/image';
import React, { useRef } from 'react';

interface PhotoUploadProps {
  photoUrl: string;
  onPhotoChange?: (file: File) => void;
  isUploading?: boolean;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photoUrl,
  onPhotoChange,
  isUploading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (isUploading) return; // Prevent clicking while uploading
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onPhotoChange && !isUploading) {
      onPhotoChange(file);
    }
  };

  return (
    <div className="w-[368px] max-sm:w-full">
      <div className="relative mb-6 h-[280px] w-[280px]">
        <Image
          src={photoUrl}
          className="object-cover size-full"
          alt="Upload photo"
          width={50000}
          height={50000}
        />
        <button
          onClick={handleUploadClick}
          className="flex absolute inset-x-0 bottom-0 gap-2 items-center p-3 bg-black bg-opacity-50 w-full border-none"
          aria-label="Upload photo"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <span className="text-sm text-white">Uploading...</span>
            </>
          ) : (
            <>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="upload-icon"
              >
                <path
                  d="M8.0625 7.68647L12 3.75L15.9375 7.68647"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M12 14.2499V3.75269"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M20.25 14.25V19.5C20.25 19.6989 20.171 19.8897 20.0303 20.0303C19.8897 20.171 19.6989 20.25 19.5 20.25H4.5C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V14.25"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <span className="text-sm text-white">Upload Photo</span>
            </>
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          aria-hidden="true"
          disabled={isUploading}
        />
      </div>
      <p className="text-sm text-center text-gray-500 w-[280px]">
        Image size should be under 1MB and image ration needs to be 1:1
      </p>
    </div>
  );
};

export default PhotoUpload;
