import Link from "next/link";
import { IVideo } from "@/models/Video";

export default function VideoComponent({ video }: { video: IVideo }) {
  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative p-2">
        <Link href={`/videos/${video._id}`} className="relative group w-full">
          <div
            className="rounded-md overflow-hidden relative w-full"
            style={{
              aspectRatio: "9 / 14",
              maxHeight: "420px",
            }}
          >
            <video
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              controls={video.controls ?? true}
              className="w-full h-full rounded-md"
            />
          </div>
        </Link>
      </figure>

      <div className="card-body p-3">
        <Link
          href={`/videos/${video._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-base">{video.title}</h2>
        </Link>

        <p className="text-sm text-base-content/70 line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );
}
