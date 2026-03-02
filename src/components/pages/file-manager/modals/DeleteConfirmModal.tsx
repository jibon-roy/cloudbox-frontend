"use client";

import { AlertTriangle, X } from "lucide-react";
import { motion } from "framer-motion";
import {
  useDeleteFileMutation,
  useDeleteFolderMutation,
} from "@/src/redux/features/file-system/fileSystemApi";
import Swal from "sweetalert2";
import { colors } from "@/src/lib/colors";

type Props = {
  target: {
    id: string;
    type: "file" | "folder";
    name: string;
  };
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteConfirmModal = ({ target, onClose, onConfirm }: Props) => {
  const [deleteFile, { isLoading: deletingFile }] = useDeleteFileMutation();
  const [deleteFolder, { isLoading: deletingFolder }] =
    useDeleteFolderMutation();

  const isLoading = deletingFile || deletingFolder;

  const handleDelete = async () => {
    try {
      if (target.type === "file") {
        await deleteFile(target.id).unwrap();
      } else {
        await deleteFolder(target.id).unwrap();
      }

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `"${target.name}" has been deleted successfully.`,
        timer: 2000,
        showConfirmButton: false,
      });

      onConfirm();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          error?.data?.message ||
          `Failed to delete ${target.type}. Please try again.`,
        confirmButtonColor: colors.primary,
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
            <div className="rounded-lg bg-red-500/10 p-2">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-app-text">Confirm Delete</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-soft hover:text-app-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-sm text-app-text">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-error">"{target.name}"</span>?
          </p>
          {target.type === "folder" && (
            <p className="mt-2 text-sm text-muted">
              This will delete the folder and all its contents permanently.
            </p>
          )}
          <p className="mt-2 text-sm font-semibold text-red-500">
            This action cannot be undone.
          </p>
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
            onClick={handleDelete}
            disabled={isLoading}
            className="rounded-lg bg-error px-4 py-2 text-sm bg-red-500 font-semibold text-white transition-colors hover:bg-red-600/90 disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmModal;
