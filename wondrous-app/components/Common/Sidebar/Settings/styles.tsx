import { Box, List, ListItem, Typography } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import styled from 'styled-components';
import palette from 'theme/palette';

export const SettingsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  background: #0f0f0f;
`;

export const SettingsSidebar = styled.div`
  background: #232323;
  flex-direction: column;
  gap: 28px;
  height: 100%;
  overflow-y: auto;
  padding: 24px;
  padding-top: 94px;
  position: fixed;
  width: 260px;
  display: flex;
  ${({ minimized }) => minimized && `left: -100%`};
`;

export const SettingsSidebarContainer = styled.div`
  height: 670px;
  width: 100%;
`;

export const SettingsSidebarHeader = styled.div`
  height: 44px;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const SettingsSidebarTabsSection = styled.div`
  height: 100%;
  padding-top: 50px;
`;

export const SettingsSidebarTabsSectionLabel = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: #ccbbff;
  }
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
    background: ${({ active }) => active && 'linear-gradient(90.03deg, #00baff 0.03%, #7427ff 98.82%)'};
    cursor: pointer;
    :hover {
      background: #313131;
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
  background: ${({ active }) => active && '#313131'};
  ${SettingsSidebarTabsListItem}:hover & {
    background: #313131;
  }
`;

export const SettingsSidebarTabsListItemIcon = styled.div`
  && {
    min-width: 0;
    width: 22px;
    height: 22px;
    background: #313131;
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
    stroke: #ffffff;
    stroke: ${(props) => props.active && '#30c7ff'};
  }
  ${SettingsSidebarTabsListItem}:hover & {
    path {
      stroke: #30c7ff;
    }
  }
`;

export const SettingsSidebarTabsListItemText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    color: ${palette.white};
    text-decoration: none;
    font-size: 15px;
    font-weight: ${(props) => (props.active ? '600' : '400')};
  }
`;

export const SettingsContentBlock = styled.div`
  background-color: #0f0f0f;
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
    background: #1c1c1c;
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
    font-family: 'Space Grotesk';
    font-size: 16px;
    font-weight: 400;
    color: #ffffff;
  }
`;
export const ArchivedPodIndicatorText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
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
  background: ${({ color }) => color || '#0f0f0f'};
  width: 24px;
  height: 24px;
`;
