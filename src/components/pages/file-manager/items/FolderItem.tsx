"use client";

import { BoxSelect, Folder, MoreVertical, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  folder: any;
  viewMode: "grid" | "list";
  isSelected: boolean;
  onSelect: () => void;
  onNavigate: () => void;
  onDelete: () => void;
};

const FolderItem = ({
  folder,
  viewMode,
  isSelected,
  onSelect,
  onNavigate,
  onDelete,
}: Props) => {
  const [showMenu, setShowMenu] = useState(false);
  const folderName = folder.name || "Untitled Folder";
  const updatedAt = folder.updated_at || folder.updatedAt;
  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  if (viewMode === "grid") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        onClick={(e) => {
          if (e.ctrlKey || e.metaKey) {
            onSelect();
          } else {
            onNavigate();
          }
        }}
        className={`group relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
          isSelected
            ? "border-primary bg-primary/5"
            : "border-border-subtle bg-surface hover:border-primary/30 hover:bg-surface-soft"
        }`}
      >
        {/* Folder Icon */}
        <div className="mb-3 flex items-center justify-center">
          <Folder
            className={`h-12 w-12 ${
              isSelected ? "text-primary" : "text-accent"
            }`}
          />
        </div>

        {/* Folder Name */}
        <p className="truncate text-center text-sm font-medium text-app-text">
          {folderName}
        </p>

        {/* Actions Menu */}
        <div className="absolute right-2 top-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="rounded-lg bg-surface p-1.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-surface-soft"
          >
            <MoreVertical className="h-4 w-4 text-muted" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 z-10 w-40 rounded-lg border border-border-subtle bg-surface shadow-lg">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm cursor-pointer text-app-text hover:bg-surface-soft"
              >
                <BoxSelect className="mr-2 inline h-4 w-4" />
                Select
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-error hover:bg-red-500/10 cursor-pointer"
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
      onClick={onNavigate}
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
        <Folder className="h-5 w-5 shrink-0 text-accent" />
        <span className="truncate text-sm font-medium text-app-text">
          {folderName}
        </span>
      </div>

      {/* Modified Date */}
      <div className="col-span-3 hidden items-center text-sm text-muted md:flex">
        {formattedDate}
      </div>

      {/* Size */}
      <div className="col-span-2 hidden items-center text-sm text-muted lg:flex">
        —
      </div>

      {/* Actions */}
      <div className="col-span-2 flex items-center justify-end gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-error/10 hover:text-error"
          title="Delete folder"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default FolderItem;
