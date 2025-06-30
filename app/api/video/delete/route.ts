import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("id");

    if (!videoId) {
      return NextResponse.json({ error: "Missing video ID" }, { status: 400 });
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete video", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
