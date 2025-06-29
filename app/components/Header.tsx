"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, Upload } from "lucide-react";
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
    <div className="navbar bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-md sticky top-4 z-40 pt-4 rounded-xl mx-12 my-4">
      <div className="container mx-auto flex items-center justify-between px-6 py-2 rounded-xl">
        {/* Left Logo / Home */}
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex items-center text-white text-xl font-semibold tracking-wide hover:text-yellow-400 transition-colors duration-300"
            onClick={() =>
              showNotification("Welcome to ImageKit ReelsPro", "info")
            }
          >
            <Home className="w-6 h-6 mr-6 text-yellow-400" />
            DeepReel Video with AI
          </Link>
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-x-12">
          {session ? (
            <>
              <span className="text-slate-300 font-medium flex items-center gap-1 self-center">
  <span className="text-slate-400">Welcome:</span>
  <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-semibold">
    {session.user?.email?.split("@")[0]}
  </span>
</span>


              <Link
                href="/upload"
                className="text-white font-semibold hover:text-yellow-400 transition-colors duration-300 flex items-center gap-3"
                onClick={() =>
                  showNotification("Welcome to Admin Dashboard", "info")
                }
              >
                <Upload className="w-4 h-4" />
                Upload
              </Link>

              <button
                onClick={handleSignOut}
                className="text-red-500 hover:text-red-400 font-semibold transition duration-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() =>
                showNotification("Please sign in to continue", "info")
              }
              className="inline-block px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md 
                         hover:from-indigo-700 hover:to-purple-700 hover:scale-105 hover:ring-2 hover:ring-purple-400 
                         active:scale-95 active:brightness-110 
                         transition-all duration-300 ease-in-out"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
