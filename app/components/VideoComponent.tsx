import { IKVideo } from "imagekitio-react";
import Link from "next/link";
import { IVideo } from "@/models/Video";
import { useState } from "react";
import { useNotification } from "./Notification";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT || "https://ik.imagekit.io/krishna23";

export default function VideoComponent({ video, onDelete }: { video: IVideo; onDelete?: (id: string) => void }) {
  //const [hasError, setHasError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showNotification } = useNotification();

  // if (hasError) {
  //   return (
  //     <div className="card bg-base-100 shadow p-4 text-center text-red-600">
  //       <p>Failed to load video.</p>
  //     </div>
  //   );
  // }

  const isExternalUrl = video.videoUrl.startsWith("http://") || video.videoUrl.startsWith("https://");
  const videoPath = isExternalUrl ? video.videoUrl : `${urlEndpoint}${video.videoUrl}`;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this video?")) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/video?id=${video._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete video");
      }
      if (onDelete && video._id) {
        onDelete(video._id.toString());
      }
    } catch (error) {
      if (error instanceof Error) {
        showNotification("Error deleting video: " + error.message, "error");
      } else {
        showNotification("Error deleting video", "error");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300 relative">
      <figure className="relative px-4 pt-4">
        <Link href={`/videos/${video._id}`} className="relative group w-full">
          <div
            className="rounded-xl overflow-hidden relative w-full"
            style={{ aspectRatio: "9 / 16", maxHeight: "450px" }}
          >
            {isExternalUrl ? (
              <video
                src={videoPath}
                controls={video.controls}
                className="w-full h-full object-cover"
                //onError={() => setHasError(true)}
              />
            ) : (
              <IKVideo
                path={videoPath}
                transformation={[
                  {
                    height: "540",
                    width: "304",
                  },
                ]}
                controls={video.controls}
                className="w-full h-full object-cover"
                //onError={() => setHasError(true)}
              />
            )}
          </div>
        </Link>
      </figure>

      <div className="card-body p-4 flex flex-col space-y-3">
        <Link
          href={`/videos/${video._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-lg">{video.title}</h2>
        </Link>

        <div className="flex items-center justify-between">
          <p className="text-sm text-base-content/70 line-clamp-2 flex-1 mr-4">
            {video.description}
          </p>

          <button
            className="btn btn-error btn-sm border border-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-white px-4 py-2 transition duration-300 ease-in-out whitespace-nowrap"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
