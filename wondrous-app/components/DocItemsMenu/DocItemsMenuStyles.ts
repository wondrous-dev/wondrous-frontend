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

export const menuStyles = () => ({
  '&&': {
    '& .MuiPaper-root': {
      background: '#474747',
      borderRadius: '5px',
    },
    '& .MuiList-root': {
      padding: 8,
    },
  },
});
