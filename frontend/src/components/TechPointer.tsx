import React, { useEffect, useRef } from 'react';

const TRAIL_LENGTH = 12;
const TRAIL_DELAY = 0.18;

const TechPointer: React.FC = () => {
  const pointerRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const trail = useRef(Array(TRAIL_LENGTH).fill({ x: mouse.current.x, y: mouse.current.y }));

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    }
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useEffect(() => {
    function animate() {
      trail.current[0] = {
        x: trail.current[0].x + (mouse.current.x - trail.current[0].x) * TRAIL_DELAY,
        y: trail.current[0].y + (mouse.current.y - trail.current[0].y) * TRAIL_DELAY,
      };
      for (let i = 1; i < TRAIL_LENGTH; i++) {
        trail.current[i] = {
          x: trail.current[i].x + (trail.current[i - 1].x - trail.current[i].x) * TRAIL_DELAY,
          y: trail.current[i].y + (trail.current[i - 1].y - trail.current[i].y) * TRAIL_DELAY,
        };
      }
      if (pointerRef.current) {
        pointerRef.current.style.transform = `translate3d(${trail.current[0].x - 12}px,${trail.current[0].y - 12}px,0)`;
      }
      trailRefs.current.forEach((ref, i) => {
        if (ref) {
          ref.style.transform = `translate3d(${trail.current[i].x - 6}px,${trail.current[i].y - 6}px,0)`;
        }
      });
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  return (
    <>
      <div
        ref={pointerRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #38bdf8 80%, #0ea5e9 100%)',
          boxShadow: '0 0 24px 8px #38bdf8, 0 0 2px 1px #0ea5e9',
          pointerEvents: 'none',
          zIndex: 50,
          mixBlendMode: 'screen',
        }}
      />
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={i}
          ref={el => { trailRefs.current[i] = el; }}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #38bdf8 60%, #67e8f9 100%)',
            opacity: 0.25 + 0.5 * (1 - i / TRAIL_LENGTH),
            pointerEvents: 'none',
            zIndex: 49,
            mixBlendMode: 'screen',
            filter: 'blur(1.5px)',
          }}
        />
      ))}
    </>
  );
};

export default TechPointer;
