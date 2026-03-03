"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  useGetAllSubscriptionsAdminQuery,
  useCreateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from "@/src/redux/features/subscription/subscriptionApi";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentToken } from "@/src/redux/features/auth/authSlice";
import { Package, Plus, Trash2, Edit, X } from "lucide-react";
import { toast } from "sonner";

interface Subscription {
  id: string;
  name: string;
  price: number;
  max_folders: number;
  max_file_size_mb: number;
  max_storage_mb: number;
  max_nesting_level: number;
  total_file_limit: number;
  files_per_folder: number;
  trial_days: number;
  is_active: boolean;
  createdAt?: string;
}

const SubscriptionManagement = () => {
  const accessToken = useAppSelector(selectCurrentToken);
  const skip = !accessToken;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);

  const { data: subscriptionsRaw, isLoading } =
    useGetAllSubscriptionsAdminQuery(undefined, {
      skip,
    });

  const [createSubscription, { isLoading: isCreating }] =
    useCreateSubscriptionMutation();
  const [deleteSubscription, { isLoading: isDeleting }] =
    useDeleteSubscriptionMutation();
  const [updateSubscription, { isLoading: isUpdating }] =
    useUpdateSubscriptionMutation();

  const subscriptions =
    (subscriptionsRaw as { data?: Subscription[] })?.data || [];

  const AVAILABLE_MIME_TYPES = [
    "IMAGE_JPEG",
    "IMAGE_PNG",
    "IMAGE_GIF",
    "IMAGE_WEBP",
    "IMAGE_SVG",
    "VIDEO_MP4",
    "VIDEO_QUICKTIME",
    "VIDEO_WEBM",
    "VIDEO_X_MSVIDEO",
    "AUDIO_MPEG",
    "AUDIO_WAV",
    "AUDIO_OGG",
    "APPLICATION_PDF",
    "APPLICATION_ZIP",
    "APPLICATION_7Z",
    "APPLICATION_RAR",
    "APPLICATION_DOC",
    "APPLICATION_DOCX",
  ];

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    max_folders: 0,
    max_file_size_mb: 0,
    max_storage_mb: 0,
    max_nesting_level: 0,
    total_file_limit: 0,
    files_per_folder: 0,
    trial_days: 0,
    is_active: true,
    mime_types: [] as string[],
  });

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      max_folders: 0,
      max_file_size_mb: 0,
      max_storage_mb: 0,
      max_nesting_level: 0,
      total_file_limit: 0,
      files_per_folder: 0,
      trial_days: 0,
      is_active: true,
      mime_types: [],
    });
  };

  const handleCreate = async () => {
    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price) || 0,
        max_folders: Number(formData.max_folders) || 0,
        max_nesting_level: Number(formData.max_nesting_level) || 0,
        total_file_limit: Number(formData.total_file_limit) || 0,
        files_per_folder: Number(formData.files_per_folder) || 0,
        max_file_size_mb: Number(formData.max_file_size_mb) || 0,
        max_storage_mb: Number(formData.max_storage_mb) || 0,
        trial_days: Number(formData.trial_days) || 0,
        is_active: formData.is_active,
        mime_types: formData.mime_types,
      };
      await createSubscription(payload).unwrap();
      toast.success("Subscription package created successfully!");
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create subscription");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteSubscription(id).unwrap();
      toast.success("Subscription deleted successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete subscription");
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setFormData({
      name: subscription.name,
      price: subscription.price,
      max_folders: subscription.max_folders,
      max_file_size_mb: subscription.max_file_size_mb,
      max_storage_mb: subscription.max_storage_mb,
      max_nesting_level: subscription.max_nesting_level,
      total_file_limit: subscription.total_file_limit,
      files_per_folder: subscription.files_per_folder,
      trial_days: subscription.trial_days,
      is_active: subscription.is_active,
      mime_types: (subscription as any).mime_types || [],
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingSubscription) return;

    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price) || 0,
        max_folders: Number(formData.max_folders) || 0,
        max_nesting_level: Number(formData.max_nesting_level) || 0,
        total_file_limit: Number(formData.total_file_limit) || 0,
        files_per_folder: Number(formData.files_per_folder) || 0,
        max_file_size_mb: Number(formData.max_file_size_mb) || 0,
        max_storage_mb: Number(formData.max_storage_mb) || 0,
        trial_days: Number(formData.trial_days) || 0,
        is_active: formData.is_active,
        mime_types: formData.mime_types,
      };
      await updateSubscription({
        id: editingSubscription.id,
        data: payload,
      }).unwrap();
      toast.success("Subscription updated successfully!");
      setIsEditModalOpen(false);
      setEditingSubscription(null);
      resetForm();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update subscription");
    }
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEditingSubscription(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-border-subtle bg-surface p-6 lg:p-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-app-text lg:text-3xl">
              Subscription Management
            </h1>
            <p className="mt-2 text-sm text-muted">
              Create, edit, and manage subscription packages
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 text-white rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create Package
          </motion.button>
        </div>
      </div>

      {/* Subscriptions Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl bg-surface-soft"
            />
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="rounded-2xl border border-border-subtle bg-surface p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 text-lg font-semibold text-app-text">
            No subscription packages found
          </h3>
          <p className="mt-2 text-sm text-muted">
            Create your first subscription package to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((sub) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl border border-border-subtle bg-surface p-6 transition-all hover:shadow-lg"
            >
              {/* Status Badge */}
              <div className="absolute right-4 top-4">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    sub.is_active
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
                  }`}
                >
                  {sub.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <h3 className="text-xl font-bold text-app-text">{sub.name}</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-bold text-primary">
                  ${(Number(sub.price) || 0).toFixed(2)}
                </span>
                <span className="ml-2 text-sm text-muted">/month</span>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Storage:</span>
                  <span className="font-medium text-app-text">
                    {((Number(sub.max_storage_mb) || 0) / 1024).toFixed(1)} GB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Max Folders:</span>
                  <span className="font-medium text-app-text">
                    {(Number(sub.max_folders) || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">File Size Limit:</span>
                  <span className="font-medium text-app-text">
                    {Number(sub.max_file_size_mb) || 0} MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Total Files:</span>
                  <span className="font-medium text-app-text">
                    {(Number(sub.total_file_limit) || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Trial Days:</span>
                  <span className="font-medium text-app-text">
                    {Number(sub.trial_days) || 0}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEdit(sub)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border-subtle bg-surface-soft px-3 py-2 text-sm font-medium text-app-text transition-colors hover:bg-surface-soft/80"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDelete(sub.id, sub.name)}
                  disabled={isDeleting}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-500 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border-subtle bg-surface p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-app-text">
                {isEditModalOpen
                  ? "Edit Subscription"
                  : "Create New Subscription"}
              </h2>
              <button
                onClick={closeModals}
                className="text-muted hover:text-app-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-app-text">
                  Package Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-border-subtle bg-surface-soft px-4 py-2 text-app-text focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Pro, Enterprise"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-app-text">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-border-subtle bg-surface-soft px-4 py-2 text-app-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-app-text">
                    Trial Days
                  </label>
                  <input
                    type="number"
                    value={formData.trial_days}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trial_days: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-border-subtle bg-surface-soft px-4 py-2 text-app-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-app-text">
                    Storage (MB)
                  </label>
                  <input
                    type="number"
                    value={formData.max_storage_mb}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_storage_mb: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-border-subtle bg-surface-soft px-4 py-2 text-app-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-app-text">
                    Max File Size (MB)
                  </label>
                  <input
                    type="number"
                    value={formData.max_file_size_mb}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_file_size_mb: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-border-subtle bg-surface-soft px-4 py-2 text-app-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-app-text">
                    Max Folders
                  </label>
                  <input
                    type="number"
                    value={formData.max_folders}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_folders: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-border-subtle bg-surface-soft px-4 py-2 text-app-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-app-text">
                    Total File Limit
                  </label>
                  <input
                    type="number"
                    value={formData.total_file_limit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_file_limit: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-border-subtle bg-surface-soft px-4 py-2 text-app-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-app-text">
                    Files Per Folder
                  </label>
                  <input
                    type="number"
                    value={formData.files_per_folder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        files_per_folder: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-border-subtle bg-surface-soft px-4 py-2 text-app-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-app-text">
                    Max Nesting Level
                  </label>
                  <input
                    type="number"
                    value={formData.max_nesting_level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_nesting_level: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-border-subtle bg-surface-soft px-4 py-2 text-app-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-app-text">
                  Allowed File Types
                </label>
                <div className="max-h-48 overflow-y-auto rounded-lg border border-border-subtle bg-surface-soft p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_MIME_TYPES.map((mimeType) => (
                      <label
                        key={mimeType}
                        className="flex items-center gap-2 text-sm text-app-text hover:bg-surface-soft/50 rounded px-2 py-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.mime_types.includes(mimeType)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                mime_types: [...formData.mime_types, mimeType],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                mime_types: formData.mime_types.filter(
                                  (t) => t !== mimeType,
                                ),
                              });
                            }
                          }}
                          className="h-4 w-4 rounded border-border-subtle text-primary focus:ring-2 focus:ring-primary"
                        />
                        <span>{mimeType.replace(/_/g, " ").toLowerCase()}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {formData.mime_types.length} file type(s) selected
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-border-subtle text-primary focus:ring-2 focus:ring-primary"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium text-app-text"
                >
                  Active Package
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={closeModals}
                className="flex-1 rounded-lg border border-border-subtle bg-surface-soft px-4 py-2 text-sm font-medium text-app-text transition-colors hover:bg-surface-soft/80"
              >
                Cancel
              </button>
              <button
                onClick={isEditModalOpen ? handleUpdate : handleCreate}
                disabled={isCreating || isUpdating}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {isCreating || isUpdating
                  ? "Saving..."
                  : isEditModalOpen
                    ? "Update"
                    : "Create"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
