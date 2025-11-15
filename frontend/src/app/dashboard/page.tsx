"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
import { ReferredUser } from "../types/referral";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();

  // 🔒 PROTECT ROUTE (Redirect if not logged in)
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  const [stats, setStats] = useState({
    referredCount: 0,
    convertedCount: 0,
    credits: 0,
    referralCode: "",
    referredList: [] as ReferredUser[],
  });

  const [copyStatus, setCopyStatus] = useState("");

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // ---------------------------------------------
  // Fetch Dashboard Data from Backend
  // ---------------------------------------------
  const loadDashboard = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setStats({
          referredCount: data.referredCount,
          convertedCount: data.convertedCount,
          credits: data.credits,
          referralCode: data.referralCode,
          referredList: data.referredList,
        });
      }
    } catch (e) {
      console.log("Error loading dashboard");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadDashboard();
    };
    fetchData();
  }, []);

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/register?r=${stats.referralCode}`;

  const copyReferral = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopyStatus("Copied!");

    setTimeout(() => setCopyStatus(""), 2000);
  };

  // ---------------------------------------------
  // Simulate Purchase
  // ---------------------------------------------
  const buyProduct = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/purchases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: 10 }),
      });

      const data = await res.json();

      if (res.ok) {
        loadDashboard();
        alert("Purchase successful!");
      } else {
        alert(data.error || "Purchase failed");
      }
    } catch (e) {
      alert("Network error");
    }
  };

  // If still loading or redirecting
  if (!token) return null;

  return (
    <div className="min-h-screen p-6 bg-gray-100 relative">

      {/* LOGOUT BUTTON */}
      <button
        onClick={() => {
          logout();
          router.push("/login");
        }}
        className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>

      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Referral Link Card */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Your Referral Link</h2>

        <div className="flex items-center gap-2">
          <input
            readOnly
            value={referralLink}
            className="w-full p-2 border rounded bg-gray-50"
          />
          <button
            onClick={copyReferral}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Copy
          </button>
        </div>

        {copyStatus && (
          <p className="text-green-600 text-sm mt-1">{copyStatus}</p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded shadow text-center"
        >
          <p className="text-gray-500">Total Credits</p>
          <h2 className="text-3xl font-bold">{stats.credits}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded shadow text-center"
        >
          <p className="text-gray-500">Referred Users</p>
          <h2 className="text-3xl font-bold">{stats.referredCount}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded shadow text-center"
        >
          <p className="text-gray-500">Converted Users</p>
          <h2 className="text-3xl font-bold">{stats.convertedCount}</h2>
        </motion.div>
      </div>

      {/* Purchase Button */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Buy Product</h2>
        <p className="text-sm text-gray-500 mb-2">
          Click below to simulate a purchase.  
          If you were referred by someone, this will credit both users.
        </p>

        <button
          onClick={buyProduct}
          className="px-6 py-2 bg-green-600 text-white rounded"
        >
          Buy for ₹10
        </button>
      </div>

      {/* Referred Users List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Referred Users</h2>

        {stats.referredList.length === 0 && (
          <p className="text-gray-500 text-sm">No referred users yet.</p>
        )}

        <div className="space-y-2">
          {stats.referredList.map((ref: ReferredUser, index: number) => (
            <div
              key={index}
              className="p-3 border rounded flex justify-between"
            >
              <p>{ref.email}</p>
              <p
                className={`${
                  ref.status === "converted"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {ref.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
