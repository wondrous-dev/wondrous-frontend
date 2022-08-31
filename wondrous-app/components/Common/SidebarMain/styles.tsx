import { ButtonBase, Drawer, List, ListItemButton, Typography } from '@mui/material';
import { Logo } from 'components/Common/ci';
import { mainSidebarWidth } from 'components/Common/SidebarStyles';
import { DAOIcon } from 'components/Icons/dao';
import SettingsIcon from 'components/Icons/Sidebar/settings.svg';
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
    `linear-gradient(0deg, ${theme.palette.black101}, ${theme.palette.black101}), ${theme.palette.background.default}`};
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

const ButtonIconBefore = css`
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-2px, -2px);
    height: 40px;
    width: 40px;
    background: #232323;
    outline: 2px solid #7427ff;
    border-radius: 50%;
    z-index: -1;
  }
`;

export const ButtonIcon = styled(ButtonBase)`
  && {
    align-items: center;
    background-color: #313131;
    border-radius: 50%;
    display: flex;
    height: 36px;
    justify-content: center;
    position: relative;
    width: 36px;
    z-index: 2;
    :hover {
      ${ButtonIconBefore}
    }
    ${({ isActive }) => isActive && ButtonIconBefore}
  }
`;

const AddIconActive = css`
  background: #4f00de;
  svg {
    defs {
      linearGradient {
        stop {
          stop-color: #ffffff;
        }
      }
    }
  }
`;

export const AddIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #313131;
  border-radius: 50%;
  ${ButtonIcon}:hover & {
    ${AddIconActive}
  }
  ${({ isActive }) => isActive && AddIconActive}
`;

export const DaoIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #313131;
  border-radius: 50%;
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

export const ExploreButton = styled(ButtonBase)`
  && {
    align-items: center;
    background-color: #313131;
    border-radius: 50%;
    display: flex;
    height: 36px;
    justify-content: center;
    position: relative;
    width: 36px;
    z-index: 2;
    :hover {
      ${ButtonIconBefore}
    }
    ${({ isActive }) => isActive && ButtonIconBefore}
  }
`;

const ExplorerIconActive = css`
  background: linear-gradient(206.66deg, #ccbbff -18.49%, #7427ff 109.85%, #00baff 252.3%);
  svg {
    defs {
      linearGradient {
        stop {
          stop-color: #ffffff;
        }
      }
    }
  }
`;

export const ExploreIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #313131;
  border-radius: 50%;
  ${ExploreButton}:hover & {
    ${ExplorerIconActive}
  }
  ${({ isActive }) => isActive && ExplorerIconActive}
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

const PodsButtonBeforeHover = css`
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-2px, -2px);
    height: 40px;
    width: 40px;
    outline: 2px solid #7427ff;
    border-radius: 50%;
    z-index: -1;
    background: transparent;
  }
`;

const PodsButtonBefore = css`
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-2px, -2px);
    height: 40px;
    width: 40px;
    border-radius: 50%;
    z-index: -1;
    background: linear-gradient(180deg, #00baff 0%, #f2c678 100%);
  }
`;

export const PodsIconWrapper = styled.div`
  align-items: center;
  border-radius: 50%;
  display: flex;
  height: 36px;
  justify-content: center;
  position: relative;
  width: 36px;
  z-index: 2;
  background: #313131;
`;

const PodIconHighlight = css`
  ${PodsIconWrapper} {
    background: linear-gradient(180deg, #00baff 0%, #f2c678 100%);
    svg {
      defs {
        linearGradient {
          stop {
            stop-color: #ffffff;
          }
        }
      }
    }
  }
`;

export const PodsButton = styled(ButtonBase)`
  && {
    align-items: center;
    border-radius: 50%;
    display: flex;
    height: 36px;
    justify-content: center;
    position: relative;
    width: 36px;
    z-index: 2;
    ${PodsButtonBefore}
    :hover {
      ${PodsButtonBeforeHover}
      ${PodIconHighlight}
    }
    ${({ isActive }) => isActive && PodsButtonBeforeHover}
    ${({ isActive }) => isActive && PodIconHighlight}
  }
`;

const MissionControlButtonBeforeHover = css`
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-2px, -2px);
    height: 40px;
    width: 40px;
    outline: 2px solid #7427ff;
    border-radius: 50%;
    z-index: -1;
    background: transparent;
  }
`;

const MissionControlButtonBefore = css`
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-2px, -2px);
    height: 40px;
    width: 40px;
    border-radius: 50%;
    z-index: -1;
    background: linear-gradient(180deg, #7427ff 0%, #f2c678 100%);
  }
`;

export const MissionControlIconWrapper = styled.div`
  align-items: center;
  border-radius: 50%;
  display: flex;
  height: 36px;
  justify-content: center;
  position: relative;
  width: 36px;
  z-index: 2;
  background: #313131;
`;

const MissionControlIconHighlight = css`
  ${MissionControlIconWrapper} {
    background: linear-gradient(180deg, #7427ff 0%, #f2c678 100%);
    svg {
      defs {
        linearGradient {
          stop {
            stop-color: #ffffff;
          }
        }
      }
    }
  }
`;

export const MissionControlButton = styled(ButtonBase)`
  && {
    align-items: center;
    border-radius: 50%;
    display: flex;
    height: 36px;
    justify-content: center;
    position: relative;
    width: 36px;
    z-index: 2;
    ${MissionControlButtonBefore}
    :hover {
      ${MissionControlButtonBeforeHover}
      ${MissionControlIconHighlight}
    }
    ${({ isActive }) => isActive && MissionControlButtonBeforeHover}
    ${({ isActive }) => isActive && MissionControlIconHighlight}
  }
`;
