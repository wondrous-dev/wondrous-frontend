export const cancelStyles = () => ({
  '&&': {
    backgroundColor: '#232323',
    color: 'white',
    padding: '6px 24px',
    fontFamily: var(--font-space-grotesk),
  },
});

export const submitStyles = () => ({
  '&&': {
    background: 'linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%)',
    color: 'white',
    padding: '1px 1px',
    borderRadius: '64px',
    '& .MuiBox-root': {
      background: '#0f0f0f',
      fontFamily: var(--font-space-grotesk),
      fontSize: 15,
      fontStyle: 'normal',
      fontWeight: 500,
      padding: '6px 24px',
      borderRadius: '64px',
    },
  },
});

export const deleteStyles = () => ({
  '&&': {
    color: 'white',
    border: '1px solid #CB3340',
    padding: '6px 24px',
  },
});

const styles = {
  white: {
    color: 'white',
  },
  backgroundPaper: {
    background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 100%);',
  },
  titleIcon: {
    width: 50,
    height: 50,
    background: '#141414',
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 1.5,
  },
  highlightedText: {
    color: '#ccbbff',
    ml: 0.5,
    textTransform: 'capitalize',
  },
  dialogTitle: {
    py: 3,
    px: 0,
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    borderBottom: '1px solid #363636;',
    '&.MuiTypography-root': {
      mx: 3,
    },
  },
  closeButton: {
    cursor: 'pointer',
    height: 34,
    width: 34,
    borderRadius: 20,
    background: '#141414',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dialogActions: {
    py: 3,
    px: 0,
    mx: 3,
    borderTop: '1px solid #363636;',
  },
  separator: {
    borderTop: '1px solid #363636;',
    py: 4,
    mt: 4,
  },
};

export default styles;
