const styles = {
  root: {
    transition: 'width .5s ease, min-width 0.5s ease',
    visibility: 'hidden',
    width: 0,
    minWidth: 0,
    opacity: 0,
    position: 'relative',
    backgroundColor: (theme) => theme.palette.grey900,
  },
  filterRoot: {
    position: 'sticky',
    top: 0,
  },
  showFilters: {
    p: 1.25,
    visibility: 'visible',
    width: 240,
    minWidth: 240,
    opacity: 1,
  },
  divider: {
    my: 2,
    border: (theme) => `1px dashed ${theme.palette.grey58}`,
  },
  sectionTitle: {
    fontWeight: 600,
    fontSize: 12,
    lineHeight: '15px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#CCBBFF',
  },
  switchLabel: {
    fontWeight: 400,
    fontSize: 12,
    lineHeight: '15px',
    color: 'white',
  },
  categoryContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1,
    mt: 1.5,
  },
  categoryTag: {
    backgroundColor: (theme) => theme.palette.grey75,
    py: 0.5,
    px: 1,
    borderRadius: 1,
    cursor: 'pointer',
    ':hover': {
      opacity: 0.8,
    },
  },
  labelCategory: {
    fontWeight: 500,
    fontSize: 15,
    lineHeight: '18px',
    color: 'white',
  },
  activeTag: {
    backgroundColor: (theme) => theme.palette.purple800,
  },

  searchTextfield: {
    backgroundColor: (theme) => theme.palette.background.default,
    borderRadius: '4px',

    '& .MuiInputBase-input': {
      color: 'white',
      padding: 1.25,
      borderRadius: '4px',
      fontSize: 14,
    },
    '& .MuiOutlinedInput-root': {
      border: 'none',

      '&.Mui-focused fieldset': {
        border: 'none',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 0,
    },
  },
  closeButton: {
    backgroundColor: (theme) => theme.palette.black101,
    my: 2,
    borderRadius: 1.5,
    p: 1.5,
  },
  closeText: {
    color: 'white',
    ml: 1,
  },
};

export default styles;
