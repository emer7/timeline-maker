import chroma from 'chroma-js';

const getLuminance = hex => {
  // https://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx
  const [red, green, blue] = chroma(hex).rgb(false);

  return Math.sqrt(red ** 2 * 0.241 + green ** 2 * 0.691 + blue ** 2 * 0.068);
};

export const getFontWhiteOrBlack = backgroundHex =>
  getLuminance(backgroundHex) < 130 ? 'white' : 'black';
