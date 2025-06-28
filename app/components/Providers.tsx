"use client";

import { IKContext } from "imagekitio-react";
import { SessionProvider } from "next-auth/react";

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY || "public_i3DmPv7EnI0+mC78CFZbFakFW6U=";
const urlEndPoint = process.env.NEXT_PUBLIC_URL_ENDPOINT || "https://ik.imagekit.io/krishna23";
const authenticationEndpoint = process.env.NEXT_PUBLIC_AUTH_ENDPOINT || "http://www.yourserver.com/auth";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      <IKContext
        publicKey={publicKey}
        urlEndpoint={urlEndPoint}
        transformationPosition="path"
        authenticationEndpoint={authenticationEndpoint}
      >
        {children}
      </IKContext>
    </SessionProvider>
  );
}
