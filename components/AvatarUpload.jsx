"use client";

import React, { useState, useRef, useEffect } from "react";
import ImageKit from "imagekit-javascript";
import Image from "next/image";
import { Camera, User } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

const uploadToImageKit = async (file, setData, setFileId, folder) => {
  const auth = await fetch("/api/upload-auth").then((res) => res.json());
  const imagekit = new ImageKit({
    publicKey,
    urlEndpoint,
    authenticationEndpoint: "",
  });

  imagekit.upload(
    {
      file,
      fileName: file.name,
      useUniqueFileName: true,
      folder: folder,
      token: auth.token,
      signature: auth.signature,
      expire: auth.expire,
    },
    (err, result) => {
      if (err) {
        console.error("Upload failed", err);
        alert("Upload failed!");
      } else {
        console.log("Upload success", result);
        setData(result);
        setFileId(result.fileId);
      }
    }
  );
};

const deleteFile = async (fileId) => {
  if (!fileId) return;
  try {
    await fetch("/api/delete-image", {
      method: "POST",
      body: JSON.stringify({ fileId }),
    });
    console.log("Deleted previous file:", fileId);
  } catch (err) {
    console.error("Delete failed", err);
  }
};

export default function AvatarUpload({
  uploadData,
  setUploadData,
  fileId,
  setFileId,
  handleFileUpload,
  folder,
}) {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (uploadData && fileId) handleFileUpload(uploadData.url, fileId);
  }, [uploadData, fileId]);

  const handleUpload = async (file) => {
    if (!file?.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    setIsUploading(true);
    if (fileId) {
      const load = toast.loading("Deleting previous file... Please wait...");
      await deleteFile(fileId);
      toast.dismiss(load);
    }

    const loading = toast.loading("Uploading image... Please wait...");
    setUploadData(null);
    setFileId(null);
    await uploadToImageKit(file, setUploadData, setFileId, folder);
    toast.dismiss(loading);
    setIsUploading(false);
    toast.success("Image uploaded successfully!");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleReupload = async () => {
    const load = toast.loading("Deleting previous file... Please wait...");

    if (fileId) await deleteFile(fileId);

    toast.dismiss(load);

    setUploadData(null);
    setFileId(null);
    handleFileUpload(null, null);

    toast.success("Ready to upload a new file!");
    if (inputRef.current) inputRef.current.value = "";
  };
  return (
    <div className="relative flex flex-col items-center mt-4">
      {/* Avatar Image */}
      <div
        className="relative w-28 h-28 rounded-3xl shadow-lg overflow-hidden
                   bg-gradient-to-r from-emerald-500 to-sky-600
                   flex items-center justify-center"
      >
        {uploadData?.url ? (
          <Image
            src={uploadData.url}
            alt="User Avatar"
            width={112}
            height={112}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-12 h-12 text-white" />
        )}
      </div>

      {/* Camera Button directly below the avatar */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="absolute -bottom-4 w-9 h-9 rounded-full
                   bg-emerald-500 hover:bg-emerald-600
                   border-2 border-white dark:border-slate-900
                   flex items-center justify-center
                   transition-colors shadow-md"
        aria-label="Change avatar"
      >
        {isUploading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Camera className="w-4 h-4 text-white" />
        )}
      </button>

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Reupload / Remove button (optional below avatar) */}
      {uploadData && (
        <Button
          onClick={() => handleReupload()}
          className="mt-10 text-sm bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-300"
        >
          Reupload Avatar
        </Button>
      )}
    </div>
  );
}
