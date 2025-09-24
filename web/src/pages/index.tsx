import { useState } from "react";
import { Heart, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function Home(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password, remember: rememberMe})
      });
      
      if(res.ok){
        location.href = "/dashboard";
      } else {
        const j = await res.json().catch(() => ({message: "Login failed"}));
        setErr(j.message || "Login failed");
      }
    } catch (error) {
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating hearts animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Heart className="absolute top-1/4 left-1/4 h-4 w-4 text-rose-300/30 animate-float" />
        <Heart className="absolute top-1/3 right-1/4 h-6 w-6 text-pink-300/40 animate-float-delayed" />
        <Heart className="absolute bottom-1/4 left-1/3 h-3 w-3 text-purple-300/30 animate-float-slow" />
        <Sparkles className="absolute top-1/2 right-1/3 h-5 w-5 text-rose-400/20 animate-pulse" />
      </div>
      
      <div className="max-w-md w-full">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-rose-300/50 relative">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-rose-400/10 to-pink-400/10 rounded-3xl blur-xl"></div>
          
          <div className="text-center mb-8 relative z-10">
            <div className="relative">
              <Heart className="h-20 w-20 text-rose-500 mx-auto mb-4 animate-pulse" />
              <Sparkles className="h-6 w-6 text-pink-400 absolute top-0 right-1/3 animate-bounce" />
            </div>
            <h1 className="text-4xl font-serif text-gray-800 mb-3 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Our Private Sanctuary
            </h1>
            <p className="text-gray-600 flex items-center justify-center space-x-2 text-lg">
              <Lock className="h-4 w-4" />
              <span>Secure • Intimate • Forever Yours</span>
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2 font-serif">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-rose-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-inner"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2 font-serif">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-rose-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-inner"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-rose-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-rose-300 text-rose-600 focus:ring-rose-500 focus:ring-2"
                disabled={loading}
              />
              <label htmlFor="remember-me" className="text-sm text-gray-600 font-serif">
                Remember me for 30 days
              </label>
            </div>

            {err && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-300 text-red-800 px-4 py-3 rounded-xl shadow-inner">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white py-4 rounded-xl hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-xl disabled:opacity-50 transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <Heart className="h-5 w-5 animate-pulse" />
                  <span>Entering your sanctuary...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Enter Our Space</span>
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
