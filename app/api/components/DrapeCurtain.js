'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import './DrapeCurtain.css';

/**
 * Self-contained opening curtain — do not split state with parent.
 * Parent only receives onOpened() after user taps (for music / page fade).
 */
export default function DrapeCurtain({ onOpened }) {
  const [phase, setPhase] = useState('closed'); // closed → open → gone
  const openedRef = useRef(false);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const open = useCallback(() => {
    if (openedRef.current) return;
    openedRef.current = true;

    setPhase('open');
    onOpened?.();

    window.setTimeout(() => setPhase('gone'), 2600);
  }, [onOpened]);

  /* Force panels to slide even if React batching delays paint */
  useEffect(() => {
    if (phase !== 'open') return;

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
  }, [phase]);

  useEffect(() => {
    if (phase === 'gone') {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  if (phase === 'gone') return null;

  const isOpen = phase === 'open';

  return (
    <div
      className={`drape-screen drape-screen--${phase}`}
      onPointerDownCapture={phase === 'closed' ? open : undefined}
      onKeyDown={phase === 'closed' ? (e) => e.key === 'Enter' && open() : undefined}
      role={phase === 'closed' ? 'button' : undefined}
      tabIndex={phase === 'closed' ? 0 : undefined}
      aria-label={phase === 'closed' ? 'Tap to open the invitation' : undefined}
    >
      <div ref={leftRef} className="drape-panel drape-panel--left">
        <div className="drape-panel-fabric" />
        <div className="drape-panel-trim drape-panel-trim--right" />
      </div>

      <div className={`drape-center ${isOpen ? 'drape-center--hide' : ''}`}>
        <div className="drape-monogram">
          <span className="drape-mono-letter">H</span>
          <span className="drape-mono-gem">◆</span>
          <span className="drape-mono-letter">J</span>
        </div>
        <p className="drape-invite-text">You are cordially invited</p>
        {!isOpen && (
          <>
            <p className="drape-tap-hint">Touch anywhere to enter</p>
            <button
              type="button"
              className="drape-open-btn"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
            >
              Open invitation
            </button>
          </>
        )}
      </div>

      <div ref={rightRef} className="drape-panel drape-panel--right">
        <div className="drape-panel-fabric" />
        <div className="drape-panel-trim drape-panel-trim--left" />
      </div>

      <div className={`drape-seam ${isOpen ? 'drape-seam--hide' : ''}`} />
    </div>
  );
}
