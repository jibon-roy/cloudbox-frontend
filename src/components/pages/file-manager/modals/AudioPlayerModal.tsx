"use client";

import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

type Props = {
  file: any;
  onClose: () => void;
};

const AudioPlayerModal = ({ file, onClose }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const fileName = file.name || "Audio";
  const downloadUrl = file.downloadUrl || file.url || "";

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime + seconds,
      );
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
        className="relative w-full max-w-md rounded-lg bg-linear-to-b from-surface to-surface-soft shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
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

        {/* Audio player content */}
        <div className="space-y-6 px-6 py-8">
          {/* Audio element */}
          <audio
            ref={audioRef}
            src={downloadUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Album art placeholder */}
          <div className="flex items-center justify-center rounded-lg bg-surface py-12">
            <div className="h-20 w-20 rounded-full bg-primary/20" />
          </div>

          {/* Time display */}
          <div className="text-center">
            <p className="text-xs text-muted">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>

          {/* Progress bar */}
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="h-1 w-full cursor-pointer rounded-full bg-surface-soft accent-primary"
          />

          {/* Control buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => skipTime(-10)}
              className="rounded-lg bg-surface-soft p-2 hover:bg-border-subtle"
            >
              <SkipBack className="h-5 w-5 text-muted" />
            </button>

            <button
              onClick={togglePlay}
              className="rounded-lg bg-primary p-3 hover:bg-primary/90"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 fill-white text-white" />
              ) : (
                <Play className="h-6 w-6 fill-white text-white" />
              )}
            </button>

            <button
              onClick={() => skipTime(10)}
              className="rounded-lg bg-surface-soft p-2 hover:bg-border-subtle"
            >
              <SkipForward className="h-5 w-5 text-muted" />
            </button>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-3">
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
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="h-1 flex-1 cursor-pointer rounded-full bg-surface-soft accent-primary"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AudioPlayerModal;
