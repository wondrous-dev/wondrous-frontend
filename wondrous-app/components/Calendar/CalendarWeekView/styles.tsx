import palette from 'theme/palette';

const styles = {
  wrapper: {
    borderRadius: '6px',
    border: `1px solid ${palette.grey101}`,
    backgroundColor: palette.grey900,
    marginTop: '14px',
    overflow: 'hidden',
  },
  column: {
    cursor: 'default',
    width: '100%',
    minHeight: '200px',
    '&.ColumnToday .ColumnHeader, &:hover .ColumnHeader': {
      backgroundColor: palette.grey85,
      transition: 'all 0.3s ease-in-out',
    },
    '&.ColumnToday .ColumnHeaderText, &:hover .ColumnHeaderText': {
      backgroundColor: palette.highlightPurple,
      borderRadius: '4px',
      padding: '0 4px',
      transition: 'all 0.3s ease-in-out',
    },
    '&.ColumnToday .ColumnBody, &:hover': {
      backgroundColor: palette.black87,
      transition: 'all 0.3s ease-in-out',
    },
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
    height: '100%',
  },
  taskRow: {
    '&:not(:first-child)': {
      marginTop: '22px',
    },
  },
  taskTitle: {
    color: palette.white,
    marginLeft: '6px',
    fontSize: '12px',
    fontWeight: 500,

    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
};

export default styles;
