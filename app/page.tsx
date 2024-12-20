"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./components/ui/button";
import { GitPullRequestArrow } from "lucide-react";

export default function Home() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 flex flex-col items-center justify-center p-0 overflow-y-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute right-1/4 bottom-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <main className="z-10 text-center">
        <h1
          className={`text-6xl tracking-tighter font-semibold sm:text-8xl text-black mb-6 transition-all duration-1000 ease-in-out ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          stock<span className="text-gray-400">sage</span>
        </h1>

        <Button
          asChild
          className={`bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full text-lg sm:text-xl transition-all duration-1000 ease-in-out delay-1000 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Link href="/stock?name=AAPL">
            Try the Demo <GitPullRequestArrow className="ml-2" />
          </Link>
        </Button>
      </main>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(-50%, -50%) scale(1);
          }
          33% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          66% {
            transform: translate(-50%, -50%) scale(0.9);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
