'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const CONTACT_NUMBER = '+923364204333';
const WHATSAPP_NUMBER = '923364204333';
const VENUE_MAPS_URL = 'https://maps.app.goo.gl/2wmopJ2gLnKUi5VZ7';
/* ─────────────────────────────────────────────────────────────
   DRAPE CURTAIN
───────────────────────────────────────────────────────────── */
function DrapeCurtain({ isOpen, isGone }) {
  if (isGone) return null;

  return (
    <div className={`curtain-wrapper ${isOpen ? 'curtain-opening' : ''}`} aria-hidden="true">
      {/* Velvet Left Curtain */}
      <div className={`curtain curtain-left ${isOpen ? 'curtain-left-open' : ''}`}>
        <div className="curtain-fabric" />
        <div className="curtain-trim trim-right" />
        <div className="curtain-tassel tassel-right">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="tassel-strand" style={{ animationDelay: `${i * 0.07}s` }} />
          ))}
        </div>
      </div>

      {/* Center reveal badge */}
      <div className={`curtain-center ${isOpen ? 'curtain-center-fade' : ''}`}>
        <div className="curtain-monogram">
          <span className="mono-letter">H</span>
          <span className="mono-gem">◆</span>
          <span className="mono-letter">J</span>
        </div>
        <p className="curtain-invite-text">You are cordially invited</p>
      </div>

      {/* Velvet Right Curtain */}
      <div className={`curtain curtain-right ${isOpen ? 'curtain-right-open' : ''}`}>
        <div className="curtain-fabric" />
        <div className="curtain-trim trim-left" />
        <div className="curtain-tassel tassel-left">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="tassel-strand" style={{ animationDelay: `${i * 0.07}s` }} />
          ))}
        </div>
      </div>

      {/* Center seam gold line */}
      <div className="curtain-seam" />
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
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date('2026-06-05T11:00:00');
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return setTime({ d: 0, h: 0, m: 0, s: 0 });
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
    <section className="countdown-section reveal">
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
  const scratching = useRef(false);
  const scratchedRatio = useRef(0);

  const drawFoil = useCallback((ctx, w, h) => {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#E8CF9A');
    grad.addColorStop(0.35, '#C9A96E');
    grad.addColorStop(0.7, '#9E7840');
    grad.addColorStop(1, '#C9A96E');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(27, 58, 45, 0.12)';
    for (let x = 0; x < w; x += 14) {
      for (let y = 0; y < h; y += 14) {
        if ((x + y) % 28 === 0) ctx.fillRect(x, y, 6, 6);
      }
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = '600 13px Jost, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch to reveal the date', w / 2, h / 2 - 6);
    ctx.font = 'italic 400 15px "Cormorant Garamond", serif';
    ctx.fillStyle = 'rgba(27, 58, 45, 0.55)';
    ctx.fillText('✦  drag or rub here  ✦', w / 2, h / 2 + 18);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFoil(ctx, rect.width, rect.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, [drawFoil]);

  const scratch = useCallback((clientX, clientY) => {
    if (revealed) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (scratchedRatio.current < 0.38) {
      const w = canvas.width;
      const h = canvas.height;
      const data = canvas.getContext('2d').getImageData(0, 0, w, h).data;
      let cleared = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] === 0) cleared++;
      }
      scratchedRatio.current = cleared / (w * h);
      if (scratchedRatio.current >= 0.38) setRevealed(true);
    }
  }, [revealed]);

  const onPointerDown = (e) => {
    scratching.current = true;
    scratch(e.clientX, e.clientY);
  };
  const onPointerMove = (e) => {
    if (!scratching.current) return;
    scratch(e.clientX, e.clientY);
  };
  const onPointerUp = () => {
    scratching.current = false;
  };

  return (
    <div
      ref={containerRef}
      className={`scratch-reveal ${revealed ? 'scratch-revealed' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div className="scratch-content">{children}</div>
      {!revealed && (
        <canvas
          ref={canvasRef}
          className="scratch-canvas"
          aria-label="Scratch to reveal Nikkah date and time"
        />
      )}
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
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          guests: String(guests),
          attend: form.attend,
          attendingLabel: attending,
          note: form.note.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not save RSVP');
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err.message ||
          'Could not send your RSVP. Please try again or contact us on WhatsApp.'
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
export default function WeddingPage() {
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [curtainGone, setCurtainGone] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setCurtainOpen(true), 1400);
    const t2 = setTimeout(() => setPageReady(true), 2600);
    const t3 = setTimeout(() => setCurtainGone(true), 3400);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!pageReady) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [pageReady]);

  return (
    <>
      <DrapeCurtain isOpen={curtainOpen} isGone={curtainGone} />

      <div className={`page ${pageReady ? 'page-ready' : ''}`}>
        <FloatingPetals />

        {/* ── HERO ─────────────────────────────────── */}
        <section className="hero">
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
              <h1 className="name groom-name">Hannan Ahmad</h1>
              <div className="names-join">
                <div className="join-line" />
                <span className="join-script">weds</span>
                <div className="join-line" />
              </div>
              <h1 className="name bride-name">Jiya Farooqi</h1>
            </div>

            <GoldDivider wide />

            <p className="hero-tagline reveal">
              We joyfully request<br />
              the pleasure of your company at our Nikkah
            </p>

            <div className="hero-date reveal">
              <div className="date-gem">✦</div>
              <div className="date-block">
                <span className="date-day">Thursday</span>
                <span className="date-num">5</span>
                <span className="date-month">June 2026</span>
              </div>
              <div className="date-gem">✦</div>
            </div>

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

          <div className="scroll-hint">
            <div className="scroll-track">
              <div className="scroll-dot" />
            </div>
            <span className="scroll-text">Scroll to explore</span>
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
                <div className="event-details">
                  <div className="event-row">
                    <span className="event-label">Date</span>
                    <span className="event-value">Thursday, 5th June 2026</span>
                  </div>
                  <div className="event-row">
                    <span className="event-label">Time</span>
                    <span className="event-value">11:00 AM</span>
                  </div>
                </div>
              </ScratchReveal>
              <div className="event-details event-details-venue">
                <div className="event-row">
                  <span className="event-label">Location</span>
                  <a
                    href={VENUE_MAPS_URL}
                    className="event-value event-map-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
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
            <p className="section-sub">Kindly respond by 25th May 2026</p>

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
              <text x="50" y="45" textAnchor="middle" fill="var(--gold)" fontSize="14" fontFamily="var(--font-cormorant)" fontWeight="300">H ◆ J</text>
              <text x="50" y="62" textAnchor="middle" fill="var(--gold)" fontSize="7" fontFamily="var(--font-jost)" letterSpacing="3" opacity="0.8">2026</text>
            </svg>
          </div>
          <p className="footer-script">Hannan & Jiya</p>
          <p className="footer-date">5th June 2026</p>
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
