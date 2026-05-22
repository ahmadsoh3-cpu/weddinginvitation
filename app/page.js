'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { submitRsvp } from './lib/submitRsvp';

const CONTACT_NUMBER = '+923364204333';
const REVEAL_STROKES = 38;
const WHATSAPP_NUMBER = '923364204333';
const VENUE_MAPS_URL = 'https://maps.app.goo.gl/B6AZX9tVDVF85AQY8';

/* ─────────────────────────────────────────────────────────────
   VELVET DRAPE CURTAIN (last pushed repo — tassels + CSS drapes)
───────────────────────────────────────────────────────────── */
function DrapeCurtain({ isOpen, isGone, onReveal }) {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const openedRef = useRef(false);

  const waiting = !isOpen;

  const handleReveal = () => {
    if (!waiting || openedRef.current) return;
    openedRef.current = true;
    onReveal?.();
  };

  /* Backup slide — ensures panels move even if CSS data-open is delayed */
  useEffect(() => {
    if (!isOpen) return;

    const slide = () => {
      if (leftRef.current) {
        leftRef.current.style.transform = 'translate3d(-100%, 0, 0)';
      }
      if (rightRef.current) {
        rightRef.current.style.transform = 'translate3d(100%, 0, 0)';
      }
    };

    slide();
    const id = requestAnimationFrame(slide);
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  if (isGone) return null;

  return (
    <div
      className={`curtain-wrapper ${waiting ? 'curtain-wrapper--waiting' : 'curtain-opening'}`}
      data-open={isOpen ? 'true' : 'false'}
    >
      <div ref={leftRef} className="curtain curtain-left">
        <div className="curtain-fabric" />
        <div className="curtain-trim trim-right" />
        <div className="curtain-tassel tassel-right">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="tassel-strand" style={{ animationDelay: `${i * 0.07}s` }} />
          ))}
        </div>
      </div>

      <div className={`curtain-center ${isOpen ? 'curtain-center-fade' : ''}`}>
        <div className="curtain-monogram">
          <span className="mono-letter">H</span>
          <span className="mono-gem">◆</span>
          <span className="mono-letter">J</span>
        </div>
        <p className="curtain-invite-text">You are cordially invited</p>
        {waiting && (
          <>
            <p className="curtain-tap-hint">Touch anywhere to enter</p>
            <button type="button" className="curtain-open-btn" onClick={handleReveal}>
              Open invitation
            </button>
          </>
        )}
      </div>

      <div ref={rightRef} className="curtain curtain-right">
        <div className="curtain-fabric" />
        <div className="curtain-trim trim-left" />
        <div className="curtain-tassel tassel-left">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="tassel-strand" style={{ animationDelay: `${i * 0.07}s` }} />
          ))}
        </div>
      </div>

      <div className="curtain-seam" />

      {waiting && (
        <button
          type="button"
          className="curtain-tap-overlay"
          onClick={handleReveal}
          aria-label="Touch to open the invitation"
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FLOATING ROSE PETALS
───────────────────────────────────────────────────────────── */
function FloatingPetals() {
  const petals = [
    { left: '4%',  delay: '0s',    dur: '9s',   size: 13, hue: 0 },
    { left: '11%', delay: '2.1s',  dur: '11s',  size: 9,  hue: 10 },
    { left: '19%', delay: '0.6s',  dur: '10s',  size: 15, hue: -5 },
    { left: '28%', delay: '3.4s',  dur: '8.5s', size: 11, hue: 5 },
    { left: '37%', delay: '1.2s',  dur: '12s',  size: 17, hue: 0 },
    { left: '46%', delay: '4.5s',  dur: '9s',   size: 10, hue: 15 },
    { left: '55%', delay: '0.9s',  dur: '11s',  size: 14, hue: -8 },
    { left: '63%', delay: '2.8s',  dur: '10.5s',size: 12, hue: 8 },
    { left: '72%', delay: '1.7s',  dur: '9.5s', size: 16, hue: 3 },
    { left: '81%', delay: '3.9s',  dur: '11s',  size: 10, hue: -3 },
    { left: '89%', delay: '0.3s',  dur: '10s',  size: 13, hue: 12 },
    { left: '96%', delay: '5.1s',  dur: '8.5s', size: 8,  hue: -6 },
    { left: '24%', delay: '6.2s',  dur: '10s',  size: 11, hue: 7 },
    { left: '68%', delay: '5.7s',  dur: '9s',   size: 15, hue: 2 },
    { left: '43%', delay: '7s',    dur: '11.5s', size: 9, hue: -10 },
    { left: '8%',  delay: '4s',    dur: '12s',  size: 12, hue: 4 },
    { left: '84%', delay: '6.8s',  dur: '10s',  size: 14, hue: -2 },
  ];

  return (
    <div className="petals-container" aria-hidden="true">
      {petals.map((p, i) => (
        <div
          key={i}
          className="petal"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size * 1.55}px`,
            animationDelay: p.delay,
            animationDuration: p.dur,
            '--hue': `${p.hue}deg`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   COUNTDOWN TIMER
───────────────────────────────────────────────────────────── */
function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    setMounted(true);
    const target = new Date('2026-06-12T18:00:00+05:00');
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setTime({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { val: time.d, label: 'Days' },
    { val: time.h, label: 'Hours' },
    { val: time.m, label: 'Minutes' },
    { val: time.s, label: 'Seconds' },
  ];

  return (
    <section className={`countdown-section reveal ${mounted ? 'countdown-live' : ''}`}>
      <div className="small-ornament">✦ ✦ ✦</div>
      <p className="eyebrow">The Celebration Begins In</p>
      <div className="countdown-grid">
        {units.map(({ val, label }) => (
          <div key={label} className="countdown-cell">
            <div className="countdown-num">{String(val).padStart(2, '0')}</div>
            <div className="countdown-lbl">{label}</div>
          </div>
        ))}
      </div>
      <div className="small-ornament">✦ ✦ ✦</div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   WEDDING CARD FLORALS (reference invitation style)
───────────────────────────────────────────────────────────── */
function WeddingCardFlorals({ revealed }) {
  return (
    <div
      className={`wedding-card-florals ${revealed ? 'wedding-card-florals--visible' : ''}`}
      aria-hidden="true"
    >
      <img src="/wedding-floral.png" alt="" className="wedding-floral wedding-floral-left" />
      <img src="/wedding-floral.png" alt="" className="wedding-floral wedding-floral-right" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PETAL BURST (on scratch reveal)
───────────────────────────────────────────────────────────── */
function PetalBurst({ origin }) {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    if (!origin) return;

    const batch = Array.from({ length: 96 }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      left: origin.x + (Math.random() - 0.5) * origin.width * 1.2,
      top: origin.y + (Math.random() - 0.5) * origin.height * 0.6,
      size: 7 + Math.random() * 16,
      dur: 2.2 + Math.random() * 2.8,
      delay: Math.random() * 0.65,
      drift: (Math.random() - 0.5) * 220,
      spin: Math.random() * 720 - 360,
      hue: Math.floor(Math.random() * 40) - 15,
    }));

    setPetals(batch);
    const clear = setTimeout(() => setPetals([]), 6500);
    return () => clearTimeout(clear);
  }, [origin]);

  if (!petals.length) return null;

  return (
    <div className="petal-burst-layer" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal-burst-item"
          style={{
            left: `${p.left}px`,
            top: `${p.top}px`,
            width: `${p.size}px`,
            height: `${p.size * 1.55}px`,
            '--dur': `${p.dur}s`,
            '--del': `${p.delay}s`,
            '--drift': `${p.drift}px`,
            '--spin': `${p.spin}deg`,
            '--hue': `${p.hue}deg`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ORNAMENTAL DIVIDER
───────────────────────────────────────────────────────────── */
function GoldDivider({ wide }) {
  return (
    <div className={`gold-divider ${wide ? 'gold-divider-wide' : ''}`}>
      <div className="divider-rule" />
      <span className="divider-gem">◆</span>
      <div className="divider-rule" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SCRATCH TO REVEAL (Nikkah dates only)
───────────────────────────────────────────────────────────── */
function ScratchReveal({ children }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [burstOrigin, setBurstOrigin] = useState(null);
  const scratching = useRef(false);
  const scratchStrokes = useRef(0);
  const lastPoint = useRef(null);
  const isRevealing = useRef(false);
  const hasScratched = useRef(false);

  const drawFoil = useCallback((ctx, w, h) => {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#E8CF9A');
    grad.addColorStop(0.35, '#C9A96E');
    grad.addColorStop(0.7, '#9E7840');
    grad.addColorStop(1, '#C9A96E');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(196, 165, 116, 0.15)';
    for (let x = 0; x < w; x += 14) {
      for (let y = 0; y < h; y += 14) {
        if ((x + y) % 28 === 0) ctx.fillRect(x, y, 6, 6);
      }
    }
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 252, 245, 0.95)';
    const cy = h / 2;
    ctx.font = '600 11px "Cormorant Garamond", serif';
    ctx.fillText('SCRATCH HERE', w / 2, cy - 14);
    ctx.font = '500 13px "Cormorant Garamond", serif';
    ctx.fillText('Date · Time · Venue', w / 2, cy + 2);
    ctx.font = 'italic 400 12px "Cormorant Garamond", serif';
    ctx.fillStyle = 'rgba(90, 60, 20, 0.75)';
    ctx.fillText('✦ rub to reveal ✦', w / 2, cy + 16);
  }, []);

  useEffect(() => {
    if (revealed) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      if (hasScratched.current) return;
      const rect = container.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFoil(ctx, rect.width, rect.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, [drawFoil, revealed]);

  const completeReveal = useCallback(() => {
    if (isRevealing.current || revealed) return;
    isRevealing.current = true;
    scratching.current = false;
    lastPoint.current = null;

    const container = containerRef.current;
    if (container) {
      const box = container.getBoundingClientRect();
      setBurstOrigin({
        x: box.left,
        y: box.top,
        width: box.width,
        height: box.height,
      });
    }
    setRevealed(true);
  }, [revealed]);

  const scratchAt = useCallback(
    (clientX, clientY) => {
      if (revealed || isRevealing.current) return;
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 34;

      const prev = lastPoint.current;
      if (prev) {
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(x, y, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      hasScratched.current = true;
      lastPoint.current = { x, y };
      scratchStrokes.current += 1;

      if (scratchStrokes.current >= REVEAL_STROKES) {
        completeReveal();
      }
    },
    [revealed, completeReveal]
  );

  const onPointerDown = (e) => {
    if (revealed || isRevealing.current) return;
    e.preventDefault();
    const el = containerRef.current;
    if (el?.setPointerCapture) {
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    scratching.current = true;
    lastPoint.current = null;
    scratchAt(e.clientX, e.clientY);
  };

  const onPointerMove = (e) => {
    if (!scratching.current || revealed || isRevealing.current) return;
    e.preventDefault();
    scratchAt(e.clientX, e.clientY);
  };

  const endScratch = (e) => {
    scratching.current = false;
    lastPoint.current = null;
    const el = containerRef.current;
    if (el?.releasePointerCapture && e?.pointerId != null) {
      try {
        if (el.hasPointerCapture?.(e.pointerId)) {
          el.releasePointerCapture(e.pointerId);
        }
      } catch {
        /* ignore */
      }
    }
  };

  const onPointerUp = (e) => endScratch(e);
  const onPointerCancel = (e) => endScratch(e);

  return (
    <div className="scratch-block">
      {!revealed && (
        <p className="scratch-hint" role="status">
          <span className="scratch-hint-badge">Scratch card</span>
          Rub the gold foil to reveal date, time &amp; venue
        </p>
      )}
      <div
        ref={containerRef}
        className={`scratch-reveal scratch-reveal--compact ${revealed ? 'scratch-revealed' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={(e) => {
          if (!scratching.current) endScratch(e);
        }}
      >
        <WeddingCardFlorals revealed={revealed} />
        <div className="scratch-content">{children}</div>
        <canvas
          ref={canvasRef}
          className={`scratch-canvas ${revealed ? 'scratch-canvas--done' : ''}`}
          aria-hidden={revealed}
          aria-label="Scratch the gold foil to reveal Nikkah date and time"
        />
        {!revealed && (
          <span className="scratch-finger-hint" aria-hidden="true">
            Scratch here
          </span>
        )}
      </div>
      <PetalBurst origin={burstOrigin} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   EVENT CARD
───────────────────────────────────────────────────────────── */
function EventCard({ icon, tag, name, rows, children }) {
  return (
    <div className="event-card reveal">
      <div className="event-card-top">
        <div className="event-icon">{icon}</div>
        <div className="event-tag">{tag}</div>
        <h3 className="event-name">{name}</h3>
      </div>
      <GoldDivider />
      {children}
      {rows?.length > 0 && (
        <div className="event-details">
          {rows.map(({ label, value }) => (
            <div key={label} className="event-row">
              <span className="event-label">{label}</span>
              <span className="event-value">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   RSVP FORM
───────────────────────────────────────────────────────────── */
function RsvpForm() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    guests: '1',
    attend: 'yes',
    note: '',
  });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const phone = form.phone.trim();
    if (!name) {
      setError('Please enter your name.');
      return;
    }
    if (!phone) {
      setError('Please enter your phone or WhatsApp number.');
      return;
    }
    const guests = Math.min(6, Math.max(1, parseInt(form.guests, 10) || 1));
    const attending =
      form.attend === 'yes' ? 'Joyfully Accept ✦' : 'Regretfully Decline';

    setSubmitting(true);
    setError('');

    try {
      await submitRsvp({
        name,
        phone,
        guests: String(guests),
        attend: form.attend,
        attendingLabel: attending,
        note: form.note.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err.message ||
          'Could not send your RSVP. Please try again or WhatsApp us at +923364204333.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rsvp-success">
        <div className="rsvp-success-icon">✦</div>
        <h3 className="rsvp-success-title">Thank you!</h3>
        <p className="rsvp-success-text">
          Your RSVP has been received. We look forward to celebrating with you.
        </p>
        <button
          type="button"
          className="rsvp-btn rsvp-btn-secondary"
          onClick={() => setSubmitted(false)}
        >
          Send another response
        </button>
      </div>
    );
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit} noValidate>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-field">
        <label className="form-label" htmlFor="rsvp-name">Your Name</label>
        <input
          id="rsvp-name"
          className="form-input"
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={update('name')}
          required
        />
      </div>
      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="rsvp-phone">Phone / WhatsApp</label>
          <input
            id="rsvp-phone"
            className="form-input"
            type="tel"
            placeholder="+92 ..."
            value={form.phone}
            onChange={update('phone')}
            required
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="rsvp-guests">Number of Guests</label>
          <input
            id="rsvp-guests"
            className="form-input"
            type="number"
            placeholder="1"
            min="1"
            max="6"
            value={form.guests}
            onChange={update('guests')}
            required
          />
        </div>
      </div>
      <div className="form-field">
        <span className="form-label">Will you be attending?</span>
        <div className="radio-set">
          <label className="radio-opt">
            <input
              type="radio"
              name="attend"
              value="yes"
              checked={form.attend === 'yes'}
              onChange={update('attend')}
            />
            <span className="radio-box" />
            <span>Joyfully Accept ✦</span>
          </label>
          <label className="radio-opt">
            <input
              type="radio"
              name="attend"
              value="no"
              checked={form.attend === 'no'}
              onChange={update('attend')}
            />
            <span className="radio-box" />
            <span>Regretfully Decline</span>
          </label>
        </div>
      </div>
      <div className="form-field">
        <label className="form-label" htmlFor="rsvp-note">A note for the couple (optional)</label>
        <textarea
          id="rsvp-note"
          className="form-input form-textarea"
          placeholder="Share your wishes..."
          rows={3}
          value={form.note}
          onChange={update('note')}
        />
      </div>
      <button type="submit" className="rsvp-btn" disabled={submitting}>
        <span>{submitting ? 'Sending…' : 'Send My Response'}</span>
        <span className="btn-ornament">◆</span>
      </button>
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
const WEDDING_MUSIC_SRC = '/wedding-music.mp3';

export default function WeddingPage() {
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [curtainGone, setCurtainGone] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const revealStarted = useRef(false);
  const musicRef = useRef(null);

  const playWeddingMusic = useCallback(() => {
    const audio = musicRef.current;
    if (!audio) return;
    audio.volume = 0.55;
    audio.play().catch(() => {});
  }, []);

  const handleCurtainReveal = useCallback(() => {
    if (revealStarted.current) return;
    revealStarted.current = true;
    setCurtainOpen(true);
    playWeddingMusic();
    window.setTimeout(() => setPageReady(true), 1000);
    window.setTimeout(() => setCurtainGone(true), 2600);
  }, [playWeddingMusic]);

  useEffect(() => {
    if (curtainGone) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [curtainGone]);

  useEffect(() => {
    const markInView = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      document.querySelectorAll('.reveal').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < vh) {
          el.classList.add('in-view');
        }
      });
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in-view');
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -5% 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    markInView();
    requestAnimationFrame(markInView);
    window.addEventListener('resize', markInView);

    return () => {
      obs.disconnect();
      window.removeEventListener('resize', markInView);
    };
  }, []);

  useEffect(() => {
    if (!pageReady) return;
    const run = () => {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
    };
    run();
    requestAnimationFrame(run);
  }, [pageReady]);

  return (
    <>
      <audio
        ref={musicRef}
        src={WEDDING_MUSIC_SRC}
        loop
        preload="auto"
        aria-label="Background music"
      />

      <DrapeCurtain
        isOpen={curtainOpen}
        isGone={curtainGone}
        onReveal={handleCurtainReveal}
      />

      <div className={`page ${pageReady ? 'page-ready' : ''}`}>
        <FloatingPetals />

        {/* ── HERO ─────────────────────────────────── */}
        <section className="hero">
          <div className="hero-bg-ornament" aria-hidden="true" />
          <div className="hero-card reveal">
            <div className="hero-card-frame" aria-hidden="true" />
            <div className="hero-inner">

            {/* Arabesque top ornament */}
            <div className="hero-arabesque reveal">
              <svg width="220" height="60" viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M110 5 C85 5, 60 20, 40 20 C20 20, 5 10, 5 10 C5 10, 20 30, 40 30 C60 30, 85 45, 110 55 C135 45, 160 30, 180 30 C200 30, 215 10, 215 10 C215 10, 200 20, 180 20 C160 20, 135 5, 110 5Z" fill="var(--gold)" opacity="0.6"/>
                <circle cx="110" cy="30" r="6" fill="var(--gold)"/>
                <circle cx="40" cy="20" r="3" fill="var(--gold)" opacity="0.7"/>
                <circle cx="180" cy="20" r="3" fill="var(--gold)" opacity="0.7"/>
                <line x1="5" y1="30" x2="100" y2="30" stroke="var(--gold)" strokeWidth="0.5" opacity="0.4"/>
                <line x1="120" y1="30" x2="215" y2="30" stroke="var(--gold)" strokeWidth="0.5" opacity="0.4"/>
              </svg>
            </div>

            <div className="bismillah reveal">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>

            <div className="hero-badge reveal">
              <span className="badge-text">Nikkah Invitation</span>
            </div>

            <div className="hero-names reveal">
              <h1 className="name groom-name">Hannan Ahmed</h1>
              <div className="names-join">
                <div className="join-line" />
                <span className="join-script">&</span>
                <div className="join-line" />
              </div>
              <h1 className="name bride-name">Jayesha Farooqi</h1>
            </div>

            <GoldDivider wide />

            <p className="hero-tagline reveal">
              We joyfully request<br />
              the pleasure of your company at our Nikkah
            </p>

            <p className="hero-save-date reveal">
              <span className="hero-save-date-label">Save the celebration</span>
              <span className="hero-save-date-hint">Details revealed below — scratch to unveil</span>
            </p>

            {/* Bottom arabesque */}
            <div className="hero-arabesque hero-arabesque-bottom reveal">
              <svg width="220" height="60" viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform:'scaleY(-1)'}}>
                <path d="M110 5 C85 5, 60 20, 40 20 C20 20, 5 10, 5 10 C5 10, 20 30, 40 30 C60 30, 85 45, 110 55 C135 45, 160 30, 180 30 C200 30, 215 10, 215 10 C215 10, 200 20, 180 20 C160 20, 135 5, 110 5Z" fill="var(--gold)" opacity="0.6"/>
                <circle cx="110" cy="30" r="6" fill="var(--gold)"/>
                <circle cx="40" cy="20" r="3" fill="var(--gold)" opacity="0.7"/>
                <circle cx="180" cy="20" r="3" fill="var(--gold)" opacity="0.7"/>
              </svg>
            </div>
            </div>
          </div>

          <div className="scroll-hint">
            <div className="scroll-track">
              <div className="scroll-dot" />
            </div>
            <span className="scroll-text">Scroll — scratch below for date, time &amp; venue</span>
          </div>
        </section>

        {/* ── COUNTDOWN ────────────────────────────── */}
        <Countdown />

        {/* ── EVENTS ───────────────────────────────── */}
        <section className="events-section">
          <div className="section-header reveal">
            <div className="small-ornament">— ✦ —</div>
            <h2 className="section-title">The Nikkah</h2>
            <p className="section-sub">Join us for this sacred occasion</p>
          </div>

          <div className="events-grid events-grid-single">
            <EventCard icon="🕌" tag="Announcement" name="Nikkah">
              <ScratchReveal>
                <div className="wedding-reveal-card wedding-reveal-card--compact">
                  <p className="wedding-reveal-day">Friday</p>
                  <p className="wedding-reveal-date">12th June 2026</p>
                  <p className="wedding-reveal-time-detail">6:00 PM</p>
                  <p className="wedding-reveal-venue">Bahria Golf &amp; Country Club</p>
                  <a
                    href={VENUE_MAPS_URL}
                    className="wedding-reveal-map"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Google Maps
                  </a>
                </div>
              </ScratchReveal>
            </EventCard>
          </div>
        </section>

        {/* ── VERSE ────────────────────────────────── */}
        <section className="verse-section reveal">
          <div className="verse-inner">
            <div className="verse-ornament">✦</div>
            <blockquote className="verse-text">
              "And He placed between you affection and mercy."
            </blockquote>
            <cite className="verse-ref">— Al-Qur'an 30:21</cite>
            <div className="verse-ornament">✦</div>
          </div>
        </section>

        {/* ── EMERGENCY CONTACT ────────────────────── */}
        <section className="emergency-section reveal">
          <div className="section-header">
            <div className="small-ornament">— ✦ —</div>
            <h2 className="section-title">Emergency Contact</h2>
            <p className="section-sub">For any urgent matters on the day</p>
          </div>
          <p className="emergency-number">{CONTACT_NUMBER}</p>
          <div className="emergency-actions">
            <a href={`tel:${CONTACT_NUMBER}`} className="emergency-btn">
              <span className="emergency-btn-icon" aria-hidden="true">📞</span>
              Call
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              className="emergency-btn emergency-btn-wa"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="emergency-btn-icon" aria-hidden="true">💬</span>
              WhatsApp
            </a>
          </div>
        </section>

        {/* ── RSVP ─────────────────────────────────── */}
        <section className="rsvp-section reveal">
          <div className="rsvp-bg-ornament" aria-hidden="true" />
          <div className="rsvp-inner">
            <div className="small-ornament">— ✦ —</div>
            <h2 className="section-title">RSVP</h2>
            <p className="section-sub">Kindly respond by 5th June 2026</p>

            <RsvpForm />
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────── */}
        <footer className="footer reveal">
          <div className="footer-seal">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" stroke="var(--gold)" strokeWidth="0.8" opacity="0.5"/>
              <circle cx="50" cy="50" r="38" stroke="var(--gold)" strokeWidth="0.5" opacity="0.3"/>
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * 45 * Math.PI) / 180;
                const x = 50 + 42 * Math.cos(angle);
                const y = 50 + 42 * Math.sin(angle);
                return <circle key={i} cx={x} cy={y} r="2" fill="var(--gold)" opacity="0.6" />;
              })}
              <text x="50" y="45" textAnchor="middle" fill="var(--gold)" fontSize="14" fontFamily="Cormorant Garamond, serif" fontWeight="300">H ◆ J</text>
              <text x="50" y="62" textAnchor="middle" fill="var(--gold)" fontSize="7" fontFamily="Cormorant Garamond, serif" letterSpacing="3" opacity="0.8">2026</text>
            </svg>
          </div>
          <p className="footer-script">Hannan & Jayesha</p>
          <p className="footer-date">12th June 2026</p>
          <GoldDivider />
          <p className="footer-closing">
            With gratitude and love, we look forward to celebrating with you.
          </p>
          <div className="footer-gems">✦ ✦ ✦</div>
        </footer>
      </div>
    </>
  );
}
