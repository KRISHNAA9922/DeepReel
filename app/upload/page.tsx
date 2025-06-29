"use client";

import Providers from "../components/Providers";
import Header from "../components/Header";
import { NotificationProvider } from "../components/Notification";
import VideoUploadForm from "../components/VideoUploadForm";

import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();

  const handleUploadSuccess = () => {
    router.push("/");
  };

  return (
    <Providers>
      <NotificationProvider>
        <Header />
        <main className="container mx-auto p-4">
          <VideoUploadForm onUploadSuccess={handleUploadSuccess} />
        </main>
      </NotificationProvider>
    </Providers>
  );
}
