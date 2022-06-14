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
    width: 32,
    height: 32,
    borderRadius: 32,
  },
  rowContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  description: {
    ...WHITE_TYPOGRAPHY_STYLES,
    color: '#c4c4c4',
    fontWeight: 400,
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
  roundedChip: {
    ...WHITE_TYPOGRAPHY_STYLES,
    ml: 1,
    background: '#363636',
    fontSize: 12,
    lineHeight: '12px',
    borderRadius: 32,
  },
  privacyChip: {
    ...WHITE_TYPOGRAPHY_STYLES,
    ml: 1,
    background: '#363636',
    fontSize: 12,
    lineHeight: '12px',
    borderRadius: 1,
  },

  rewardIcon: {
    height: 12,
    marginRight: 6,
  },
  alignIcon: {
    mt: 0.25,
  },
  whiteText: {
    ...WHITE_TYPOGRAPHY_STYLES,
    marginLeft: 8,
    fontSize: 13,
  },
  whiteTextAligned: {
    ...WHITE_TYPOGRAPHY_STYLES,
    ml: -0.5,
    fontSize: 13,
  },
};

export default styles;
