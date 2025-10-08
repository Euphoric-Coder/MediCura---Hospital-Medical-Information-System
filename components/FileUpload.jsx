"use client";

import React, { useEffect, useRef, useState } from "react";
import ImageKit from "imagekit-javascript";
import { FiUploadCloud, FiFileText } from "react-icons/fi";
import { Button } from "./ui/button";

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

export default function FileUpload({
  uploadData,
  setUploadData,
  fileId,
  setFileId,
  handleFileUpload,
  folder,
  error = "",
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (uploadData && fileId) {
      console.log("File uploaded:", fileId, uploadData);
      handleFileUpload(uploadData.url, fileId);
    }
  }, [uploadData, fileId]);

  const handleUpload = async (file) => {
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    if (fileId) await deleteFile(fileId);

    setUploadData(null);
    setFileId(null);
    await uploadToImageKit(file, setUploadData, setFileId, folder);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleReUpload = async () => {
    if (fileId) await deleteFile(fileId);
    setUploadData(null);
    setFileId(null);
    handleFileUpload(null, null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="mt-2 mb-5">
      {!uploadData ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`relative mt-5 flex flex-col items-center justify-center p-8 border-[3px] rounded-xl cursor-pointer transition-all shadow-md hover:shadow-lg
            ${
              error
                ? // ❌ Error mode colors
                  "border-red-500 bg-gradient-to-br from-red-50 to-red-100 dark:from-[#2a0000] dark:to-[#400000]"
                : isDragging
                  ? "border-blue-600 bg-gradient-to-br from-cyan-100 to-indigo-200 dark:from-[#0f172a] dark:to-[#1e3a8a]"
                  : "border-blue-300 bg-gradient-to-br from-cyan-50 to-indigo-100 dark:from-[#1c1c1c] dark:to-[#0f172a]"
            }`}
        >
          <FiUploadCloud
            className={`text-6xl mb-4 ${
              error
                ? "text-red-500 dark:text-red-400"
                : "text-blue-600 dark:text-blue-400"
            }`}
          />
          <div className="text-center">
            <p
              className={`text-lg font-semibold ${
                error
                  ? "text-red-700 dark:text-red-300"
                  : "text-blue-800 dark:text-blue-300"
              }`}
            >
              Drag & Drop your PDF here
            </p>
            <p
              className={`text-md mt-1 ${
                error
                  ? "text-red-500 dark:text-red-400"
                  : "text-indigo-500 dark:text-indigo-300"
              }`}
            >
              or click to browse files
            </p>
            <p
              className={`text-sm mt-1 font-medium ${
                error
                  ? "text-red-600 dark:text-red-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              Only PDF files (.pdf) are allowed
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            id="pdf-upload"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="application/pdf"
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <div className="mb-6">
          <div className="relative flex flex-col items-center gap-6 mt-4 p-6 border-2 border-dashed border-blue-300 rounded-2xl bg-gradient-to-br from-cyan-50 to-indigo-100 dark:from-[#1c1c1c] dark:to-[#0f172a] shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
              <FiFileText className="text-5xl" />
              <div className="text-left">
                <h3 className="text-lg font-semibold break-all">
                  {uploadData.name || "Uploaded File"}
                </h3>
                <p className="text-sm opacity-75">
                  {(uploadData.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <Button
              onClick={(e) => {
                e.preventDefault();
                handleReUpload();
              }}
              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-medium px-5 py-2 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
            >
              Reupload PDF
            </Button>

            <a
              href={uploadData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 text-sm underline hover:text-blue-800 dark:hover:text-blue-300"
            >
              View PDF
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
