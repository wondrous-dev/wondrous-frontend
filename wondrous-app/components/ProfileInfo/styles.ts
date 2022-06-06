import { WHITE_TYPOGRAPHY_STYLES } from 'utils/constants';

const styles = {
  root: {
    position: 'relative',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 48,
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  linkIcon: {
    width: 24,
    mr: 1,
    mt: 1,
  },
  mainLink: {
    fontWeight: 500,
    fontWize: 16,
    lineHeight: '16px',
    display: 'flex',
    alignItems: 'center',
    color: '#ccbbff',
    textDecorationLine: 'underline',
    fontFamily: 'Space Grotesk',
    mr: 1.5,
  },
  socialIcon: {
    width: 20,
  },
  socialContainer: {
    display: 'flex',
    alignItems: 'center',
    pb: 2.5,
    borderBottom: '0.5px dashed #4B4B4B',
  },
  earningInterestsContainer: {
    borderBottom: '0.5px dashed #4B4B4B',
    py: 3,
  },
  interestsContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  interestChip: {
    ...WHITE_TYPOGRAPHY_STYLES,
    ml: 2,
    background: '#232323',

    fontWize: 15,
    lineHeight: '18px',
  },
  interestText: {
    ...WHITE_TYPOGRAPHY_STYLES,
  },
  fullName: {
    ...WHITE_TYPOGRAPHY_STYLES,
    fontSize: 26,
  },
  userName: {
    ...WHITE_TYPOGRAPHY_STYLES,
    fontSize: 18,
    color: '#c4c4c4',
  },
  bio: {
    ...WHITE_TYPOGRAPHY_STYLES,
    color: '#c4c4c4',
    fontWeight: 400,
  },
};

export default styles;
