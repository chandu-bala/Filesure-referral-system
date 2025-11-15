"use client";

import { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const referralCode = searchParams.get("r") || null;

  const { setUser, setToken } = useAuthStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    referralCode: referralCode || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      // 🔥 Placeholder — backend endpoint will be connected later
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Save auth
      setUser(data.user);
      setToken(data.token);

      // Redirect
      router.push("/dashboard");

    } catch (err) {
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white shadow-md p-8 rounded max-w-md w-full">

        <h1 className="text-2xl font-bold mb-4">Create Account</h1>

        {referralCode && (
          <p className="text-sm text-green-600 mb-2">
            Referral applied: <b>{referralCode}</b>
          </p>
        )}

        <div className="flex flex-col gap-4">
          <Input label="Name" name="name" onChange={handleChange} />
          <Input label="Email" name="email" type="email" onChange={handleChange} />
          <Input
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
          />

          {/* Show referral code field only if user manually edits it */}
          <Input
            label="Referral Code (optional)"
            name="referralCode"
            value={form.referralCode}
            onChange={handleChange}
          />
        </div>

        {error && <p className="text-red-600 mt-3">{error}</p>}

        <Button onClick={handleRegister} disabled={loading} className="mt-4">
          {loading ? "Creating account..." : "Register"}
        </Button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-600 underline cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
