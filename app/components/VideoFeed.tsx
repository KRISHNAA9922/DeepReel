import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";
import { useState, useEffect } from "react";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const [videoList, setVideoList] = useState<IVideo[]>(videos);

  useEffect(() => {
    setVideoList(videos);
  }, [videos]);

  const handleDelete = (id: string) => {
    setVideoList((prevVideos) => prevVideos.filter((video) => video._id?.toString() !== id));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videoList.map((video) => (
        <VideoComponent key={video._id?.toString()} video={video} onDelete={handleDelete} />
      ))}

      {videoList.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-base-content/70">No videos found</p>
        </div>
      )}
    </div>
  );
}
