'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Providers from "./components/Providers";
import Header from "./components/Header";
import { NotificationProvider } from "./components/Notification";
import VideoUploadForm from "./components/VideoUploadForm";
import VideoComponent from "./components/VideoComponent";

import { IVideo } from "@/models/Video";

export default function Home() {
  const { data: session, status } = useSession();
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/video");
      const data: IVideo[] = await res.json();
      console.log("Fetched videos:", data);
      setVideos(data);
    } catch (error) {
      console.error("Failed to fetch videos", error);
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    fetchVideos();
  };

  return (
    <Providers>
      <NotificationProvider>
        <Header />
        <main className="container mx-auto p-4 space-y-6">
          <h1 className="text-3xl font-bold text-center">Welcome to the Home Page</h1>

          {status === "loading" ? (
            <p className="text-center text-gray-600">Loading session...</p>
          ) : !session ? (
            <p className="text-center text-gray-600">
            </p>
          ) : (
            <>
              {!showUploadForm ? (
                <div className="text-center">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowUploadForm(true)}
                  >
                    Upload Video
                  </button>
                </div>
              ) : (
                <VideoUploadForm onUploadSuccess={handleUploadSuccess} />
              )}
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoComponent
                key={video._id?.toString() || video.title}
                video={video}
              />
            ))}
          </div>
        </main>
      </NotificationProvider>
    </Providers>
  );
}
