"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-4 text-center">
        FileSure Referral & Credit System
      </h1>

      <p className="text-gray-600 max-w-xl text-center mb-8">
        A simple, scalable referral and credit program where users can share
        referral links, earn credits, and track analytics through a clean dashboard.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/register")}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Get Started
        </button>

        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
        >
          Login
        </button>
      </div>

      <footer className="absolute bottom-4 text-sm text-gray-400">
        Built for FileSure Internship Assignment
      </footer>
    </div>
  );
}
