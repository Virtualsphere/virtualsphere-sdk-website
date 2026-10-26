import { useEffect, useRef, useState } from 'react';

const mod = (n, m) => ((n % m) + m) % m;

/**
 * Looping vertical slideshow: the current item sits full-size in the middle
 * with half of the previous item peeking above and half of the next below.
 * The visitor moves it manually (mouse wheel, swipe, arrow keys, or clicking
 * a peeking item); it wraps around, so one item loops with itself.
 * Clicking the middle item calls `onSelect(index)`.
 *
 * `pos` is an unbounded virtual position, so slides keep stable keys and
 * glide between slots instead of jumping when the index wraps.
 */
export default function VerticalSlideshow({ items, renderItem, onSelect, className = '' }) {
  const [pos, setPos] = useState(0);
  const containerRef = useRef(null);
  const lockedRef = useRef(false);
  const touchYRef = useRef(null);

  function step(delta) {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setPos((p) => p + delta);
    setTimeout(() => {
      lockedRef.current = false;
    }, 450);
  }

  // React's onWheel is passive, so attach manually to stop the page scrolling.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    function onWheel(e) {
      e.preventDefault();
      if (Math.abs(e.deltaY) > 4) step(e.deltaY > 0 ? 1 : -1);
    }
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [items.length]);

  if (items.length === 0) return null;

  const slots = [];
  for (let offset = -2; offset <= 2; offset++) {
    const p = pos + offset;
    slots.push({ key: p, offset, item: items[mod(p, items.length)], index: mod(p, items.length) });
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`Image ${mod(pos, items.length) + 1} of ${items.length}`}
      className={`relative touch-none overflow-hidden outline-none select-none ${className}`}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          step(1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          step(-1);
        }
      }}
      onTouchStart={(e) => {
        touchYRef.current = e.touches[0].clientY;
      }}
      onTouchEnd={(e) => {
        if (touchYRef.current === null) return;
        const dy = touchYRef.current - e.changedTouches[0].clientY;
        touchYRef.current = null;
        if (Math.abs(dy) > 30) step(dy > 0 ? 1 : -1);
      }}
    >
      {slots.map(({ key, offset, item, index }) => (
        <div
          key={key}
          className={`absolute inset-x-0 top-1/2 transition-transform duration-400 ease-out ${
            offset === 0 && !onSelect ? '' : 'cursor-pointer'
          }`}
          // Slide height leaves room for exactly half a slide above and below, whatever the column height.
          style={{
            height: 'calc((100% - 24px) / 2)',
            transform: `translateY(calc(-50% + ${offset} * (100% + 12px)))`,
          }}
          aria-hidden={offset !== 0}
          onClick={() => (offset === 0 ? onSelect?.(index) : step(offset))}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
