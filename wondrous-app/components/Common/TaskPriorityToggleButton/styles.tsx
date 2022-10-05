import palette from 'theme/palette';

const styles = {
  grid: {
    padding: '4px',
    minHeight: '32px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.black97,
    borderRadius: '4px',
    width: '100%',
  },
  toggleButton: {
    width: '100%',
    minHeight: '24px',
    padding: '4px 8px',
    color: palette.grey57,
    backgroundColor: palette.grey99,
    fontSize: '14px',
    fontWeight: 500,
    border: `1px solid ${palette.grey99}`,

    '&&.MuiToggleButtonGroup-grouped': {
      border: '1px solid transparent',
      borderRadius: '4px',
      margin: 0,
    },
  },

  toggleButtonGroup: {
    maxHeight: '24px',
    gap: '2px',
    backgroundColor: palette.grey99,
    width: '100%',
  },
};

export default styles;
