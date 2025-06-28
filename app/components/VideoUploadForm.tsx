"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useNotification } from "./Notification";

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

  // Convert YouTube link to embed link
  const convertToEmbedUrl = (url: string) => {
    const match = url.match(/(?:watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !videoUrl || !thumbnailUrl) {
      showNotification("Please fill in all required fields.", "error");
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

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload video");
      }

      showNotification("Video uploaded successfully!", "success");

      // Reset
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setThumbnailUrl("");

      onUploadSuccess?.();
    } catch (error: any) {
      showNotification(error.message || "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-indigo-200 rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
        🎥 Upload New Video
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-indigo-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-indigo-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows={3}
            required
          />
        </div>

        {/* Video URL */}
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-semibold text-indigo-700 mb-1">
            YouTube Video URL
          </label>
          <input
            id="videoUrl"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=abc123"
            className="w-full px-4 py-2 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        {/* Thumbnail URL */}
        <div>
          <label htmlFor="thumbnailUrl" className="block text-sm font-semibold text-indigo-700 mb-1">
            Thumbnail URL
          </label>
          <input
            id="thumbnailUrl"
            type="url"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="w-full px-4 py-2 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 text-white font-semibold rounded-lg transition-all duration-200 ${
            loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
};

export default VideoUploadForm;
