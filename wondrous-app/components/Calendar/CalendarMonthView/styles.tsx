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
    '&.ColumnToday .ColumnHeader, &:hover .ColumnHeader': {
      backgroundColor: palette.grey85,
      transition: 'all 0.3s ease-in-out',
    },
    '&.ColumnToday .ColumnHeaderText, &:hover .ColumnHeaderText': {
      backgroundColor: palette.highlightPurple,
      color: palette.white,
      borderRadius: '4px',
      padding: '0 4px',
      transition: 'all 0.3s ease-in-out',
    },
    '&.ColumnToday .ColumnBody, &:hover .ColumnBody': {
      backgroundColor: palette.black87,
      transition: 'all 0.3s ease-in-out',
    },
  },
  columnHeader: {
    display: 'inline-flex',
    height: '30px',
    backgroundColor: palette.black92,
    color: palette.white,
    fontWeight: 500,
    borderTop: `1px solid ${palette.grey101}`,
  },
  columnBody: {
    padding: '10px 8px',
    height: '110px',
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
  moreButton: {
    justifyContent: 'unset',
    padding: 0,
    color: palette.highlightBlue,
    fontSize: '12px',
    lineHeight: '14px',
    '&:hover': { textDecoration: 'underline' },
  },
  weekDay: {
    color: palette.white,
    fontWeight: 500,
    height: '34px',
    backgroundColor: palette.grey100,
    cursor: 'default',
  },
  viewAllTasksModal: {
    taskRow: {
      height: '28px',
      padding: '0 4px',
      transition: 'all 0.3s ease-in-out',

      '&:hover': {
        backgroundColor: palette.grey85,
        borderRadius: '6px',
        cursor: 'pointer',
      },
    },
    taskTitle: {
      color: palette.white,
      marginLeft: '6px',
      fontSize: '12px',
      fontWeight: 500,
    },
  }
};

export default styles;
