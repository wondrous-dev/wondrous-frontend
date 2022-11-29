import { Box, Typography } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import styled from 'styled-components';

export const WhiteTypographyStyles = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-weight: 500;
    font-size: 16px;
    color: #ffffff;
  }
`;

export const OrgCardWrapper = styled(Box)`
  background: #1b1b1b;
  padding: 18px;
  border-radius: 3px;
  width: 310px;
  cursor: pointer;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
    border: 1px solid #3a3a3a;
  }
`;

export const OrgCardBorderContainer = styled(Box)`
  border-bottom: 0.5px dashed #4b4b4b;
`;

export const OrgCardTitleContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const OrgCardImageWrapper = styled(Box)`
  min-width: 32px;
  min-height: 32px;
  border-radius: 5px;
`;

export const OrgCardTitle = styled(WhiteTypographyStyles)``;

export const OrgCardDescription = styled(WhiteTypographyStyles)`
  && {
    color: #c4c4c4;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    padding: 20px 0 14px 0;
  }
`;

export const OrgCardInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

export const OrgCardSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 11px;
`;

export const OrgCardSectionPurpleText = styled(WhiteTypographyStyles)`
  && {
    color: #ccbbff;
    font-size: 13px;
  }
`;

export const OrgCardSectionChip = styled(WhiteTypographyStyles)`
  && {
    background: #7427ff;
    border: 1px solid #ccbbff;
    border-radius: 3px;
    font-size: 13px;
    padding: 0 3px;
  }
`;

export const OrgCardSectionWhiteText = styled(WhiteTypographyStyles)`
  && {
    font-size: 13px;
  }
`;
