import Link from "next/link";
import { Compass, Instagram, Twitter, Facebook, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#8eaefa] text-gray-300 py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
            >
              <Compass className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold tracking-tight">
                Travel World
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed pr-4">
              Your ultimate companion for tracking adventures, logging bucket
              list destinations, and creatively exploring the globe.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Explore
            </h3>
            <div className="flex flex-col gap-3">
              <Link
                href="/trips"
                className="text-sm font-medium hover:text-blue-400 transition-colors inline-block w-fit"
              >
                My Trips
              </Link>
              <Link
                href="/locations"
                className="text-sm font-medium hover:text-blue-400 transition-colors inline-block w-fit"
              >
                Locations
              </Link>
              <Link
                href="/globe"
                className="text-sm font-medium hover:text-blue-400 transition-colors inline-block w-fit"
              >
                Interactive Globe
              </Link>
              <Link
                href="/map"
                className="text-sm font-medium hover:text-blue-400 transition-colors inline-block w-fit"
              >
                2D Map
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Resources
            </h3>
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium hover:text-blue-400 cursor-pointer transition-colors inline-block w-fit">
                Help Center
              </span>
              <span className="text-sm font-medium hover:text-blue-400 cursor-pointer transition-colors inline-block w-fit">
                Travel Guides
              </span>
              <span className="text-sm font-medium hover:text-blue-400 cursor-pointer transition-colors inline-block w-fit">
                Community
              </span>
              <span className="text-sm font-medium hover:text-blue-400 cursor-pointer transition-colors inline-block w-fit">
                Contact Us
              </span>
            </div>
          </div>

          {/* Socials & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Stay Connected
            </h3>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 bg-gray-800 text-gray-400 rounded-full hover:bg-pink-600 hover:text-white transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 text-gray-400 rounded-full hover:bg-blue-400 hover:text-white transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 text-gray-400 rounded-full hover:bg-blue-600 hover:text-white transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 text-gray-400 rounded-full hover:bg-gray-600 hover:text-white transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-gray-500 pt-2 font-medium">
              Join our newsletter to get weekly travel inspiration.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800/80 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 font-medium">
          <p>© {new Date().getFullYear()}- Bijali Jayalakshmi Jayan.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Terms of Service
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Cookie Settings
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
