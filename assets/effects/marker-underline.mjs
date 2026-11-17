// Measure text after the chosen font loads, then pass its visible bounds.
export function getMarkerUnderline({
  time,
  start,
  end,
  box,
  color = '#63D69B',
  fillOpacity = 0.85,
  drawSeconds = 0.3,
  exitSeconds = 0.12,
  mode = 'draw',
}) {
  const numbers = [time, start, end, box.x, box.y, box.width, box.height,
    fillOpacity, drawSeconds, exitSeconds];
  if (!numbers.every(Number.isFinite) || end <= start || box.width <= 0 ||
      box.height <= 0 || fillOpacity < 0 || fillOpacity > 1 || drawSeconds < 0 ||
      exitSeconds < 0 || !['draw', 'fade'].includes(mode)) {
    throw new RangeError('Use a positive interval/box, valid alpha and draw or fade mode.');
  }
  if (time < start || time >= end) return null;
  const duration = end - start;
  const entrance = Math.min(drawSeconds, duration / 2);
  const exit = Math.min(exitSeconds, duration / 2);
  const progress = entrance === 0 ? 1 : Math.min(1, (time - start) / entrance);
  const reveal = 1 - Math.pow(1 - progress, 3);
  const fadeOut = exit === 0 ? 1 : Math.min(1, (end - time) / exit);
  return {
    x: box.x,
    y: box.y,
    width: box.width * (mode === 'draw' ? reveal : 1),
    height: box.height,
    rx: Math.min(box.height * 0.15, box.width / 2),
    fill: color,
    fillOpacity,
    opacity: (mode === 'fade' ? reveal : 1) * fadeOut,
  };
}
