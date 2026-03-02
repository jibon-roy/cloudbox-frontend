"use client";

import { X, FileQuestion, Download } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  file: any;
  onClose: () => void;
};

const UnsupportedFileModal = ({ file, onClose }: Props) => {
  const fileName = file.name || "File";
  const mimeType = file.mime_type || "Unknown";
  const downloadUrl = file.downloadUrl || file.url || "";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-md rounded-lg bg-surface shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <p className="text-sm font-semibold text-app-text">File Preview</p>
          <button
            onClick={onClose}
            className="rounded-lg bg-surface-soft p-1.5 hover:bg-border-subtle"
          >
            <X className="h-5 w-5 text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 px-6 py-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-surface-soft p-6">
              <FileQuestion className="h-12 w-12 text-muted" />
            </div>
          </div>

          {/* Message */}
          <div className="text-center">
            <p className="font-semibold text-app-text">File Type Unsupported</p>
            <p className="mt-2 text-sm text-muted">
              This file type cannot be previewed in the browser.
            </p>
            <p className="mt-1 text-xs text-muted">
              {fileName} ({mimeType})
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-border-subtle px-4 py-2 text-sm font-medium text-app-text hover:bg-surface-soft transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UnsupportedFileModal;
