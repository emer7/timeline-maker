import chroma from 'chroma-js';

const partialLuminance = value =>
  value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);

export const getRelativeLuminance = hex => {
  // https://www.w3.org/TR/WCAG20/#relativeluminancedef
  const [red, green, blue] = chroma(hex).rgb(false);

  return (
    0.2126 * partialLuminance(red / 255) +
    0.7152 * partialLuminance(green / 255) +
    0.0722 * partialLuminance(blue / 255)
  );
};

export const getFontWhiteOrBlack = backgroundHex =>
  // Contrast is identical at 4.583, for both white and black font
  // on background with relative luminance of 0.179
  getRelativeLuminance(backgroundHex) < 0.179 ? 'white' : 'black';
