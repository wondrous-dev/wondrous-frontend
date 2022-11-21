const styles = {
  borderContainer: {
    mx: 4,
    borderTop: '0.5px dashed #4B4B4B',
    py: 1.5,
    color: 'white',
    fontFamily: var(--font-space-grotesk),
    fontSize: ' 14px',
    fontWeight: 400,
    letterSpacing: '0.01em',
  },
  recurringButton: {
    '&.MuiButton-root': {
      padding: 1.25,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#7427FF',
      borderRadius: '6px',
      fontFamily: var(--font-space-grotesk),
      fontWeight: 500,
      fontSize: ' 14px',
      lineHeight: '16px',
      textTransform: 'Capitalize',
      color: '#FFF',
      ':hover': {
        background: '#313131',
        svg: {
          fill: '#06FFA5',
        },
      },
    },
  },
  clearButton: {
    '&.MuiButton-root': {
      padding: 1.25,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#313131',

      borderRadius: '6px',
      fontFamily: var(--font-space-grotesk),
      fontWeight: 500,
      fontSize: ' 14px',
      lineHeight: '16px',
      textTransform: 'Capitalize',
      color: '#FFF',
      ':hover': {
        background: '#454545',
      },
    },
  },
};

export const menuItemStyles = () => ({
  '&&': {
    display: 'block',
    padding: 8,
    fontFamily: var(--font-space-grotesk),
    fontSize: 16,
    color: 'white',

    '&:hover': {
      background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 100%)',
      borderRadius: 6,
    },
  },
});

export default styles;
