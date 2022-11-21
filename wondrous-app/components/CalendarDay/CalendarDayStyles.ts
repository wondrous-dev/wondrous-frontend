const styles = {
  root: {
    px: 0.75,
    display: 'inline-block',
    fontFamily: var(--font-space-grotesk),
    fontWeight: 400,
    fontSize: ' 12px',
    lineHeight: '19px',

    letterSpacing: '0.01em',

    color: '#C4C4C4',
  },
  lowOpacity: {
    opacity: 0.5,
  },
  content: {
    width: 24,
    display: 'block',
    mt: '5px',
    borderRadius: 1,

    ':hover': {
      background: '#313131',
      color: 'white',
      fontWeight: '500',
    },
  },

  highlighted: { background: ' #7427FF', color: 'white', fontWeight: '500' },

  selected: { background: ' #472289', color: 'white', fontWeight: '500' },
};

export default styles;
