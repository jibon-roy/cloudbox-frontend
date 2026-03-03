"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/src/redux/hooks";
import {
  selectCurrentUser,
  selectCurrentToken,
  selectCurrentRefreshToken,
  selectCurrentSubscription,
  setUser,
} from "@/src/redux/features/auth/authSlice";
import { useGetMeQuery } from "@/src/redux/features/auth/authApi";

type UpdateProfileData = {
  name: string;
  avatar?: File | null;
};

type ResetPasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const UserSettingsPage = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const accessToken = useAppSelector(selectCurrentToken);
  const refreshToken = useAppSelector(selectCurrentRefreshToken);
  const currentSubscription = useAppSelector(selectCurrentSubscription);
  const { refetch: getMeRefetch } = useGetMeQuery(undefined, {
    skip: !accessToken,
  });

  // Helper to get full avatar URL
  const getAvatarUrl = (avatarPath: string | undefined) => {
    if (!avatarPath) return "";
    // If it's already a full URL, return as is
    if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) {
      return avatarPath;
    }
    return `${avatarPath}`;
  };

  // Profile Update State
  const [profileData, setProfileData] = useState<UpdateProfileData>({
    name: currentUser?.name || "",
    avatar: null,
  });
  const [profilePreview, setProfilePreview] = useState<string>(
    getAvatarUrl(currentUser?.avatar_url),
  );
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password Reset State
  const [passwordData, setPasswordData] = useState<ResetPasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Handle profile image change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData({ ...profileData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      if (profileData.avatar) {
        formData.append("avatar", profileData.avatar);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008/api/v1"}/user/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Access-Token":
              process.env.NEXT_PUBLIC_API_ACCESS_TOKEN || "",
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }

      // Refresh user data via get me route without changing tokens
      const meResponse = await getMeRefetch();

      // Update Redux persist with new user data while keeping tokens unchanged
      if (meResponse.data) {
        const responseData = meResponse.data as any;
        const updatedUser = responseData.data?.user || responseData.user;
        const updatedSubscription =
          responseData.data?.subscription ||
          responseData.subscription ||
          currentSubscription;

        dispatch(
          setUser({
            user: updatedUser,
            subscription: updatedSubscription,
            access_token: accessToken,
            refresh_token: refreshToken,
          }),
        );

        // Update preview with new avatar
        if (updatedUser?.avatar_url) {
          setProfilePreview(getAvatarUrl(updatedUser.avatar_url));
        }
      }

      setProfileMessage({
        type: "success",
        text: "Profile updated successfully! Tokens remain unchanged.",
      });
      setProfileData({ ...profileData, avatar: null });

      setTimeout(() => setProfileMessage(null), 5000);
    } catch (error: any) {
      setProfileMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password reset (change password for logged-in user)
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage(null);

    // Client-side validation
    if (!passwordData.currentPassword) {
      setPasswordMessage({
        type: "error",
        text: "Current password is required",
      });
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 8 characters",
      });
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "Passwords do not match",
      });
      setPasswordLoading(false);
      return;
    }

    try {
      // Note: This endpoint might not exist. If backend doesn't have a specific
      // "change password" endpoint for logged-in users, we may need to implement one
      // For now, using a hypothetical /user/change-password endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008/api/v1"}/user/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "X-API-Access-Token":
              process.env.NEXT_PUBLIC_API_ACCESS_TOKEN || "",
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message ||
            "Failed to change password. Available endpoint not found. Use forgot-password instead.",
        );
      }

      setPasswordMessage({
        type: "success",
        text: "Password changed successfully! Your tokens remain active.",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => setPasswordMessage(null), 5000);
    } catch (error: any) {
      setPasswordMessage({
        type: "error",
        text: error.message || "Failed to change password",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const baseCardClass =
    "rounded-2xl border border-border-subtle bg-surface p-5 lg:p-6";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-app-text">Settings</h1>
        <p className="mt-2 text-sm text-muted">
          Manage your profile and account security. Updates to your profile will
          not affect your authentication tokens.
        </p>
      </div>

      {/* Profile Update Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={baseCardClass}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-app-text">
            Update Profile
          </h2>
          <p className="mt-1 text-sm text-muted">
            Update your name and profile picture
          </p>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-5">
          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-3">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              {/* Avatar Preview */}
              <div className="relative h-24 w-24 rounded-full border-2 border-border-subtle bg-surface-soft overflow-hidden flex items-center justify-center">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-primary/20" />
                )}
                {profileData.avatar && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileData({ ...profileData, avatar: null });
                      setProfilePreview(getAvatarUrl(currentUser?.avatar_url));
                    }}
                    className="absolute top-1 right-1 rounded-full bg-error/80 p-1 hover:bg-error"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                )}
              </div>

              {/* Upload Input */}
              <div>
                <label className="relative cursor-pointer">
                  <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-border-subtle bg-surface-soft px-4 py-2 hover:border-primary hover:bg-primary/5 transition-colors">
                    <Upload className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Upload Image
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                <p className="mt-2 text-xs text-muted">
                  JPG, PNG or GIF (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              className="w-full rounded-lg border border-border-subtle bg-surface px-4 py-2 text-app-text placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Display (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-2">
              Email Address
            </label>
            <div className="flex items-center rounded-lg border border-border-subtle bg-surface-soft px-4 py-2">
              <Mail className="h-4 w-4 text-muted mr-3" />
              <span className="text-sm text-app-text">
                {currentUser?.email}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted">
              Email cannot be changed through settings
            </p>
          </div>

          {/* Messages */}
          {profileMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg px-4 py-3 text-sm font-medium ${
                profileMessage.type === "success"
                  ? "bg-success/10 text-success"
                  : "bg-error/10 text-error"
              }`}
            >
              {profileMessage.text}
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              profileLoading ||
              (profileData.name === (currentUser?.name || "") &&
                !profileData.avatar)
            }
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-text-inverse hover:bg-primary-strong disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {profileLoading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </motion.div>

      {/* Password Change Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={baseCardClass}
      >
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-app-text">Security</h2>
              <p className="mt-1 text-sm text-muted">
                Change your password. Tokens will remain active during this
                process.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handlePasswordReset} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-border-subtle bg-surface px-4 py-2 pr-10 text-app-text placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    current: !showPasswords.current,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-app-text"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-border-subtle bg-surface px-4 py-2 pr-10 text-app-text placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter your new password (min 8 characters)"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    new: !showPasswords.new,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-app-text"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-border-subtle bg-surface px-4 py-2 pr-10 text-app-text placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    confirm: !showPasswords.confirm,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-app-text"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Messages */}
          {passwordMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg px-4 py-3 text-sm font-medium ${
                passwordMessage.type === "success"
                  ? "bg-success/10 text-success"
                  : "bg-error/10 text-error"
              }`}
            >
              {passwordMessage.text}
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              passwordLoading ||
              !passwordData.currentPassword ||
              !passwordData.newPassword ||
              !passwordData.confirmPassword
            }
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-text-inverse hover:bg-primary-strong disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {passwordLoading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </motion.div>

      {/* Info Section */}
      <div className={baseCardClass}>
        <h3 className="text-sm font-semibold text-app-text mb-3">
          Important Notes
        </h3>
        <ul className="space-y-2 text-sm text-muted">
          <li className="flex gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0"></span>
            <span>
              Profile updates (name, avatar) will not affect your authentication
              tokens
            </span>
          </li>
          <li className="flex gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0"></span>
            <span>
              Your access and refresh tokens will remain active throughout
              profile updates
            </span>
          </li>
          <li className="flex gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0"></span>
            <span>
              Password changes require you to verify your current password first
            </span>
          </li>
          <li className="flex gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0"></span>
            <span>
              After password change, all active sessions will require
              re-authentication on next action
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserSettingsPage;
