import { useState, useEffect, useRef } from "react";
import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const [videoList, setVideoList] = useState<IVideo[]>(videos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVideoList(videos);
  }, [videos]);

  const handleDelete = (id: string) => {
    setVideoList((prevVideos) => prevVideos.filter((video) => video._id?.toString() !== id));
    if (currentIndex >= videoList.length - 1 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.changedTouches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.changedTouches[0].clientY;
  };

  const onTouchEnd = () => {
    if (touchStartY.current !== null && touchEndY.current !== null) {
      const distance = touchStartY.current - touchEndY.current;
      if (distance > minSwipeDistance) {
        // swipe up
        setCurrentIndex((prev) => Math.min(prev + 1, videoList.length - 1));
      } else if (distance < -minSwipeDistance) {
        // swipe down
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }
    touchStartY.current = null;
    touchEndY.current = null;
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
