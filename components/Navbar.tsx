import Link from "next/link";
import { Compass } from "lucide-react";
import { auth } from "@/auth";
import AuthButton from "./AuthButton";

export default async function Navbar() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Compass className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-gray-800 tracking-tight">
              Travel World
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-8">
            <Link
              href="/trips"
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              My Trips
            </Link>

            <Link
              href="/globe"
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Globe Trotter
            </Link>

            {/* Login / Logout Button */}
            <AuthButton
              isLoggedIn={isLoggedIn}
              userImage={session?.user?.image}
              userName={session?.user?.name}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
