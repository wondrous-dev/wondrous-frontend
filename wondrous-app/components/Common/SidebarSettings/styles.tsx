import { Box, Typography } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import styled from 'styled-components';
import palette from 'theme/palette';

export const SettingsChildrenWrapper = styled.div`
  padding: 100px 24px 0px 24px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export const SettingsDaoPodIndicator = styled(Box)`
  && {
    display: ${({ pod }) => (pod ? 'flex' : 'none')};
    background: ${({ theme }) => theme.palette.grey98};
    max-width: fit-content;
    align-items: center;
    padding: 8px;
    border-radius: 4px;
    > * {
      margin-left: 12px;
    }
    > :first-child {
      margin-left: 0;
    }
    margin-bottom: 32px;
  }
`;

export const SettingsDaoPodIndicatorOrgProfile = styled((props) => (
  <SafeImage
    useNextImage={false}
    style={{
      width: '24px',
      height: '24px',
    }}
    {...props}
  />
))``;

export const SettingsDaoPodIndicatorText = styled(Typography)`
  && {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 16px;
    font-weight: 400;
    color: ${({ theme }) => theme.palette.white};
  }
`;
export const ArchivedPodIndicatorText = styled(Typography)`
  && {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 16px;
    font-weight: 400;
    color: ${palette.red200};
  }
`;

export const SettingsDaoPodIndicatorIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ color, theme }) => color || theme.palette.background.default};
  width: 24px;
  height: 24px;
`;
