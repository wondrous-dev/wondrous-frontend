import palette from 'theme/palette';

const styles = {
  grid: {
    height: '28px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.black97,
    borderRadius: '4px',
    width: '100%',
  },
  toggleButton: {
    width: '100%',
    minHeight: '28px',
    padding: '4px 8px',
    color: palette.grey57,
    backgroundColor: palette.background,
    fontSize: '14px',
    fontWeight: 400,
    border: `1px solid ${palette.grey99}`,

    '&&.MuiToggleButtonGroup-grouped': {
      border: '1px solid transparent',
      borderRadius: '4px',
      margin: 0,
      height: '28px',
    },
  },

  toggleButtonGroup: {
    maxHeight: '28px',
    gap: '2px',
    backgroundColor: palette.background.default,
    width: '100%',
  },
};

export default styles;
