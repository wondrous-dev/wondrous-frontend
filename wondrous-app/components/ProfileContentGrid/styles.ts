import { WHITE_TYPOGRAPHY_STYLES } from 'utils/constants';

const styles = {
  root: {},

  buttonContainer: {
    py: 1,
    borderTop: '0.5px dashed #4B4B4B',
    display: 'flex',
    justifyContent: 'center',
  },
  virtualizationContainer: {
    position: 'relative',
    height: 680,
  },
  button: {
    '&.MuiButtonBase-root': {
      ...WHITE_TYPOGRAPHY_STYLES,
      background: '#7427FF',
      p: 1,
      fontWeight: 600,
      textTransform: 'capitalize',

      '&.Mui-disabled': {
        opacity: 0.2,
        color: '#7a7a7a',
        background: '#3d3d3d',
      },
    },
  },
};

export default styles;
