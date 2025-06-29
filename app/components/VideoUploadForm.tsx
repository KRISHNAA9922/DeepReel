
"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useNotification } from "./Notification";
import Image from "next/image";

interface VideoUploadFormProps {
  onUploadSuccess?: () => void;
}

const VideoUploadForm: React.FC<VideoUploadFormProps> = ({ onUploadSuccess }) => {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const convertToEmbedUrl = (url: string) => {
    const match = url.match(/(?:watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !videoUrl ) {
      showNotification("Please fill in all fields.", "error");
      return;
    }

    if (!session) {
      showNotification("You must be logged in to upload a video.", "error");
      return;
    }

    setLoading(true);

    try {
      const embedUrl = convertToEmbedUrl(videoUrl);

      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          videoUrl: embedUrl,
          thumbnailUrl,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");

      showNotification("Video uploaded successfully!", "success");

      setTitle("");
      setDescription("");
      setVideoUrl("");
      setThumbnailUrl("");
      onUploadSuccess?.();
    } catch (error) {
      showNotification(error instanceof Error ? error.message : String(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="bg-black border border-slate-800 rounded-xl p-6 shadow-xl max-w-md mx-auto my-12 sm:px-6">
      <h2 className="text-3xl font-semibold text-white mb-6 text-center sm:text-2xl sm:mb-4">
        🎬 Upload a Video
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-200 mb-1">
            Video Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a catchy title"
            className="w-full rounded-lg border border-slate-600 bg-slate-900 text-white placeholder:text-slate-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-200 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of your video..."
            rows={3}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 text-white placeholder:text-slate-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm"
            required
          />
        </div>

        {/* Video URL */}
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-slate-200 mb-1">
             Video URL
          </label>
          <input
            id="videoUrl"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-slate-600 bg-slate-900 text-white placeholder:text-slate-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm"
            required
          />
        </div>

        {/* Thumbnail URL */}
        <div>
          <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-slate-200 mb-1">
            Thumbnail Image URL
          </label>
          <input
            id="thumbnailUrl"
            type="url"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg border border-slate-600 bg-slate-900 text-white placeholder:text-slate-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm"
            required
          />
        </div>

        {/* Thumbnail Preview */}
        {thumbnailUrl && (
          <div className="mt-3 sm:mt-2">
            <p className="text-sm text-slate-500 mb-1">Thumbnail Preview:</p>
             <Image
        src={thumbnailUrl}
        alt="Thumbnail preview"
        fill
        className="object-cover rounded-md"
      />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 font-semibold text-white rounded-lg transition duration-200 ${
            loading
              ? "bg-slate-600 cursor-not-allowed animate-pulse"
              : "bg-slate-800 hover:bg-slate-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
};

export default VideoUploadForm;