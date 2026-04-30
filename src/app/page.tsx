"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/qr").then(r => r.json()).then(d => { if (d.success) setQrCode(d.qrCode); }).catch(() => {});
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative">
      {/* Floating particles */}
      <Particles />

      {/* Top badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mb-10"
      >
        <span className="badge">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
          Exclusive Access
        </span>
      </motion.div>

      {/* Logo mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="relative mb-10"
      >
        {/* Outer glow ring */}
        <div className="absolute inset-[-20px] rounded-full bg-gradient-to-br from-[var(--color-accent)]/10 to-[var(--color-accent-secondary)]/5 blur-xl pulse-ring" />

        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)] p-[2px] relative">
          <div className="w-full h-full rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center relative overflow-hidden">
            {/* Inner shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent" />
            <svg className="w-14 h-14 text-[var(--color-accent-light)] relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Title block */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="text-center mb-14"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
          <span className="gradient-text-animated text-glow">Ignite AI</span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-base md:text-lg font-medium tracking-[0.08em] uppercase">
          Department of AI &amp; Data Science
        </p>
        <div className="mt-5 line-glow w-32 mx-auto" />
      </motion.div>

      {/* QR Card */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6 }}
        className="glass-card p-8 md:p-10 text-center max-w-sm w-full"
      >
        <p className="text-[var(--color-text-muted)] text-[0.65rem] uppercase tracking-[0.25em] mb-6 font-semibold">
          Scan to Access
        </p>

        {/* QR code */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-[-14px] rounded-2xl border border-[var(--color-accent)]/15 pulse-ring" />
          <div className="absolute inset-[-28px] rounded-3xl border border-[var(--color-accent-secondary)]/8 pulse-ring" style={{ animationDelay: "1.2s" }} />

          {qrCode ? (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              src={qrCode}
              alt="QR Code"
              className="w-52 h-52 rounded-xl"
              id="qr-code-image"
            />
          ) : (
            <div className="w-52 h-52 rounded-xl bg-[var(--color-bg-secondary)] shimmer flex items-center justify-center">
              <span className="text-[var(--color-text-muted)] text-xs tracking-widest">LOADING</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--color-border)]" />
          <span className="text-[var(--color-text-muted)] text-[0.6rem] uppercase tracking-[0.3em] font-medium">or</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--color-border)]" />
        </div>

        {/* CTA */}
        <Link href="/login" id="login-link">
          <button className="btn-primary w-full text-sm tracking-wider flex items-center justify-center gap-2" id="access-btn">
            Enter Access Portal
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </Link>
      </motion.div>

      {/* Footer line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mt-12 text-center"
      >
        <p className="text-[var(--color-text-muted)] text-[0.6rem] tracking-[0.35em] uppercase font-medium">
          Authorized Personnel Only
        </p>
      </motion.div>
    </div>
  );
}

function Particles() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    dur: Math.random() * 5 + 4,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.25 + 0.05,
  }));

  return (
    <div className="particle-canvas" aria-hidden="true">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: p.id % 3 === 0
              ? `rgba(168, 85, 247, ${p.opacity})`
              : p.id % 3 === 1
              ? `rgba(6, 182, 212, ${p.opacity})`
              : `rgba(99, 102, 241, ${p.opacity})`,
          }}
          animate={{
            y: [0, -25 - Math.random() * 20, 0],
            x: [0, Math.random() * 10 - 5, 0],
            opacity: [p.opacity, p.opacity * 2.5, p.opacity],
          }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
