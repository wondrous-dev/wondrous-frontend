import { ButtonBase, Drawer, List, ListItemButton, Typography } from '@mui/material';
import { Logo } from 'components/Common/ci';
import GridViewIcon from 'components/Common/Sidebar/Common/icons/gridView.svg';
import PodsIcon from 'components/Common/Sidebar/Common/icons/podsGradient.svg';
import SettingsIcon from 'components/Common/Sidebar/Common/icons/settings.svg';
import { mainSidebarWidth } from 'components/Common/Sidebar/Common/styles';
import { DAOIcon } from 'components/Icons/dao';
import styled, { css } from 'styled-components';
import palette from 'theme/palette';

const hideScrollbar = css`
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const DrawerComponent = styled(Drawer)`
  && {
    ${hideScrollbar}
    & .MuiDrawer-paperAnchorDockedLeft {
      background-color: ${palette.black97};
      height: 100vh;
      padding: 24px 0;
      z-index: 500;
      ${hideScrollbar}
    }
  }
`;

export const DrawerContainer = styled.div`
  width: ${mainSidebarWidth};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
`;

export const DrawerList = styled(List)`
  && {
    padding: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 12px;
  }
`;
export const DrawerListItem = styled(({ children, ...props }) => (
  <ListItemButton {...props}>
    <div>{children}</div>
  </ListItemButton>
))`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    border-radius: 50%;
    background: ${({ theme }) => theme.palette.grey87};
    filter: ${({ theme }) => `drop-shadow(0 3px 3px ${theme.palette.background.default})`};
    > div {
      height: 34px;
      width: 34px;
      display: flex;
      border-radius: 50%;
      align-items: center;
      justify-content: center;
    }
  }
`;

const DrawerListCreateDaoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DrawerBlockWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
`;

export const DrawerBottomButton = styled(({ children, ...props }) => (
  <ButtonBase {...props}>
    <div>{children}</div>
  </ButtonBase>
))`
  && {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: ${({ theme }) => theme.palette.black92};
    &.active {
      background: linear-gradient(283.63deg, rgba(75, 75, 75, 0.6) 11.03%, rgba(35, 35, 35, 0.6) 92.07%);
    }
    > * {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

export const NoLogoDAO = styled((props) => (
  <div {...props}>
    <DAOIcon
      stroke="#787878"
      encircled={false}
      style={{
        width: '36px',
        height: '36px',
      }}
    />
  </div>
))`
  display: flex;
  width: 36px;
  height: 36px;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  background: transparent;
`;

export const PodModalFooter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const PodModalFooterInfoWrapper = styled.div`
  background: ${({ theme }) =>
    `linear-gradient(0deg, ${theme.palette.grey250}, ${theme.palette.grey250}), ${theme.palette.background.default}`};
  border-radius: 4px;
  padding: 4px 8px;
  margin-right: 8px;
`;

export const PodModalFooterInfoWrapperText = styled(Typography)`
  && {
    color: ${palette.white};
    font-size: 13px;
  }
`;

export const StyledSettingsIcon = styled((props) => (
  <div {...props}>
    <SettingsIcon />
  </div>
))`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

export const ButtonIcon = styled(ButtonBase)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    background: transparent;
    border-radius: 50%;
    background: ${({ theme }) => theme.palette.grey87};
  }
`;

export const BottomButtonIcon = styled(ButtonBase)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    background: transparent;
    border-radius: 50%;
    background: ${({ theme }) => theme.palette.black92};
  }
`;

export const HighlightedButton = styled(({ children, ...props }) => (
  <ButtonBase {...props}>
    <div>{children}</div>
  </ButtonBase>
))`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    background: transparent;
    border-radius: 50%;
    background: ${({ theme }) =>
      `linear-gradient(206.66deg, ${theme.palette.blue20} -18.49%, ${theme.palette.highlightPurple} 109.85%, ${theme.palette.highlightBlue} 252.3%)`};
    > div {
      height: 34px;
      width: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;
      background: ${({ theme }) => theme.palette.grey87};
      :hover {
        ${({ theme }) =>
          `background: linear-gradient(180deg, ${theme.palette.grey78} 0%, ${theme.palette.grey87} 43.61%)`}
      }
    }
  }
`;

export const DrawerBackButton = styled(BottomButtonIcon)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
    transform: rotate(180deg);
  }
`;

export const LogoButton = styled(ButtonBase)`
  && {
    cursor: pointer;
  }
`;

export const HeaderLogo = styled(Logo)`
  width: 41px;
  height: 31px;
  path {
    fill: white;
  }
`;

export const ButtonWrapper = styled.div`
  background: ${({ theme }) => theme.palette.black92};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 6px;
  border-radius: 150px;
`;

export const MissionControlButton = styled((props) => (
  // NOTE: not yet in used, remove this comment when Mission Control page is implemented
  <ButtonBase {...props}>
    <div>
      <GridViewIcon />
    </div>
  </ButtonBase>
))`
  && {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${({ theme }) =>
      `linear-gradient(180deg, ${theme.palette.highlightPurple} 0%, ${theme.palette.orange90} 100%)`};
    display: flex;
    align-items: center;
    justify-content: center;
    div {
      background-color: ${({ theme }) => theme.palette.grey87};
      border-radius: inherit;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

export const PodsButton = styled((props) => (
  <ButtonBase {...props}>
    <div>
      <PodsIcon />
    </div>
  </ButtonBase>
))`
  && {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${({ theme }) =>
      `linear-gradient(180deg, ${theme.palette.highlightPurple} 0%, ${theme.palette.orange90} 100%)`};
    display: flex;
    align-items: center;
    justify-content: center;
    div {
      background-color: ${({ theme }) => theme.palette.grey87};
      border-radius: inherit;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;
