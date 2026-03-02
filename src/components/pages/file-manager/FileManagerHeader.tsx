"use client";

import { ChevronRight, FolderPlus, Upload } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  breadcrumbs: Array<{ id: string; name: string }>;
  onBreadcrumbClick: (index: number) => void;
  onUploadClick: () => void;
  onCreateFolderClick: () => void;
  selectedCount: number;
};

const FileManagerHeader = ({
  breadcrumbs,
  onBreadcrumbClick,
  onUploadClick,
  onCreateFolderClick,
  selectedCount,
}: Props) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.id + index} className="flex items-center gap-1">
            <button
              onClick={() => onBreadcrumbClick(index)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                index === breadcrumbs.length - 1
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-surface-soft hover:text-app-text"
              }`}
            >
              {crumb.name}
            </button>
            {index < breadcrumbs.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted" />
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mr-2 rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent"
          >
            {selectedCount} selected
          </motion.div>
        )}

        <button
          onClick={onCreateFolderClick}
          className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface px-4 py-2 text-sm font-medium text-app-text transition-colors hover:bg-surface-soft"
        >
          <FolderPlus className="h-4 w-4" />
          <span className="hidden sm:inline">New Folder</span>
        </button>

        <button
          onClick={onUploadClick}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-primary-strong"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload</span>
        </button>
      </div>
    </div>
  );
};

export default FileManagerHeader;
