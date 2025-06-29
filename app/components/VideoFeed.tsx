import { useState, useEffect } from "react";
import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const [videoList, setVideoList] = useState<IVideo[]>(videos);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setVideoList(videos);
  }, [videos]);

  const handleDelete = (id: string) => {
    setVideoList((prevVideos) => prevVideos.filter((video) => video._id?.toString() !== id));
    if (currentIndex >= videoList.length - 1 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div
    >
      {videoList.length > 0 ? (
        videoList.map((video, index) => (
          <div
            key={video._id?.toString()}
            className="h-screen snap-start flex items-center justify-center"
          >
            <VideoComponent video={video} onDelete={handleDelete} isActive={index === currentIndex} />
          </div>
        ))
      ) : (
        <div className="text-center py-12 text-white">
          <p className="text-base-content/70">No videos found</p>
        </div>
      )}
    </div>
  );
}
