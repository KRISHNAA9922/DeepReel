"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, Upload, Menu, X } from "lucide-react";
import { useNotification } from "./Notification";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <nav className="bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-md sticky top-4 z-40 rounded-xl mx-2 my-2 sm:mx-4 sm:my-4">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center text-white text-lg font-semibold tracking-wide hover:text-yellow-400 transition-colors duration-300"
          onClick={() => showNotification("Welcome to ImageKit ReelsPro", "info")}
        >
          <Home className="w-5 h-5 mr-3 text-yellow-400" />
          DeepReel Video with AI
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="sm:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Right Menu - Desktop */}
        <div className="hidden sm:flex items-center gap-x-6 text-sm sm:text-base">
          {session ? (
            <>
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <span className="text-slate-400">Welcome:</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-semibold">
                  {session.user?.email?.split("@")[0]}
                </span>
              </span>

              <Link
                href="/upload"
                className="text-white font-semibold hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2"
                onClick={() => showNotification("Welcome to Admin Dashboard", "info")}
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
              onClick={() => showNotification("Please sign in to continue", "info")}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md 
                         hover:from-indigo-700 hover:to-purple-700 hover:scale-105 hover:ring-2 hover:ring-purple-400 
                         active:scale-95 active:brightness-110 transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 flex flex-col gap-3 text-sm">
          {session ? (
            <>
              <div className="text-slate-300 font-medium">
                <span className="text-slate-400">Welcome:</span>{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-semibold">
                  {session.user?.email?.split("@")[0]}
                </span>
              </div>

              <Link
                href="/upload"
                className="text-white font-semibold hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2"
                onClick={() => {
                  setMenuOpen(false);
                  showNotification("Welcome to Admin Dashboard", "info");
                }}
              >
                <Upload className="w-4 h-4" />
                Upload
              </Link>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleSignOut();
                }}
                className="text-red-500 hover:text-red-400 font-semibold transition duration-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => {
                setMenuOpen(false);
                showNotification("Please sign in to continue", "info");
              }}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md 
                         hover:from-indigo-700 hover:to-purple-700 hover:scale-105 hover:ring-2 hover:ring-purple-400 
                         active:scale-95 active:brightness-110 transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
