"use client";

import {
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  FileCode,
  FileArchive,
  MoreVertical,
  Download,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  file: any;
  viewMode: "grid" | "list";
  isSelected: boolean;
  onSelect: () => void;
  onViewFile: () => void;
  onDelete: () => void;
};

const getFileIcon = (mimeType: string) => {
  // Images
  if (
    mimeType.includes("image/jpeg") ||
    mimeType.includes("image/png") ||
    mimeType.includes("image/gif") ||
    mimeType.includes("image/webp") ||
    mimeType.includes("image/svg")
  )
    return FileImage;

  // Videos
  if (
    mimeType.includes("video/mp4") ||
    mimeType.includes("video/quicktime") ||
    mimeType.includes("video/webm") ||
    mimeType.includes("video/x-msvideo") ||
    mimeType.startsWith("video/")
  )
    return FileVideo;

  // Audio
  if (
    mimeType.includes("audio/mpeg") ||
    mimeType.includes("audio/wav") ||
    mimeType.includes("audio/ogg") ||
    mimeType.startsWith("audio/")
  )
    return FileAudio;

  // PDF
  if (mimeType.includes("application/pdf")) return FileText;

  // Archives
  if (
    mimeType.includes("application/zip") ||
    mimeType.includes("application/7z") ||
    mimeType.includes("application/rar") ||
    mimeType.includes("application/x-rar")
  )
    return FileArchive;

  // Documents
  if (
    mimeType.includes("application/msword") ||
    mimeType.includes("application/vnd.openxmlformats") ||
    mimeType.includes("application/vnd.ms-word")
  )
    return FileText;

  // Code
  if (
    mimeType.includes("javascript") ||
    mimeType.includes("json") ||
    mimeType.includes("html") ||
    mimeType.includes("xml") ||
    mimeType.includes("text/")
  )
    return FileCode;

  return File;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const FileItem = ({
  file,
  viewMode,
  isSelected,
  onSelect,
  onViewFile,
  onDelete,
}: Props) => {
  const [showMenu, setShowMenu] = useState(false);
  const fileName = file.originalName || file.name || "Untitled";
  const fileSize = formatFileSize(Number(file.size || 0));
  const mimeType =
    file.mimeType || file.mime_type || "application/octet-stream";
  const updatedAt = file.updated_at || file.updatedAt;
  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const FileIcon = getFileIcon(mimeType);
  const downloadUrl = file.url || file.path || "";

  if (viewMode === "grid") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        onClick={(e) => {
          if (e.ctrlKey || e.metaKey) {
            onSelect();
          } else {
            onViewFile();
          }
        }}
        className={`group relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
          isSelected
            ? "border-primary bg-primary/5"
            : "border-border-subtle bg-surface hover:border-primary/30 hover:bg-surface-soft"
        }`}
      >
        {/* File Preview/Icon */}
        <div className="mb-3 flex items-center justify-center">
          {mimeType.startsWith("image/") && file.url ? (
            <div className="h-16 w-16 overflow-hidden rounded-lg">
              <img
                src={file.url}
                alt={fileName}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <FileIcon
              className={`h-12 w-12 ${
                isSelected ? "text-primary" : "text-info"
              }`}
            />
          )}
        </div>

        {/* File Name */}
        <p
          className="truncate text-center text-sm font-medium text-app-text"
          title={fileName}
        >
          {fileName}
        </p>
        <p className="mt-1 text-center text-xs text-muted">{fileSize}</p>

        {/* Actions Menu */}
        <div className="absolute right-2 top-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="rounded-lg bg-surface p-1.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-surface-soft cursor-pointer"
          >
            <MoreVertical className="h-4 w-4 text-muted" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 z-10 w-40 rounded-lg border border-border-subtle bg-surface shadow-lg">
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={fileName}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left cursor-pointer text-sm text-app-text hover:bg-surface-soft"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setShowMenu(false);
                }}
                className="flex w-full items-center  cursor-pointer gap-2 px-4 py-2 text-left text-sm text-error hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // List View
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(var(--surface-soft-rgb), 0.5)" }}
      onClick={() => onViewFile()}
      className={`grid cursor-pointer grid-cols-12 gap-4 rounded-lg border px-4 py-3 transition-colors ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-transparent hover:border-border-subtle"
      }`}
    >
      {/* Name */}
      <div className="col-span-5 flex items-center gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="h-4 w-4 rounded border-border-subtle text-primary focus:ring-2 focus:ring-primary/20"
        />
        <FileIcon className="h-5 w-5 shrink-0 text-info" />
        <span
          className="truncate text-sm font-medium text-app-text"
          title={fileName}
        >
          {fileName}
        </span>
      </div>

      {/* Modified Date */}
      <div className="col-span-3 hidden items-center text-sm text-muted md:flex">
        {formattedDate}
      </div>

      {/* Size */}
      <div className="col-span-2 hidden items-center text-sm text-muted lg:flex">
        {fileSize}
      </div>

      {/* Actions */}
      <div className="col-span-2 flex items-center justify-end gap-2">
        {downloadUrl && (
          <a
            href={downloadUrl}
            download={fileName}
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-info/10 hover:text-info"
            title="Download file"
          >
            <Download className="h-4 w-4" />
          </a>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-error/10 hover:text-error"
          title="Delete file"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default FileItem;
