"use client";
import { useAppDispatch } from "@/hooks/hooks";
import { signUpEmail } from "@/lib/store/features/(auth)/auth/authThunks";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { FormEvent } from "react";
import { useDispatch } from "react-redux";

export default function RegisterPage() {
  const dispatch = useAppDispatch();

  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center px-4">
      {/* Glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-30 -left-30 w-96 h-96 bg-violet-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-30 -right-30 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-violet-500 to-cyan-500 flex items-center justify-center mx-auto shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-white">
              Create Account
            </h1>

            <p className="mt-2 text-zinc-400">
              Join Cosden Solutions today
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const formData = new FormData(e.currentTarget);

              dispatch(signUpEmail(formData));
            }} className="flex flex-col gap-5"
          >
            {/* Name */}
            <div>
              <label className="text-sm text-zinc-300 mb-2 block">
                Full Name
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-violet-500 transition">
                <User className="w-5 h-5 text-zinc-500" />

                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  required
                  className="w-full bg-transparent outline-none text-white placeholder:text-zinc-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-zinc-300 mb-2 block">
                Email
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-violet-500 transition">
                <Mail className="w-5 h-5 text-zinc-500" />

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  className="w-full bg-transparent outline-none text-white placeholder:text-zinc-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-zinc-300 mb-2 block">
                Password
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-violet-500 transition">
                <Lock className="w-5 h-5 text-zinc-500" />

                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent outline-none text-white placeholder:text-zinc-500"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="group mt-2 flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 py-3 font-semibold text-white shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              Create Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-violet-400 hover:text-violet-300 transition"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}