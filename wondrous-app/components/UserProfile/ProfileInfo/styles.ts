import { Box, Chip, Link, Typography } from '@mui/material';
import { CyberConnect } from 'components/Icons/CyberConnects';
import LinkIcon from 'components/Icons/linkIcon.svg';
import styled, { css } from 'styled-components';

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

export const ProfileInfoFullName = styled(WhiteTypographyStyles)`
  && {
    font-size: 26px;
  }
`;

export const ProfileInfoUsername = styled(WhiteTypographyStyles)`
  && {
    font-size: 18px;
    color: #c4c4c4;
  }
`;

export const ProfilesCyberConnectIcon = styled(CyberConnect)`
  && {
    width: 18px;
    height: 18px;
    color: #00baff;
    margin-right: 12px;
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

export const ProfileInterestText = styled(WhiteTypographyStyles)`
  && {
    fontfamily: 'Space Grotesk';
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
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

export const ProfileInfoEarningsInterestWrapper = styled(Box)`
  border-bottom: 0.5px dashed #4b4b4b;
  padding: 24px 0;
`;

export const ProfileInfoInterestsContainer = styled(Box)`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    align-items: flex-start;
  }
`;

export const ProfileInfoInterestsChipWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
  flex-wrap: wrap;
  max-width: 80%;
`;

export const ProfileInfoInterestsChip = styled(Chip)`
  && {
    font-family: 'Space Grotesk';
    font-weight: 500;
    color: #ffffff;
    background: #232323;
    font-size: 12px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    border-radius: 4px;
  }
`;

const styles = {
  editInterest: {
    cursor: 'pointer',
  },
};
export default styles;
