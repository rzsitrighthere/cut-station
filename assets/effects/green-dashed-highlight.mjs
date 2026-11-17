// Frame-driven SVG rectangle attributes. All time values are seconds.
// Geometry is in the same coordinate system as the highlighted content.
export const GREEN_DASHED_HIGHLIGHT = Object.freeze({
  stroke: "#2F443A",
  strokeOpacity: 1,
  strokeWidth: 2,
  dashLength: 8,
  dashGap: 6,
  cornerRadius: 8,
  fill: "#58BF88",
  fillOpacity: 0.12,
  enterSeconds: 0.32,
  exitSeconds: 0.12,
  dashSpeed: 0,
});

const clamp01 = (value) => Math.max(0, Math.min(1, value));

export function getGreenDashedHighlight({
  time,
  start,
  end,
  box,
  scale = 1,
  style = {},
}) {
  const values = [time, start, end, scale, box.x, box.y, box.width, box.height];
  if (!values.every(Number.isFinite) || end <= start || scale <= 0 ||
      box.width <= 0 || box.height <= 0) {
    throw new RangeError("Use finite times, a positive interval, scale and box size.");
  }

  const settings = {...GREEN_DASHED_HIGHLIGHT, ...style};
  const lengths = [settings.strokeWidth, settings.dashLength, settings.dashGap,
    settings.cornerRadius, settings.enterSeconds, settings.exitSeconds];
  if (!lengths.every((value) => Number.isFinite(value) && value >= 0) ||
      settings.dashLength <= 0 || !Number.isFinite(settings.dashSpeed) ||
      !Number.isFinite(settings.strokeOpacity) || settings.strokeOpacity < 0 ||
      settings.strokeOpacity > 1 ||
      !Number.isFinite(settings.fillOpacity) || settings.fillOpacity < 0 ||
      settings.fillOpacity > 1) {
    throw new RangeError("Use nonnegative lengths/timings and fillOpacity from 0 to 1.");
  }
  if (time < start || time >= end) return null;

  const elapsed = time - start;
  const duration = end - start;
  const entrance = Math.min(settings.enterSeconds, duration / 2);
  const exit = Math.min(settings.exitSeconds, duration / 2);
  const progress = entrance === 0 ? 1 : clamp01(elapsed / entrance);
  const growth = 1 - Math.pow(1 - progress, 3);
  const width = box.width * growth;
  const height = box.height * growth;
  const fadeIn = entrance === 0 ? 1 : clamp01(elapsed / Math.min(0.06, entrance));
  const fadeOut = exit === 0 ? 1 : clamp01((end - time) / exit);
  const dashPeriod = (settings.dashLength + settings.dashGap) * scale;

  return {
    x: box.x,
    y: box.y,
    width,
    height,
    rx: Math.min(settings.cornerRadius * scale, width / 2, height / 2),
    fill: settings.fill,
    fillOpacity: settings.fillOpacity,
    stroke: settings.stroke,
    strokeOpacity: settings.strokeOpacity,
    strokeWidth: settings.strokeWidth * scale,
    strokeDasharray: `${settings.dashLength * scale} ${settings.dashGap * scale}`,
    strokeDashoffset: -(elapsed * settings.dashSpeed * scale) % dashPeriod,
    strokeLinecap: "round",
    opacity: fadeIn * fadeOut,
  };
}
