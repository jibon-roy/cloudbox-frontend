"use client";

import { X, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

type Props = {
  file: any;
  onClose: () => void;
};

const VideoPlayerModal = ({ file, onClose }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const fileName = file.name || "Video";
  const downloadUrl = file.downloadUrl || file.url || "";

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-black shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle bg-surface px-6 py-4">
          <p className="truncate text-sm font-semibold text-app-text">
            {fileName}
          </p>
          <button
            onClick={onClose}
            className="rounded-lg bg-surface-soft p-1.5 hover:bg-border-subtle"
          >
            <X className="h-5 w-5 text-muted" />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            src={downloadUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            style={{
              maxHeight: "calc(90vh - 180px)",
              maxWidth: "calc(90vw - 32px)",
            }}
            className="object-contain"
          />

          {/* Play overlay */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute flex items-center justify-center rounded-full bg-primary/80 p-4 hover:bg-primary"
            >
              <Play className="h-8 w-8 fill-white text-white" />
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-3 border-t border-border-subtle bg-surface px-6 py-4">
          {/* Progress bar */}
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="h-1 w-full cursor-pointer rounded-full bg-surface-soft accent-primary"
          />

          {/* Control buttons and time */}
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="rounded-lg bg-surface-soft p-2 hover:bg-border-subtle"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-muted" />
              ) : (
                <Play className="h-4 w-4 fill-muted text-muted" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="rounded-lg bg-surface-soft p-2 hover:bg-border-subtle"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-muted" />
              ) : (
                <Volume2 className="h-4 w-4 text-muted" />
              )}
            </button>

            <div className="flex-1 text-xs text-muted">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VideoPlayerModal;
