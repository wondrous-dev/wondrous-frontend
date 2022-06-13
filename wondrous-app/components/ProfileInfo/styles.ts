import { Box, Link, Typography } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import LinkIcon from 'components/Icons/linkIcon.svg';
import styled, { css } from 'styled-components';
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

const WhiteTypographyStyles = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-weight: 500;
    font-size: 16px;
    color: #ffffff;
  }
`;

export const ProfileInfoWrapper = styled(Box)`
  position: relative;
`;

export const ProfileInfoContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProfileInfoImage = css`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

export const ProfileInfoUserImage = styled(SafeImage)`
  ${ProfileInfoImage}
`;

export const ProfileInfoDefaultImage = styled(DefaultUserImage)`
  ${ProfileInfoImage}
`;

export const ProfileInfoFullName = styled(WhiteTypographyStyles)`
  && {
    font-size: 26px;
  }
`;

export const ProfileInfoUsername = styled(WhiteTypographyStyles)`
  && {
    font-size: 18;
    color: #c4c4c4;
  }
`;

export const ProfileInfoBioWrapper = styled(Box)`
  margin-top: 16px;
`;

export const ProfileInfoBioText = styled(WhiteTypographyStyles)`
  && {
    color: #c4c4c4;
    font-weight: 400;
    font-size: 15px;
  }
`;

export const ProfileLinkContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 16px;
  padding-bottom: 20px;
  border-bottom: 0.5px dashed #4b4b4b;
`;

export const ProfileInfoLink = styled(Link)`
  && {
    font-weight: 500;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ccbbff;
    text-decoration: underline;
    font-family: 'Space Grotesk';
    margin: 0;
  }
`;

export const ProfileInfoMainLink = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ProfileInfoLinkIcon = styled(LinkIcon)``;

export const ProfileInfoIcon = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 18px;
    height: 18px;
  }
`;

export default styles;
