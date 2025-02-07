"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress: (progress: number) => void;
  fileType?: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const onError = (err: { message: string }) => {
    console.log("Error", err);
    setError(err.message);
  };

  const handleSuccess = (response: IKUploadResponse) => {
    console.log("Success", response);
    setUploading(false);
    setError("");
    onSuccess(response);
  };

  const handleStartUpload = () => {
    setUploading(true);
    setError("");
  };

  const handleProgress = (evt: ProgressEvent) => {
    console.log("Start", evt);
    if (evt.lengthComputable && onProgress) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      onProgress(Math.round(percentComplete));
    }
  };

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a video file");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Video must be less than 100MB");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return false;
      }
    }
    return false;
  };

  return (
    <div className="space-y-2">
      <IKUpload
        fileName={fileType === "video" ? "video" : "image"}
        useUniqueFileName={true}
        validateFile={validateFile}
        onError={onError}
        onSuccess={handleSuccess}
        onUploadProgress={handleProgress}
        onUploadStart={handleStartUpload}
        accept={fileType === "video" ? "video/*" : "image/*"}
        className="file-input file-input-bordered w-full"
        folder={fileType === "video" ? "/videos" : "/images"}
      />
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Loader2 className="animate-spin w-4 h-4" />
          <span>Uploading...</span>
        </div>
      )}
      {error && (
        <p className="text-error text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
