"use client";

import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const router = useRouter();

  const { setUser, setToken } = useAuthStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      setUser(data.user);
      setToken(data.token);

      router.push("/dashboard");
    } catch (e) {
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white shadow-md p-8 rounded max-w-md w-full">

        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <div className="flex flex-col gap-4">
          <Input label="Email" name="email" type="email" onChange={handleChange} />
          <Input
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
          />
        </div>

        {error && <p className="text-red-600 mt-3">{error}</p>}

        <Button onClick={handleLogin} disabled={loading} className="mt-4">
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-center mt-4 text-sm">
          New user?{" "}
          <span
            className="text-blue-600 underline cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
