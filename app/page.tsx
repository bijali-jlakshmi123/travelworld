import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Globe, Compass, Star, Camera } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="Beautiful destination landscape"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white/90 text-xs font-bold mb-6 tracking-wide uppercase">
            <Star className="w-3.5 h-3.5 text-amber-400" /> Discover the unseen
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-8 drop-shadow-2xl leading-tight">
            Explore <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-emerald-400 drop-shadow-none">
              The World
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md">
            Log your bucket list, track the countries you've visited, and build
            interactive itineraries all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/trips"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Start Planning <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/map"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Globe className="w-5 h-5" /> Interactive Map
            </Link>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              A smarter way to travel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
              We've built powerful tools to help you visualize, catalog, and
              coordinate your worldwide journeys with elegance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="bg-[#0f172a] rounded-[2rem] p-10 shadow-2xl hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                <MapPin className="w-40 h-40 text-white" />
              </div>
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 text-white border border-white/20">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                Location Tracking
              </h3>
              <p className="text-gray-400 leading-relaxed font-medium relative z-10">
                Save places you want to visit and keep a digital passport of
                where you've been. Set coordinates and beautiful images
                seamlessly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#1e293b] rounded-[2rem] p-10 shadow-2xl hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                <Compass className="w-40 h-40 text-white" />
              </div>
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 text-white border border-white/20">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                Drag & Drop Itineraries
              </h3>
              <p className="text-gray-400 leading-relaxed font-medium relative z-10">
                Organize your fast-paced day-to-day flights, hotels, and tourist
                attractions dynamically inside every trip folder.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#0f172a] rounded-[2rem] p-10 shadow-2xl hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                <Globe className="w-40 h-40 text-white" />
              </div>
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 text-white border border-white/20">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                Responsive 3D Globe
              </h3>
              <p className="text-gray-400 leading-relaxed font-medium relative z-10">
                Watch your travels come alive on our native WebGL-powered 3D
                globe interface. Plot your bucket list visually!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero CTA */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40 select-none pointer-events-none">
          <div className="absolute top-0 right-[10%] w-[500px] h-[500px] rounded-full bg-linear-to-bl from-blue-100 to-transparent blur-[100px]"></div>
          <div className="absolute bottom-0 left-[10%] w-[500px] h-[500px] rounded-full bg-linear-to-tr from-emerald-100 to-transparent blur-[100px]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10 bg-white/70 backdrop-blur-2xl rounded-[3rem] p-12 md:p-20 border border-white shadow-2xl shadow-blue-900/5">
          <div className="w-20 h-20 bg-gray-900 rounded-3xl mx-auto flex items-center justify-center text-white mb-8 shadow-2xl rotate-3">
            <Camera className="w-10 h-10" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Ready to log your miles?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Join a community of travelers who have mapped their dreams and
            converted them into reality. Start your journey today.
          </p>
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-bold text-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            Create Your First Trip <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </main>
  );
}
