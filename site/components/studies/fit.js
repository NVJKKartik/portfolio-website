// Fits a W×H interface study into its stage. On a wide stage it shows the whole screen, scaled. On a
// narrow one (a phone) it shows a close-up instead: the panel the story is about at that moment, at a
// size you can read, gliding to the next panel as the story plays. `focusAt(t)` returns [x, y, w, h]
// in the study's own pixels.
export function fitter(fit, root, W, H, focusAt) {
  let t = 0,
    zoomed = true,
    last = '';
  function place(animate) {
    const b = fit.getBoundingClientRect();
    const [x, y, w, h] = zoomed && b.width < 640 ? focusAt(t) : [0, 0, W, H];
    const s = Math.min(1, b.width / w, b.height / h);
    const key = `${x},${y},${w},${h},${b.width},${b.height}`;
    if (key === last) return;
    last = key;
    const still = !animate || matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.style.transition = still ? 'none' : 'transform .6s cubic-bezier(.16,1,.3,1)';
    root.style.transform = `translate(${(b.width - w * s) / 2 - x * s}px,${(b.height - h * s) / 2 - y * s}px) scale(${s})`;
  }
  const ro = new ResizeObserver(() => place(false));
  ro.observe(fit);
  return {
    time(v) {
      t = v;
      place(true);
    },
    zoom(on) {
      zoomed = on;
      place(true);
    },
    disconnect() {
      ro.disconnect();
    },
  };
}
