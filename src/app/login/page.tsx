"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Stage = "email" | "otp" | "error" | "reveal";

export default function LoginPage() {
  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [hash, setHash] = useState<string>("");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!email || !email.includes("@")) { setError("Enter a valid email address."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/send-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      
      if (!data.success) { 
        if (res.status === 403) setStage("error"); 
        setError(data.error || "Access denied."); 
        setLoading(false); 
        return; 
      }
      
      setHash(data.hash);
      setStage("otp"); 
      setCountdown(60); 
      setSuccess("OTP sent! Check your inbox."); 
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Send OTP error:", err);
      setError("Failed to send OTP. Try again.");
    } finally { setLoading(false); }
  };

  const handleOtpChange = useCallback((i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    setOtp(prev => { const n = [...prev]; n[i] = val.slice(-1); return n; });
    setError(""); if (val && i < 5) otpRefs.current[i + 1]?.focus();
  }, []);

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const d = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (d.length) { const n = [...otp]; for (let i = 0; i < d.length; i++) n[i] = d[i]; setOtp(n); otpRefs.current[Math.min(d.length, 5)]?.focus(); }
  };

  const triggerFullscreenVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.play().catch(() => {});
      if (video.requestFullscreen) {
        video.requestFullscreen().catch(() => {});
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen();
      }
    }
  };

  const handleVerifyOtp = useCallback(async () => {
    const code = otp.join("");
    if (code.length !== 6) { setError("Enter the complete 6-digit OTP."); return; }
    setLoading(true); setError("");
    
    try {
      const res = await fetch("/api/verify-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp: code, hash }) });
      const data = await res.json();
      if (data.success) { 
        setSuccess("Verified!");
        setStage("reveal");
        // Because this is triggered by a click, we can launch fullscreen immediately
        setTimeout(triggerFullscreenVideo, 100);
      }
      else { setError(data.error || "Invalid OTP."); setOtp(["","","","","",""]); otpRefs.current[0]?.focus(); }
    } catch { setError("Network error."); } finally { setLoading(false); }
  }, [otp, email, hash]);

  useEffect(() => { if (otp.every(d => d !== "") && stage === "otp") handleVerifyOtp(); }, [otp, stage, handleVerifyOtp]);

  const cardVariants = { initial: { opacity: 0, y: 30, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -20, scale: 0.97 } };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Back to home */}
      {stage !== "reveal" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed top-6 left-6 z-20">
          <a href="/" className="badge hover:border-[var(--color-accent)]/40 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Back
          </a>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* ===== ACCESS RESTRICTED ===== */}
        {stage === "error" && (
          <motion.div key="error" variants={cardVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }} className="glass-card p-10 md:p-12 text-center max-w-md w-full">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, delay: 0.2 }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500/15 to-red-500/5 flex items-center justify-center border border-red-500/10">
                <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-red-400 mb-2" style={{ fontFamily: "var(--font-display)" }}>Access Restricted</h2>
            <p className="text-[var(--color-text-secondary)] text-sm mb-8">This email is not authorized to access the reveal.</p>
            <button onClick={() => { setStage("email"); setError(""); setEmail(""); }} className="btn-primary w-full" id="try-again-btn">Try Another Email</button>
          </motion.div>
        )}

        {/* ===== EMAIL INPUT ===== */}
        {stage === "email" && (
          <motion.div key="email" variants={cardVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }} className="glass-card p-8 md:p-12 max-w-md w-full">
            <div className="text-center mb-10">
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 12, delay: 0.15 }}>
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)] flex items-center justify-center glow-accent relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                  <svg className="w-7 h-7 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L7.5 12" />
                  </svg>
                </div>
              </motion.div>
              <h1 className="text-2xl font-bold gradient-text mb-2" style={{ fontFamily: "var(--font-display)" }}>Enter Your Email</h1>
              <p className="text-[var(--color-text-muted)] text-sm">Access the exclusive reveal</p>
            </div>

            <div className="mb-2">
              <label htmlFor="email-input" className="block text-[var(--color-text-muted)] text-[0.6rem] uppercase tracking-[0.2em] mb-2.5 font-semibold">Email Address</label>
              <input id="email-input" type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleSendOtp()} placeholder="you@example.com" className="input-field text-lg tracking-wider font-medium" autoFocus autoComplete="email" />
            </div>

            <AnimatePresence>{error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs mb-1 mt-3 text-center font-medium">{error}</motion.p>}</AnimatePresence>

            <button onClick={handleSendOtp} disabled={loading || !email} className="btn-primary w-full flex items-center justify-center gap-2.5 mt-6" id="send-otp-btn">
              {loading ? <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin inline-block" /> : <>Send Access Code <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg></>}
            </button>
          </motion.div>
        )}

        {/* ===== OTP VERIFY ===== */}
        {stage === "otp" && (
          <motion.div key="otp" variants={cardVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }} className="glass-card p-8 md:p-12 max-w-md w-full">
            <div className="text-center mb-10">
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 12, delay: 0.15 }}>
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)] flex items-center justify-center glow-accent relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                  <svg className="w-7 h-7 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                </div>
              </motion.div>
              <h1 className="text-2xl font-bold gradient-text mb-2" style={{ fontFamily: "var(--font-display)" }}>Verify Access Code</h1>
              <p className="text-[var(--color-text-muted)] text-sm">Code sent to <span className="text-[var(--color-accent-light)] font-semibold">{email}</span></p>
            </div>

            <div className="flex justify-center gap-2.5 mb-6" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <motion.input
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  ref={el => { otpRefs.current[i] = el; }}
                  type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  className={`otp-input ${digit ? "filled" : ""}`}
                  id={`otp-input-${i}`}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <AnimatePresence>{success && <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2 text-green-400 text-sm mb-4 font-medium"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{success}</motion.div>}</AnimatePresence>
            <AnimatePresence>{error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs mb-4 text-center font-medium">{error}</motion.p>}</AnimatePresence>

            <button onClick={handleVerifyOtp} disabled={loading || otp.some(d => !d)} className="btn-primary w-full flex items-center justify-center gap-2 mb-5" id="verify-otp-btn">
              {loading ? <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin inline-block" /> : "Verify & Reveal"}
            </button>

            <div className="flex items-center justify-between text-xs">
              <button onClick={() => { setStage("email"); setError(""); setOtp(["","","","","",""]); setHash(""); }} className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-light)] transition-colors font-medium" id="back-btn">← Change Email</button>
              <button onClick={() => { if (countdown <= 0) { setOtp(["","","","","",""]); setHash(""); handleSendOtp(); } }} disabled={countdown > 0} className={`font-medium ${countdown > 0 ? "text-[var(--color-text-muted)]" : "text-[var(--color-accent-light)] hover:text-[var(--color-accent)]"} transition-colors`} id="resend-btn">
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ===== REVEAL CONTENT ===== */}
        {stage === "reveal" && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="flex flex-col items-center justify-center w-full max-w-4xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-3" style={{ fontFamily: "var(--font-display)" }}><span className="gradient-text-animated text-glow">Ignite AI</span></h1>
              <p className="text-[var(--color-text-secondary)] text-sm md:text-base tracking-[0.08em] uppercase">The Future is Here</p>
            </motion.div>

            <div className="video-container glow-accent-strong w-full relative group rounded-2xl overflow-hidden bg-black aspect-video">
              {!videoLoaded && !videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-secondary)]">
                   <div className="w-10 h-10 border-2 border-[var(--color-accent)]/20 border-t-[var(--color-accent)] rounded-full animate-spin" />
                </div>
              )}
              
              {videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-center p-6">
                  <p className="text-[var(--color-text-muted)]">Video failed to load. Please refresh.</p>
                </div>
              )}

              <video
                ref={videoRef}
                className={`w-full h-full object-contain ${videoLoaded ? "opacity-100" : "opacity-0"}`}
                onLoadedData={() => setVideoLoaded(true)}
                onError={() => setVideoError(true)}
                controls playsInline muted
              >
                <source src="/reveal.mp4" type="video/mp4" />
              </video>
            </div>
            
            <motion.button 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
              onClick={triggerFullscreenVideo}
              className="mt-8 text-[var(--color-text-muted)] hover:text-white transition-colors text-xs tracking-widest uppercase"
            >
              Restart Fullscreen
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Cinematic Video (Preloading) */}
      <video ref={videoRef} className="hidden" preload="auto" muted playsInline>
        <source src="/reveal.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
