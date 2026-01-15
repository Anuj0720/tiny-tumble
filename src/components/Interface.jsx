import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import "./interface.css";

export const Interface = ({
  started,
  gameFinished,
  onPlay,
  onRestart,
}) => {
  const { progress, active } = useProgress();

  const [displayProgress, setDisplayProgress] = useState(0);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const raf = useRef();

  /* ---------------- MINIMUM LOADER TIME ---------------- */
  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 800);
    return () => clearTimeout(t);
  }, []);

  /* ---------------- SMOOTH PROGRESS ---------------- */
  useEffect(() => {
    const animate = () => {
      setDisplayProgress((prev) => {
        const target = active ? Math.min(progress, 99) : 100;
        let next = prev + (target - prev) * 0.35;
        next = Math.min(next, prev + 6);
        if (!active && progress >= 100) return 100;
        return next;
      });

      raf.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf.current);
  }, [progress, active]);

  const loaded =
    progress >= 100 && minTimePassed && displayProgress >= 100;

  // 🔑 DERIVED STATE (NO EFFECT, NO WARNING)
  const shouldExit = isExiting && !gameFinished;

  // Hide UI during gameplay
  if (started && !gameFinished) return null;

  /* ---------------- HANDLERS ---------------- */
  const handlePlay = () => {
    setIsExiting(true);
    setTimeout(onPlay, 900);
  };

  const handleRestart = () => {
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
            <>
              <h1 className="title">Tiny Tumble</h1>

              <div className="loader">
                <svg width="120" height="120">
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <span className="percent">
                  {Math.floor(displayProgress)}%
                </span>
              </div>
            </>
          ) : (
            <button className="play-btn" onClick={handlePlay}>
              Play
            </button>
          )
        ) : (
          /* ---------- FINISH / RESTART ---------- */
          <>
            <h1 className="title">You Finished Tiny Tumble 🎉</h1>
            <button className="play-btn" onClick={handleRestart}>
              Restart
            </button>
          </>
        )}

        {/* ---------- CONTROLS + LOGO ---------- */}
        <div className="controls-row spaced">
          {/* MOVE CONTROLS */}
          <div className="controls-block">
            <div className="keys">
              <div className="key up">↑</div>
              <div className="key left">←</div>
              <div className="key down">↓</div>
              <div className="key right">→</div>
            </div>
            <span>Move</span>
          </div>

          {/* KAYKIT LOGO */}
          <div className="controls-block">
            <img
              className="kaykit-logo"
              src="/ui/kaykit.png"
              alt="Made with KayKit"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
