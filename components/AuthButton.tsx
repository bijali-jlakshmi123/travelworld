"use client";

import { login, logout } from "@/lib/auth-actions";

interface AuthButtonProps {
  isLoggedIn: boolean;
  userImage?: string | null;
  userName?: string | null;
}

export default function AuthButton({
  isLoggedIn,
  userImage,
  userName,
}: AuthButtonProps) {
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        {userImage && (
          <img
            src={userImage}
            alt={userName ?? "User"}
            className="w-9 h-9 rounded-full border border-gray-300 shadow-sm"
          />
        )}

        <span className="text-sm text-gray-700 font-medium hidden md:block">
          {userName}
        </span>

        <button
          onClick={() => logout()}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg 
          hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-sm font-medium shadow-sm"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => login()}
      className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg 
      hover:bg-blue-700 transition-all duration-200 text-sm font-semibold shadow-md"
    >
      Sign in with GitHub
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385..." />
      </svg>
    </button>
  );
}
