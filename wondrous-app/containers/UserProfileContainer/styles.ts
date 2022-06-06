import { HEADER_HEIGHT } from 'utils/constants';

const styles = {
  root: {
    width: '100vw',
    height: '100%',
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    transition: '0.15s all ease',
    pb: 5,
    pt: HEADER_HEIGHT,
  },
  headerImageWrapper: {
    width: '100%',
    height: 160,
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    p: 4,
    maxWidth: 1360,
    margin: '0 auto',
  },
};

export default styles;
