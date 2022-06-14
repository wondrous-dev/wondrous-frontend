import { WHITE_TYPOGRAPHY_STYLES } from 'utils/constants';
import { PROFILE_CARD_WIDTH } from 'utils/constants';

const styles = {
  root: {
    background: '#1B1B1B',
    borderRadius: '3px',
    p: 1.5,
    mb: 2,
    width: PROFILE_CARD_WIDTH,
    mr: 2.25,
    ':last-child': {
      mr: 0,
    },
  },
  title: {
    ...WHITE_TYPOGRAPHY_STYLES,
    marginLeft: 8,
  },
  orgImageWrapper: {
    minWidth: 32,
    minHeight: 32,
    borderRadius: '5px',
  },
  orgImage: {
    width: 32,
    height: 32,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  borderContainer: {
    borderBottom: '0.5px dashed #4B4B4B',
    mb: 1,
  },
  description: {
    ...WHITE_TYPOGRAPHY_STYLES,
    color: '#c4c4c4',
    fontWeight: 400,
    lineHeight: '20px'
  },
  purpleText: {
    ...WHITE_TYPOGRAPHY_STYLES,
    color: '#ccbbff',
    fontSize: 13,
  },
  cardSection: {
    display: 'flex',
    alignItems: 'center',
    mb: 1,
  },
  privacyChip: {
    ...WHITE_TYPOGRAPHY_STYLES,
    background: '#7427FF',
    border: '1px solid #CCBBFF',
    borderRadius: '3px',
    ml: 1,
    p: 0.4,
  },
  whiteText: {
    ...WHITE_TYPOGRAPHY_STYLES,
    marginLeft: 8,
    fontSize: 13,
  },
};

export default styles;
