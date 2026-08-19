"use client";
import SocialLogin from "@/components/auth/SocialLogin";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const {error} = useAppSelector((state)=>state.auth)
 
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center px-4">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-25 -left-25 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-25 -right-25 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-tr from-violet-500 to-cyan-500 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-white tracking-tight">
              Welcome Back
            </h1>

            <p className="text-zinc-400 mt-2 text-sm">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Form */}
          <form
            // onSubmit={(e) => {
            //   e.preventDefault();

            //   const formData = new FormData(e.currentTarget);

            //   dispatch(signInEmail(formData));
            // }}
            className="flex flex-col gap-5"
          >
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-300 font-medium">
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
            <div className="space-y-2">
              <label className="text-sm text-zinc-300 font-medium">
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
            {/* error on sign-in */}
          {error && (
            <p>{error}</p>
           )}


            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-violet-400 hover:text-violet-300 transition"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="group flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-4 py-3 text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Sign In
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-3 text-zinc-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Buttons */}

          <SocialLogin />

          {/* Footer */}
          <Link href={'/signup'}>
          <p className="mt-8 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <span className="text-violet-400 hover:text-violet-300 cursor-pointer transition">
              Create one
            </span>
          </p>
          </Link>
          
        </div>
      </div>
    </div>
  );
}