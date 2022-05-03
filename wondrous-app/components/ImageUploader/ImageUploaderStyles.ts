export const inputStyles = ({ theme }) => ({
  display: 'none',
});

export const deleteButtonStyles = ({ theme }) => ({
  '&&': {
    backgroundColor: '#232323',
    border: '1px solid #232323',
    color: '#CB3340',
    '&:hover': {
      background: '#0F0F0F',
      border: '1px solid #CB3340',
    },
  },
});

export const uploadButtonStyles = ({ theme }) => ({
  '&&': {
    backgroundColor: '#232323',
    border: '1px solid #232323',
    color: '#00BAFF',
    '&:hover': {
      background: '#0F0F0F',
      border: '1px solid #00BAFF',
    },
  },
});

export const whiteTypographyStyles = ({ theme }) => ({
  '&&': {
    color: 'white',
  },
});

const styles = {
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#232323',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
    textAlign: 'center',
  },
  imageContainer: {
    borderRadius: '6px',
    overflow: 'hidden',
    marginRight: 2,
  },
};

export default styles;
