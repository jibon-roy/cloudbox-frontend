"use client";

import { X, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  file: any;
  onClose: () => void;
};

const PdfViewerModal = ({ file, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const fileName = file.name || "PDF";
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
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-surface shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle bg-surface px-6 py-4">
          <p className="truncate text-sm font-semibold text-app-text">
            {fileName}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              title="Download PDF"
              className="rounded-lg bg-surface-soft p-1.5 hover:bg-border-subtle"
            >
              <Download className="h-5 w-5 text-muted" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-surface-soft p-1.5 hover:bg-border-subtle"
            >
              <X className="h-5 w-5 text-muted" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="relative bg-black/50">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-soft border-t-primary" />
            </div>
          ) : null}
          <iframe
            src={`${downloadUrl}#toolbar=1`}
            style={{ height: "calc(90vh - 80px)", width: "100%" }}
            onLoad={() => setIsLoading(false)}
            className="rounded-b-lg"
            title="PDF Viewer"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PdfViewerModal;
