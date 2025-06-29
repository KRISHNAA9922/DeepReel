import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    // console.log("ImageKit auth route called");
    // console.log("Private Key:", process.env.IMAGEKIT_PRIVATE_KEY ? "Present" : "Missing");
    // console.log("Public Key:", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ? "Present" : "Missing");

    const authenticationParameters = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
    });

    //console.log("Authentication parameters generated:", authenticationParameters);

    return Response.json({
      authenticationParameters,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    //console.error("Error in ImageKit auth route:", error);
    return Response.json(
      {
        error: "Authentication for Imagekit failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
