// Segment once so seeking and out-of-order renders produce identical text.
export function createPromptTyping({
  text,
  start = 0,
  typingSeconds = 2.5,
  holdSeconds = 2,
  cursorBlinkSeconds = 0.8,
  showCursor = true,
}) {
  if (typeof text !== 'string' ||
      ![start, typingSeconds, holdSeconds, cursorBlinkSeconds].every(Number.isFinite) ||
      typingSeconds < 0 || holdSeconds < 0 || cursorBlinkSeconds <= 0) {
    throw new RangeError('Use string text and finite nonnegative durations.');
  }
  const graphemes = Array.from(
    new Intl.Segmenter('zh-CN', {granularity: 'grapheme'}).segment(text),
    (part) => part.segment,
  );
  const end = start + typingSeconds + holdSeconds;
  return (time) => {
    if (!Number.isFinite(time)) throw new RangeError('Use a finite timeline time.');
    if (time < start || time >= end) return null;
    const elapsed = time - start;
    const complete = typingSeconds === 0 || elapsed >= typingSeconds || graphemes.length === 0;
    const count = complete ? graphemes.length : Math.floor(elapsed / typingSeconds * graphemes.length);
    return {
      text: graphemes.slice(0, count).join(''),
      count,
      complete,
      cursorVisible: Boolean(showCursor) && (!complete ||
        elapsed % cursorBlinkSeconds < cursorBlinkSeconds / 2),
      sendEnabled: complete && graphemes.length > 0,
    };
  };
}
