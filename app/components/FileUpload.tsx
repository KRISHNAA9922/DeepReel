"use client";

import { upload } from "@imagekit/next";
import { useState } from "react";

// ✅ Strong type for the upload result
export interface UploadResponse {
  url: string;
  thumbnailUrl?: string;
  fileId?: string;
  name?: string;
}

interface FileUploadProps {
  onSuccess: (res: UploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const validateFile = (file: File) => {
    if (fileType === "video" && !file.type.startsWith("video/")) {
      alert("Please upload a valid video file.");
      return false;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert("File size must be less than 100 MB.");
      return false;
    }

    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) return;

    setUploading(true);

    try {
      // ✅ Get ImageKit auth signature
      const authRes = await fetch("/api/auth/imagekit-auth");
      const auth = await authRes.json();

      // ✅ Upload to ImageKit
      const res = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        signature: auth.authenticationParameters.signature,
        expire: auth.authenticationParameters.expire,
        token: auth.authenticationParameters.token,
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
      }) as UploadResponse; // ✅ Cast result to expected type

      // ✅ Call success callback with result
      onSuccess(res);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-700 file:text-white
          hover:file:bg-violet-600
          cursor-pointer"
      />
      {uploading && (
        <span className="text-sm text-gray-400 mt-2 block">Uploading...</span>
      )}
    </div>
  );
};

export default FileUpload;
