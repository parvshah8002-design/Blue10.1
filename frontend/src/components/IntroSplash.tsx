import React, { useEffect, useRef, useState } from 'react';

interface IntroSplashProps {
  onDone: () => void;
}

const DURATION_MS = 6500;

export const IntroSplash: React.FC<IntroSplashProps> = ({ onDone }) => {
  const [videoFailed, setVideoFailed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startRef = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);

  // Animate fallback progress bar
  useEffect(() => {
    if (!videoFailed) return;
    startRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const p = Math.min(100, (elapsed / DURATION_MS) * 100);
      setProgress(p);
      if (p < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        handleClose();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoFailed]);

  const handleClose = () => {
    if (exiting) return;
    setExiting(true);
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setTimeout(() => {
      onDone();
    }, 600); // allow fade-out to play
  };

  const handleVideoEnded = () => handleClose();
  const handleVideoError = () => setVideoFailed(true);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden
        transition-opacity duration-600 ease-in-out ${exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ background: '#0B1929' }}
    >
      {/* ── VIDEO LAYER ── */}
      {!videoFailed && (
        <video
          ref={videoRef}
          src="/intro.mp4"
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          onError={handleVideoError}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* ── GLASSMORPHISM FALLBACK ── */}
      {videoFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          {/* Animated radial glow orbs */}
          <div
            style={{
              position: 'absolute', width: 520, height: 520, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(22,138,131,0.28) 0%, transparent 70%)',
              top: '50%', left: '50%', transform: 'translate(-50%, -58%)',
              animation: 'pulseOrb 4s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute', width: 340, height: 340, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(23,59,103,0.35) 0%, transparent 70%)',
              bottom: '15%', right: '12%',
              animation: 'pulseOrb 5.5s ease-in-out infinite reverse',
            }}
          />

          {/* Glass card */}
          <div
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.13)',
              borderRadius: 24,
              padding: '52px 48px 44px',
              maxWidth: 520,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Logo mark */}
            <div
              style={{
                width: 72, height: 72, borderRadius: 18,
                background: 'linear-gradient(135deg, #168A83 0%, #173B67 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', boxShadow: '0 12px 32px rgba(22,138,131,0.45)',
                fontSize: 30, animation: 'floatLogo 3s ease-in-out infinite',
              }}
            >
              🇮🇳
            </div>

            {/* Brand name */}
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px', fontFamily: 'Inter, system-ui, sans-serif' }}>
                Samriddhi
              </span>
              <span style={{ fontSize: 32, fontWeight: 800, color: '#168A83', letterSpacing: '-0.5px', fontFamily: 'Inter, system-ui, sans-serif' }}>
                Setu
              </span>
            </div>

            {/* Tagline */}
            <div style={{ fontSize: 12, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>
              AI Scheme Eligibility Navigator
            </div>

            {/* Divider */}
            <div style={{ width: 48, height: 2, background: 'linear-gradient(90deg, #168A83, #173B67)', borderRadius: 2, margin: '16px auto 20px' }} />

            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 32 }}>
              Connecting citizens to government schemes<br />they genuinely qualify for — instantly.
            </div>

            {/* Progress bar */}
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 999, height: 4, overflow: 'hidden', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #168A83, #2AB3AA)',
                  borderRadius: 999,
                  transition: 'width 0.1s linear',
                  boxShadow: '0 0 12px rgba(22,138,131,0.7)',
                }}
              />
            </div>

            <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>
              {Math.round(progress)}%
            </div>
          </div>
        </div>
      )}

      {/* ── SKIP BUTTON (always visible) ── */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute', top: 20, right: 24, zIndex: 10,
          padding: '7px 18px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
          color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 600,
          cursor: 'pointer', letterSpacing: '0.05em', transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.18)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
      >
        Skip Intro →
      </button>

      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes pulseOrb {
          0%, 100% { transform: translate(-50%, -58%) scale(1); opacity: 0.7; }
          50%       { transform: translate(-50%, -58%) scale(1.15); opacity: 1; }
        }
        @keyframes floatLogo {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .duration-600 { transition-duration: 600ms; }
      `}</style>
    </div>
  );
};
