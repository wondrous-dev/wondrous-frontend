import palette from 'theme/palette';

const styles = {
  wrapper: {
    borderRadius: '6px',
    border: `1px solid ${palette.grey101}`,
    backgroundColor: palette.grey900,
    marginTop: '14px',
    overflow: 'hidden',
  },
  columnHeader: {
    height: '34px',
    backgroundColor: palette.grey100,
    color: palette.white,
    fontWeight: 500,
    borderBottom: `1px solid ${palette.grey101}`,
    zIndex: 1,
  },
  columnBody: {
    padding: '10px 8px',
  },
  taskTitle: {
    color: palette.white,
    marginLeft: '6px',
    fontSize: '12px',
    fontWeight: 500,
  },
};

export default styles;
