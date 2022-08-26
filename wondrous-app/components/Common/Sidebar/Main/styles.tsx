import { ButtonBase, Drawer, List, ListItemButton, Typography } from '@mui/material';
import AddIcon from 'components/Icons/add.svg';
import { DAOIcon } from 'components/Icons/dao';
import SettingsIcon from 'components/Icons/settings.svg';
import { PodsIcon } from 'components/Icons/sidebar';
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
      padding-top: 72px;

      z-index: 199;
      max-width: 500px;
      ${hideScrollbar}
    }
    &.active .MuiDrawer-paperAnchorDockedLeft {
      left: -100%;
    }
  }
`;

export const DrawerContainer = styled.div`
  width: 84px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding-top: 24px;
  padding-bottom: 72px;
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
    height: 40px;
    width: 40px;
    border-radius: 4px;
    background: transparent;
    background: ${({ isActive, theme }) =>
      isActive && `linear-gradient(180deg, ${theme.palette.grey850} 0%, ${theme.palette.grey74} 100%)`};
    :hover {
      background: ${({ theme }) =>
        `linear-gradient(180deg, ${theme.palette.grey850} 0%, ${theme.palette.grey74} 100%)`};
    }
    > div {
      height: 36px;
      width: 36px;
      display: flex;
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
  background: ${({ theme }) => theme.palette.black92};
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

export const HighlightedButton = styled(({ children, ...props }) => (
  <ButtonBase {...props}>
    <div>{children}</div>
  </ButtonBase>
))`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 40px;
    background: transparent;
    border-radius: 50%;
    :hover {
      ${({ theme }) =>
        `background: linear-gradient(206.66deg, ${theme.palette.blue20} -18.49%, ${theme.palette.highlightPurple} 109.85%, ${theme.palette.highlightBlue} 252.3%)`}
    }
    > div {
      height: 36px;
      width: 36px;
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

export const DrawerBackButton = styled(HighlightedButton)`
  && {
    position: fixed;
    bottom: 24px;
    left: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
    &.active {
      transform: rotate(180deg);
      opacity: 0.5;
      :hover {
        opacity: 1;
      }
    }
  }
`;
