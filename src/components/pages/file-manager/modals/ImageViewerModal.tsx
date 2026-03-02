"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  file: any;
  onClose: () => void;
};

const ImageViewerModal = ({ file, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const fileName = file.name || "Image";
  const downloadUrl = file.downloadUrl || file.url || "";

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
        className="relative max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-surface shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-border-subtle bg-surface px-6 py-4">
          <p className="truncate text-sm font-semibold text-app-text">
            {fileName}
          </p>
          <button
            onClick={onClose}
            className="rounded-lg bg-surface-soft p-1.5 hover:bg-border-subtle"
          >
            <X className="h-5 w-5 text-muted" />
          </button>
        </div>

        {/* Image Content */}
        <div className="flex items-center justify-center bg-black/50 p-6">
          {isLoading && (
            <div className="absolute flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-soft border-t-primary" />
            </div>
          )}
          <img
            src={downloadUrl}
            alt={fileName}
            style={{
              maxHeight: "calc(90vh - 100px)",
              maxWidth: "calc(90vw - 48px)",
            }}
            className="object-contain"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-border-subtle bg-surface px-6 py-3">
          <p className="text-xs text-muted">
            Image: {file.name} ({file.size_bytes} bytes)
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImageViewerModal;
