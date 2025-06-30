"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Providers from "../components/Providers";
import Header from "../components/Header";
import { NotificationProvider } from "../components/Notification";
import VideoFeed from "../components/VideoFeed";
import { IVideo } from "@/models/Video";
import { motion } from "framer-motion";
import VideoUploadForm from "../components/VideoUploadForm";

export default function Home() {
  const { data: session, status } = useSession();
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/video/list");
      const data: IVideo[] = await res.json();
      console.log("Fetched videos:", data);
      setVideos(data);
    } catch (error) {
      console.error("Failed to fetch videos", error);
    }
  };

  return (
    <Providers>
      <NotificationProvider>
        <Header />
        
        {/* Main container with clean background */}
        <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
          {/* Foreground content */}
          <div className="relative z-10 container mx-auto px-4 py-8 space-y-6">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent mb-4">
                Keep Scrolling — The Fun Awaits!
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                Dive into a world of exciting videos or share your own!
              </p>
            </motion.div>

            {/* Session Status */}
            {status === "loading" ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-400 text-lg"
              >
                Loading your session...
              </motion.p>
            ) : (
              <>
                {session ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center mb-6"
                  >
                    <VideoUploadForm />
                  </motion.div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-400 text-lg"
                  >
                    Sign in to upload and share your videos!
                  </motion.p>
                )}
              </>
            )}

            {/* Video Feed */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <VideoFeed videos={videos} />
            </motion.div>
          </div>
        </main>
      </NotificationProvider>
    </Providers>
  );
}
