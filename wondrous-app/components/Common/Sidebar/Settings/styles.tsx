import { Box, List, ListItem, Typography } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import styled from 'styled-components';
import palette from 'theme/palette';

export const SettingsChildrenWrapper = styled.div`
  padding: 0 24px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export const SettingsSidebarTabsSection = styled.div`
  height: 100%;
`;

export const SettingsSidebarTabsListContainer = styled(List)`
  && {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
  }
`;

export const SettingsSidebarTabsListItem = styled(ListItem)`
  && {
    width: 100%;
    height: 32px;
    padding: 1px;
    border-radius: 4px;
    background: transparent;
    background: ${({ active, theme }) =>
      active &&
      `linear-gradient(90.03deg, ${theme.palette.highlightBlue} 0.03%, ${theme.palette.highlightPurple} 98.82%)`};
    cursor: pointer;
    :hover {
      background: ${({ theme }) => theme.palette.grey87};
    }
  }
`;

export const ItemButtonInner = styled.div`
  border-radius: 3px;
  background: transparent;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px;
  padding-left: 0px;
  background: ${({ active, theme }) => active && theme.palette.grey87};
  ${SettingsSidebarTabsListItem}:hover & {
    background: ${({ theme }) => theme.palette.grey87};
  }
`;

export const SettingsSidebarTabsListItemIcon = styled.div`
  && {
    min-width: 0;
    width: 22px;
    height: 22px;
    background: ${({ theme }) => theme.palette.grey87};
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 12px;
      height: auto;
    }
  }
  & path {
    stroke: ${({ theme }) => theme.palette.white};
    stroke: ${({ active, theme }) => active && theme.palette.blue90};
  }
  ${SettingsSidebarTabsListItem}:hover & {
    path {
      stroke: ${({ theme }) => theme.palette.blue90};
    }
  }
`;

export const SettingsSidebarTabsListItemText = styled(Typography)`
  && {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    color: ${palette.white};
    text-decoration: none;
    font-size: 15px;
    font-weight: ${(props) => (props.active ? '600' : '400')};
  }
`;

export const SettingsContentBlock = styled.div`
  background-color: ${({ theme }) => theme.palette.background.default};
  height: 100%;
  overflow-y: auto;
  padding-left: 380px;
  padding-top: 140px;
  padding-right: 120px;
  width: 100%;
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
