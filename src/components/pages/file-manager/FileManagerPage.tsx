"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FileManagerHeader from "./FileManagerHeader";
import FileManagerToolbar from "./FileManagerToolbar";
import FileManagerView from "./FileManagerView";
import UploadModal from "./modals/UploadModal";
import CreateFolderModal from "./modals/CreateFolderModal";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";
import ImageViewerModal from "./modals/ImageViewerModal";
import VideoPlayerModal from "./modals/VideoPlayerModal";
import AudioPlayerModal from "./modals/AudioPlayerModal";
import PdfViewerModal from "./modals/PdfViewerModal";
import UnsupportedFileModal from "./modals/UnsupportedFileModal";
import { useGetFileSystemTreeQuery } from "@/src/redux/features/file-system/fileSystemApi";

export type ViewMode = "grid" | "list";
export type SortOption = "name" | "updated" | "size" | "type";

// Helper to find current folder and its contents in the tree
const findFolderInTree = (
  tree: any[],
  folderId: string,
): { folders: any[]; files: any[] } | null => {
  if (!folderId || folderId === "") {
    // Root level - return all top-level folders and files with no parent
    return {
      folders: tree || [],
      files: [], // Root files would need to be fetched separately if they exist at root
    };
  }

  // Search recursively for the folder
  for (const folder of tree) {
    if (folder.id === folderId) {
      return {
        folders: folder.children || [],
        files: folder.files || [],
      };
    }
    if (folder.children && folder.children.length > 0) {
      const found = findFolderInTree(folder.children, folderId);
      if (found) return found;
    }
  }

  return null;
};

const FileManagerPage = () => {
  const [currentFolderId, setCurrentFolderId] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    type: "file" | "folder";
    name: string;
  } | null>(null);
  const [viewFile, setViewFile] = useState<any | null>(null);

  // Breadcrumb path
  const [breadcrumbs, setBreadcrumbs] = useState<
    Array<{ id: string; name: string }>
  >([{ id: "", name: "My Drive" }]);

  // Fetch file system tree
  const { data: treeData, isLoading } = useGetFileSystemTreeQuery({
    search: searchQuery,
    page: 1,
    limit: 100,
  });

  // Extract tree array from response
  const tree = Array.isArray(treeData)
    ? treeData
    : treeData?.data && Array.isArray(treeData.data)
      ? treeData.data
      : [];

  // Get current folder contents
  const currentFolderData = findFolderInTree(tree, currentFolderId);
  const folders = currentFolderData?.folders || [];
  const files = currentFolderData?.files || [];

  const handleNavigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setBreadcrumbs([...breadcrumbs, { id: folderId, name: folderName }]);
    setSelectedItems([]);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentFolderId(newBreadcrumbs[newBreadcrumbs.length - 1].id);
    setSelectedItems([]);
  };

  const handleDeleteClick = (
    id: string,
    type: "file" | "folder",
    name: string,
  ) => {
    setDeleteTarget({ id, type, name });
  };

  const handleDeleteConfirm = () => {
    setDeleteTarget(null);
    setSelectedItems([]);
  };

  return (
    <div className="flex h-full flex-col space-y-4">
      {/* Header with breadcrumbs and action buttons */}
      <FileManagerHeader
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={handleBreadcrumbClick}
        onUploadClick={() => setShowUploadModal(true)}
        onCreateFolderClick={() => setShowCreateFolderModal(true)}
        selectedCount={selectedItems.length}
      />

      {/* Toolbar with view toggle, sort, and search */}
      <FileManagerToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main file/folder view */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 overflow-auto"
      >
        <FileManagerView
          viewMode={viewMode}
          folders={folders}
          files={files}
          isLoading={isLoading}
          selectedItems={selectedItems}
          onSelectItem={(id: string) => {
            if (selectedItems.includes(id)) {
              setSelectedItems(selectedItems.filter((item) => item !== id));
            } else {
              setSelectedItems([...selectedItems, id]);
            }
          }}
          onNavigateToFolder={handleNavigateToFolder}
          onDeleteClick={handleDeleteClick}
          onViewFile={setViewFile}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </motion.div>

      {/* Modals */}
      {showUploadModal && (
        <UploadModal
          currentFolderId={currentFolderId}
          onClose={() => setShowUploadModal(false)}
        />
      )}

      {showCreateFolderModal && (
        <CreateFolderModal
          parentId={currentFolderId}
          onClose={() => setShowCreateFolderModal(false)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          target={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* File Viewers */}
      {viewFile &&
        (() => {
          const mimeType = viewFile.mime_type || "application/octet-stream";

          if (
            mimeType.includes("image/jpeg") ||
            mimeType.includes("image/png") ||
            mimeType.includes("image/gif") ||
            mimeType.includes("image/webp") ||
            mimeType.includes("image/svg")
          ) {
            return (
              <ImageViewerModal
                file={viewFile}
                onClose={() => setViewFile(null)}
              />
            );
          }

          if (mimeType.includes("video/")) {
            return (
              <VideoPlayerModal
                file={viewFile}
                onClose={() => setViewFile(null)}
              />
            );
          }

          if (mimeType.includes("audio/")) {
            return (
              <AudioPlayerModal
                file={viewFile}
                onClose={() => setViewFile(null)}
              />
            );
          }

          if (mimeType.includes("application/pdf")) {
            return (
              <PdfViewerModal
                file={viewFile}
                onClose={() => setViewFile(null)}
              />
            );
          }

          return (
            <UnsupportedFileModal
              file={viewFile}
              onClose={() => setViewFile(null)}
            />
          );
        })()}
    </div>
  );
};

export default FileManagerPage;
