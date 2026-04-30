"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function RevealPage() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  const playFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      setIsPlaying(true);
      video.muted = false; // Unmute so they can hear the cinematic sound
      video.play().catch(() => {});
      
      // Native fullscreen request
      if (video.requestFullscreen) {
        video.requestFullscreen().catch(() => {});
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen(); // Safari/iOS
      } else if ((video as any).msRequestFullscreen) {
        (video as any).msRequestFullscreen(); // IE11
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative">
      {/* Cinematic curtain */}
      <motion.div
        className="fixed inset-0 bg-[var(--color-bg-primary)] z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
        style={{ pointerEvents: "none" }}
      />

      {showContent && (
        <>
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="mb-4">
            <span className="badge">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
              Exclusive Reveal
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-12">
            <motion.p initial={{ opacity: 0, letterSpacing: "0.5em" }} animate={{ opacity: 1, letterSpacing: "0.3em" }} transition={{ duration: 1.2, delay: 0.6 }} className="text-[var(--color-text-muted)] text-[0.6rem] uppercase font-semibold mb-4">Presenting</motion.p>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-3" style={{ fontFamily: "var(--font-display)" }}><span className="gradient-text-animated text-glow">Ignite AI</span></h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="text-[var(--color-text-secondary)] text-sm md:text-base tracking-[0.08em] uppercase">Department of AI &amp; Data Science</motion.p>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 1.1 }} className="mt-5 line-glow w-32 mx-auto origin-center" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.92, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }} 
            className="video-container glow-accent-strong w-full max-w-[850px] relative group cursor-pointer"
          >

            {/* Play Overlay */}
            {videoLoaded && !videoError && !isPlaying && (
              <div onClick={playFullscreen} className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center opacity-100 group-hover:bg-black/20 transition-all duration-500 rounded-2xl border border-[var(--color-accent)]/30">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] flex items-center justify-center glow-accent-strong mb-4 transform group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <p className="text-white font-medium tracking-widest uppercase text-sm text-glow-subtle">Tap to Reveal Fullscreen</p>
              </div>
            )}

            {!videoLoaded && !videoError && (
              <div className="aspect-video w-full bg-[var(--color-bg-secondary)] shimmer flex items-center justify-center rounded-2xl">
                <div className="text-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-10 h-10 mx-auto mb-4 border-2 border-[var(--color-accent)]/20 border-t-[var(--color-accent)] rounded-full" />
                  <p className="text-[var(--color-text-muted)] text-xs tracking-[0.2em] uppercase font-medium">Preparing Reveal</p>
                </div>
              </div>
            )}

            {videoError && (
              <div className="aspect-video w-full bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-primary)] flex items-center justify-center rounded-2xl border border-[var(--color-border)]">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/10 to-[var(--color-accent-secondary)]/5 flex items-center justify-center border border-[var(--color-accent)]/10">
                    <svg className="w-9 h-9 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold gradient-text mb-2" style={{ fontFamily: "var(--font-display)" }}>Logo Reveal Coming Soon</h3>
                  <p className="text-[var(--color-text-muted)] text-sm">The reveal video will be available shortly.</p>
                </div>
              </div>
            )}

            <video
              ref={videoRef}
              className={`w-full max-h-screen object-contain relative z-10 ${isPlaying ? "" : "rounded-2xl"} ${videoLoaded ? "block" : "hidden"}`}
              onLoadedData={handleVideoLoaded}
              onError={() => setVideoError(true)}
              controls playsInline muted
              id="reveal-video"
            >
              <source src="/reveal-video.mp4 (1).mp4" type="video/mp4" />
            </video>
          </motion.div>


          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.8 }} className="mt-12 text-center">
            <p className="text-[var(--color-text-muted)] text-[0.6rem] tracking-[0.35em] uppercase font-medium">Ignite AI Club • AI &amp; DS Department</p>
          </motion.div>
        </>
      )}
    </div>
  );
}
