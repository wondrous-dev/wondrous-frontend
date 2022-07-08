const styles = {
  root: {
    display: 'flex',

    alignItems: 'center',
    mr: 1.25,
  },
  whiteText: {
    color: 'white',
    width: 'max-content',
    mr: 1,
  },
  role: {
    color: 'white',
    border: ({ palette }) => `1px solid ${palette.orange100}`,
    p: 0.25,
    lineHeight: '16px',
    fontWeight: 400,
    textTransform: 'capitalize',
  },
};

export default styles;
