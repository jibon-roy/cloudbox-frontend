"use client";

import { X, Upload, FileCheck } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUploadFilesMutation } from "@/src/redux/features/file-system/fileSystemApi";
import Swal from "sweetalert2";
import { colors } from "@/src/lib/colors";

type Props = {
  currentFolderId: string;
  onClose: () => void;
};

const UploadModal = ({ currentFolderId, onClose }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadFiles, { isLoading }] = useUploadFilesMutation();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      if (currentFolderId) {
        formData.append("folderId", currentFolderId);
      }

      await uploadFiles(formData).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Upload Successful!",
        text: `${files.length} file(s) uploaded successfully.`,
        timer: 2000,
        showConfirmButton: false,
      });

      onClose();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text:
              error?.data?.message || "Failed to upload files. Please try again.",
         confirmButtonColor: colors.primary
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl rounded-2xl border border-border-subtle bg-surface p-6 shadow-xl"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-app-text">Upload Files</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-soft hover:text-app-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative mb-4 rounded-xl border-2 border-dashed p-8 transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border-subtle bg-surface-soft"
          }`}
        >
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <div className="flex flex-col items-center gap-3 text-center">
            <Upload className="h-12 w-12 text-muted" />
            <div>
              <p className="font-semibold text-app-text">
                Drop files here or click to browse
              </p>
              <p className="mt-1 text-sm text-muted">
                Support for multiple files
              </p>
            </div>
          </div>
        </div>

        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="mb-4 max-h-64 overflow-y-auto rounded-xl border border-border-subtle bg-surface-soft p-4">
            <h3 className="mb-2 text-sm font-semibold text-muted">
              Selected Files ({files.length})
            </h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-surface p-3"
                >
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-sm font-medium text-app-text">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="rounded-lg p-1 text-muted transition-colors hover:bg-error/10 hover:text-error"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-border-subtle bg-surface px-4 py-2 text-sm font-semibold text-app-text transition-colors hover:bg-surface-soft disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || isLoading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-strong disabled:opacity-50"
          >
            {isLoading ? "Uploading..." : `Upload ${files.length} file(s)`}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadModal;
