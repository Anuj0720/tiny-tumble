import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import "./interface.css";
import { audio } from "../audio";

export const Interface = ({ started, gameFinished, onPlay, onRestart }) => {
  const { progress, active } = useProgress();

  const [displayProgress, setDisplayProgress] = useState(0);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const raf = useRef();

  /* ---------------- MINIMUM LOADER TIME ---------------- */
  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 1500);
    return () => clearTimeout(t);
  }, []);

  /* ---------------- SMOOTH PROGRESS ---------------- */
  useEffect(() => {
    const animate = () => {
      setDisplayProgress((prev) => {
        const target = active ? Math.min(progress, 99) : 100;
        let next = prev + (target - prev) * 0.1;
        if (!active && progress >= 100) return 100;
        return next;
      });

      raf.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf.current);
  }, [progress, active]);

  const loaded = progress >= 100 && minTimePassed && displayProgress >= 100;

  // DERIVED STATE (NO EFFECT, NO WARNING)
  const shouldExit = isExiting && !gameFinished;

  // Hide UI during gameplay
  if (started && !gameFinished) return null;

  /* ---------------- HANDLERS ---------------- */
  const handlePlay = () => {
    audio.click.currentTime = 0;
    audio.bg.currentTime = 0;
    audio.click.play();
    audio.bg.play();
    setIsExiting(true);
    setTimeout(onPlay, 900);
  };

  const handleRestart = () => {
    audio.click.currentTime = 0;
    audio.click.play();
    setIsExiting(true);
    setTimeout(onRestart, 900);
  };

  /* ---------------- CIRCLE PROGRESS ---------------- */
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - displayProgress / 100);

  return (
    <div className={`interface ${shouldExit ? "exit" : ""}`}>
      <div className="center-ui">
        {/* ---------- START / LOADING ---------- */}
        {!gameFinished ? (
          !loaded ? (
            <div className="loading-screen">
              <h1 className="loading-title">Tiny Tumble</h1>
              <div className="loader-container">
                {/* Progress Text inside the circle */}
                <span className="percent-text">{Math.floor(displayProgress)}%</span>
                
                <svg width="120" height="120" className="loader-svg">
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="white"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <div className="main-menu-content">
              <button className="play-btn" onClick={handlePlay}>
                Play
              </button>

              <div className="controls-container">
                {/* MOVE CONTROLS */}
                <div className="control-group">
                  <div className="keys-grid">
                    <div className="key up">↑</div>
                    <div className="key left">←</div>
                    <div className="key down">↓</div>
                    <div className="key right">→</div>
                  </div>
                  <span className="control-label">Move</span>
                </div>

                {/* SPRINT CONTROL */}
                <div className="control-group">
                  <div className="shift-key-wrapper">
                    <div className="key shift-key">Shift</div>
                  </div>
                  <span className="control-label">Sprint</span>
                </div>
              </div>

              <button className="credits-btn" onClick={() => setShowCredits(true)}>
                Credits
              </button>
            </div>
          )
        ) : (
          /* ---------- FINISH / RESTART ---------- */
          <div className="main-menu-content">
            <h1 className="title">You Finished Tiny Tumble 🎉</h1>
            <button className="play-btn" onClick={handleRestart}>
              Restart
            </button>
            <button className="credits-btn" onClick={() => setShowCredits(true)}>
              Credits
            </button>
          </div>
        )}
      </div>

      {/* ---------- KAYKIT LOGO BOTTOM RIGHT ---------- */}
      <img className="kaykit-logo-bottom" src="/ui/kaykit.png" alt="KayKit" />

      {/* ---------- CREDITS MODAL ---------- */}
      {showCredits && (
        <div className="modal-overlay" onClick={() => setShowCredits(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowCredits(false)}>
              ×
            </button>
            <h2 className="modal-title">Credits</h2>
            <div className="modal-body">
              <section>
                <h3>Development</h3>
                <p>Anuj</p>
              </section>

              <section>
                <h3>Music & Sound</h3>
                <ul>
                  <li>
                    Background Music by{" "}
                    <a
                      href="https://pixabay.com/users/lightyeartraxx-26697863/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Lightyeartraxx
                    </a>
                  </li>
                  <li>
                    Jump Sound by{" "}
                    <a
                      href="https://freesound.org/people/jalastram/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      jalastram
                    </a>
                  </li>
                  <li>
                    Click Sound by{" "}
                    <a
                      href="https://freesound.org/people/Jaszunio15/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Jaszunio15
                    </a>
                  </li>
                </ul>
              </section>

              <section>
                <h3>Assets</h3>
                <ul>
                  <li>
                    <a
                      href="https://kaylousberg.itch.io/kaykit-platformer"
                      target="_blank"
                      rel="noreferrer"
                    >
                      KayKit Game Assets
                    </a>
                  </li>
                  <li>
                    Cloud by Poly by Google [CC-BY] via{" "}
                    <a
                      href="https://poly.pizza/m/44cGXp6_8WD"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Poly Pizza
                    </a>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};