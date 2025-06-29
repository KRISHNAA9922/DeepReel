'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Providers from "../components/Providers";
import Header from "../components/Header";
import { NotificationProvider } from "../components/Notification";
import VideoUploadForm from "../components/VideoUploadForm";
import VideoFeed from "../components/VideoFeed";

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

  const handleDelete = (id: string) => {
    setVideos((prevVideos) => prevVideos.filter((video) => video._id?.toString() !== id));
  };

  return (
    <Providers>
      <NotificationProvider>
        <Header />
        <main className="container mx-auto p-4 space-y-2">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-400 to-fuchsia-500 bg-clip-text text-transparent">
            Welcome to the Home Page
          </h1>
          {status === "loading" ? (
            <p className="text-center text-gray-600">Loading session...</p>
          ) : (
            <>
              {session ? (
                <>
                  {!showUploadForm ? (
                    <div className="text-center">
                      <button
                        className="btn btn-primary"
                        onClick={() => setShowUploadForm(true)}
                      >
                        Clickhere Upload Video
                      </button>
                    </div>
                  ) : (
                    <VideoUploadForm onUploadSuccess={handleUploadSuccess} />
                  )}
                </>
              ) : null}
            </>
          )}

          <VideoFeed videos={videos} />
        </main>
      </NotificationProvider>
    </Providers>
  );
}
