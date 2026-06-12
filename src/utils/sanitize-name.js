// Maps Unicode mathematical styled letters back to plain ASCII
// and strips decorative symbols (stars, sparkles, emoji, etc.)

const MATH_RANGES = [
  [0x1D400, 65], [0x1D41A, 97], // Math Bold A-Z / a-z
  [0x1D434, 65], [0x1D44E, 97], // Math Italic A-Z / a-z
  [0x1D468, 65], [0x1D482, 97], // Math Bold Italic A-Z / a-z
  [0x1D49C, 65], [0x1D4B6, 97], // Math Script A-Z / a-z
  [0x1D4D0, 65], [0x1D4EA, 97], // Math Bold Script A-Z / a-z
  [0x1D504, 65], [0x1D51E, 97], // Math Fraktur A-Z / a-z
  [0x1D538, 65], [0x1D552, 97], // Math Double-struck A-Z / a-z
  [0x1D56C, 65], [0x1D586, 97], // Math Bold Fraktur A-Z / a-z
  [0x1D5A0, 65], [0x1D5BA, 97], // Math Sans-serif A-Z / a-z
  [0x1D5D4, 65], [0x1D5EE, 97], // Math Sans-serif Bold A-Z / a-z
  [0x1D608, 65], [0x1D622, 97], // Math Sans-serif Italic A-Z / a-z
  [0x1D63C, 65], [0x1D656, 97], // Math Sans-serif Bold Italic A-Z / a-z
  [0x1D670, 65], [0x1D68A, 97], // Math Monospace A-Z / a-z
];

function convertMathChars(str) {
  return [...str].map(c => {
    const cp = c.codePointAt(0);
    for (const [base, ascii] of MATH_RANGES) {
      const offset = cp - base;
      if (offset >= 0 && offset < 26) return String.fromCharCode(ascii + offset);
    }
    return c;
  }).join('');
}

// Regex covering decorative Unicode blocks:
// Miscellaneous Symbols, Dingbats, Enclosed Alphanumerics, Supplemental Symbols,
// Emoji, Miscellaneous Symbols & Pictographs, etc.
const DECORATIVE_RE = /[☀-➿⬀-⯿\u{1F000}-\u{1FFFF}\u{E000}-\u{F8FF}]/gu;

export function sanitizeName(name) {
  if (!name || typeof name !== 'string') return name;
  return convertMathChars(name)
    .replace(DECORATIVE_RE, '')
    .replace(/\s+/g, ' ')
    .trim();
}
