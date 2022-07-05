import palette from './palette';

const typography = {
  button: {
    fontSize: '16px',
    lineHeight: '23px',
    letterSpacing: '0.75%',
    textTransform: 'none' as const, // https://github.com/mui/material-ui/issues/16307
  },
  // Maintenance pages
  h1: {
    fontFamily: 'Carmen Sans Bold',
    fontWeight: 700,
    fontSize: '52px',
    lineHeight: '60px',
    color: palette.white,
  },
  // Main page title
  h2: {
    fontWeight: 900,
    fontSize: '40px',
    lineHeight: '48px',
    color: palette.grey100,
  },
  h3: {
    fontWeight: 900,
    fontSize: '32px',
    lineHeight: '40px',
    color: palette.grey100,
  },
  // Subheading
  h4: {
    fontWeight: 900,
    fontSize: '24px',
    lineHeight: '32px',
    color: palette.grey100,
  },
  h5: {
    fontSize: '20px',
    lineHeight: '28px',
    color: palette.grey100,
    letterSpacing: '0.25%',
    paragraphSpacing: '16px',
  },
  subtitle1: {
    fontSize: '20px',
    lineHeight: '28px',
    letterSpacing: '0.15%',
    color: palette.grey100,
  },
  subtitle2: {
    fontSize: '18px',
    lineHeight: '26px',
    color: palette.grey100,
    letterSpacing: '0.75%',
  },
  body1: {
    fontSize: '16px',
    color: palette.grey100,
    letterSpacing: '0.5%',
  },
  body2: {
    fontSize: '14px',
    color: palette.grey100,
    letterSpacing: '0.25%',
  },
  fontFamily: 'Space Grotesk, sans-serif',
};

export default typography;
