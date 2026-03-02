"use client";

import { ViewMode, SortOption } from "./FileManagerPage";
import FolderItem from "./items/FolderItem";
import FileItem from "./items/FileItem";
import { motion } from "framer-motion";
import { FileQuestion, FolderOpen } from "lucide-react";

type Props = {
  viewMode: ViewMode;
  folders: any[];
  files: any[];
  isLoading: boolean;
  selectedItems: string[];
  onSelectItem: (id: string) => void;
  onNavigateToFolder: (id: string, name: string) => void;
  onDeleteClick: (id: string, type: "file" | "folder", name: string) => void;
  onViewFile: (file: any) => void;
  sortBy: SortOption;
  sortOrder: "asc" | "desc";
};

const FileManagerView = ({
  viewMode,
  folders,
  files,
  isLoading,
  selectedItems,
  onSelectItem,
  onNavigateToFolder,
  onDeleteClick,
  onViewFile,
  sortBy,
  sortOrder,
}: Props) => {
  // Sort items
  const sortItems = (items: any[], type: "file" | "folder") => {
    return [...items].sort((a, b) => {
      let compareA: any;
      let compareB: any;

      switch (sortBy) {
        case "name":
          compareA = String(a.name || a.originalName || "").toLowerCase();
          compareB = String(b.name || b.originalName || "").toLowerCase();
          break;
        case "updated":
          compareA = new Date(a.updated_at || a.updatedAt || 0).getTime();
          compareB = new Date(b.updated_at || b.updatedAt || 0).getTime();
          break;
        case "size":
          compareA = Number(a.size || 0);
          compareB = Number(b.size || 0);
          break;
        case "type":
          if (type === "file") {
            compareA = String(a.mimeType || a.mime_type || "").toLowerCase();
            compareB = String(b.mimeType || b.mime_type || "").toLowerCase();
          } else {
            compareA = "folder";
            compareB = "folder";
          }
          break;
        default:
          return 0;
      }

      if (compareA < compareB) return sortOrder === "asc" ? -1 : 1;
      if (compareA > compareB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sortedFolders = sortItems(folders, "folder");
  const sortedFiles = sortItems(files, "file");

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-4 border-surface-soft border-t-primary"
        />
      </div>
    );
  }

  if (sortedFolders.length === 0 && sortedFiles.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-muted">
          {folders.length === 0 && files.length === 0 ? (
            <>
              <FolderOpen className="h-12 w-12" />
              <FileQuestion className="h-12 w-12" />
            </>
          ) : (
            <FileQuestion className="h-12 w-12" />
          )}
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-app-text">No items found</p>
          <p className="mt-1 text-sm text-muted">
            Upload files or create folders to get started
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="space-y-6">
        {/* Folders Section */}
        {sortedFolders.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-muted">Folders</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {sortedFolders.map((folder: any) => (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  viewMode="grid"
                  isSelected={selectedItems.includes(folder.id)}
                  onSelect={() => onSelectItem(folder.id)}
                  onNavigate={() =>
                    onNavigateToFolder(
                      folder.id,
                      folder.name || "Untitled Folder",
                    )
                  }
                  onDelete={() =>
                    onDeleteClick(
                      folder.id,
                      "folder",
                      folder.name || "Untitled Folder",
                    )
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Files Section */}
        {sortedFiles.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-muted">Files</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {sortedFiles.map((file: any) => (
                <FileItem
                  key={file.id}
                  file={file}
                  viewMode="grid"
                  isSelected={selectedItems.includes(file.id)}
                  onSelect={() => onSelectItem(file.id)}
                  onViewFile={() => onViewFile(file)}
                  onDelete={() =>
                    onDeleteClick(
                      file.id,
                      "file",
                      file.originalName || file.name || "Untitled",
                    )
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-1">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 border-b border-border-subtle px-4 py-2 text-xs font-semibold text-muted">
        <div className="col-span-5">Name</div>
        <div className="col-span-3 hidden md:block">Modified</div>
        <div className="col-span-2 hidden lg:block">Size</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* Folders */}
      {sortedFolders.map((folder: any) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          viewMode="list"
          isSelected={selectedItems.includes(folder.id)}
          onSelect={() => onSelectItem(folder.id)}
          onNavigate={() =>
            onNavigateToFolder(folder.id, folder.name || "Untitled Folder")
          }
          onDelete={() =>
            onDeleteClick(folder.id, "folder", folder.name || "Untitled Folder")
          }
        />
      ))}

      {/* Files */}
      {sortedFiles.map((file: any) => (
        <FileItem
          key={file.id}
          file={file}
          viewMode="list"
          isSelected={selectedItems.includes(file.id)}
          onSelect={() => onSelectItem(file.id)}
          onViewFile={() => onViewFile(file)}
          onDelete={() =>
            onDeleteClick(
              file.id,
              "file",
              file.originalName || file.name || "Untitled",
            )
          }
        />
      ))}
    </div>
  );
};

export default FileManagerView;
