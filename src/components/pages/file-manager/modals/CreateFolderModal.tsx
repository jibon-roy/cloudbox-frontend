"use client";

import { X, FolderPlus } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCreateFolderMutation } from "@/src/redux/features/file-system/fileSystemApi";
import Swal from "sweetalert2";
import { colors } from "@/src/lib/colors";

type Props = {
  parentId: string;
  onClose: () => void;
};

const CreateFolderModal = ({ parentId, onClose }: Props) => {
  const [folderName, setFolderName] = useState("");
  const [createFolder, { isLoading }] = useCreateFolderMutation();

  const handleCreate = async () => {
    if (!folderName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Folder Name Required",
        text: "Please enter a folder name.",
      });
      return;
    }

    try {
      await createFolder({
        name: folderName.trim(),
        parentId: parentId || undefined,
      }).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Folder Created!",
        text: `"${folderName}" has been created successfully.`,
        timer: 2000,
        showConfirmButton: false,
      });

      onClose();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Creation Failed",
        text:
              error?.data?.message || "Failed to create folder. Please try again.",
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
        className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface p-6 shadow-xl"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-2">
              <FolderPlus className="h-6 w-6 text-accent" />
            </div>
            <h2 className="text-xl font-bold text-app-text">New Folder</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-soft hover:text-app-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input */}
        <div className="mb-6">
          <label
            htmlFor="folderName"
            className="mb-2 block text-sm font-semibold text-app-text"
          >
            Folder Name
          </label>
          <input
            id="folderName"
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreate();
              }
            }}
            placeholder="Enter folder name..."
            autoFocus
            className="w-full rounded-lg border border-border-subtle bg-surface-soft px-4 py-2.5 text-sm text-app-text placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

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
            onClick={handleCreate}
            disabled={isLoading || !folderName.trim()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-strong disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Folder"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateFolderModal;
