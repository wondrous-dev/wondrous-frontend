// http://24ways.org/2010/calculating-color-contrast
export const getContrastYIQ = (hexcolor) => {
  const color = hexcolor.replace('#', '');
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? 'black' : 'white';
};
