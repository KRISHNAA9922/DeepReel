"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User } from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <div className="navbar bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-md sticky top-6 z-40 pt-4 rounded-xl mx-4 my-2">
      <div className="container mx-auto flex items-center justify-between px-6 py-2 rounded-xl">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex items-center text-white text-xl font-semibold tracking-wide hover:text-yellow-400 transition-colors duration-300"
            prefetch={true}
            onClick={() =>
              showNotification("Welcome to ImageKit ReelsPro", "info")
            }
          >
            <Home className="w-6 h-6 mr-2 text-yellow-400" />
            Video with AI
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          {session ? (
            <>
              <span className="text-white font-medium self-center">
                {session.user?.email?.split("@")[0]}
              </span>
              <Link
                href="/upload"
                className="text-white font-semibold hover:text-yellow-400 transition-colors duration-300"
                onClick={() =>
                  showNotification("Welcome to Admin Dashboard", "info")
                }
              >
                Video Upload
              </Link>
              <button
                onClick={handleSignOut}
                className="text-red-600 hover:text-red-400 font-semibold"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-gray-700 font-semibold hover:text-indigo-600 transition-colors duration-300"
              onClick={() =>
                showNotification("Please sign in to continue", "info")
              }
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
