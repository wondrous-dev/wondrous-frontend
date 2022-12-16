import { AppBar, ButtonBase, IconButton, TextField } from '@mui/material';
import { mainSidebarWidth, entitySidebarWidth } from 'components/Common/SidebarStyles';
import styled from 'styled-components';
import palette from 'theme/palette';
import { HEADER_HEIGHT } from 'utils/constants';
import { Button } from '../Common/button';
import { Logo } from '../Common/ci';

export const HeaderBar = styled(AppBar)`
  && {
    padding: 10px 14px 10px 14px;
    background: transparent;
    display: flex;
    height: ${HEADER_HEIGHT};
    align-items: center;
    z-index: 200;
    width: 100%;
    flex-direction: row;
    gap: 14px;
    justify-content: flex-end;
    box-shadow: none;
    position: fixed;
    top: 0;
    background: ${palette.grey900};
    ${({ theme }) => theme.breakpoints.down('sm')} {
      position: sticky;
      width: 100%;
      margin-top: 0;
    }
  }
`;

export const HeaderContainer = styled.div`
  //max-width: 1388px;
  padding: 15px 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
`;

export const HeaderLeftBlock = styled.div`
  max-width: 440px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5%;
`;

export const HeaderLogoWrapper = styled.button`
  position: relative;
  display: flex;
  border: 0;
  background: transparent;
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: -1;
    background: none;
    filter: blur(20px);
    border-radius: 100%;
    left: 0;
    top: 0;
  }

  &:hover {
    cursor: pointer;
    &::before {
      background: linear-gradient(180deg, #ccbbff 0%, #7427ff 47.4%, #00baff 100%);
    }
  }
`;
export const HeaderLogo = styled(Logo)`
  width: 41px;
  height: 31px;
  path {
    fill: white;
  }
  :hover {
    cursor: pointer;
    #path-a {
      fill: url(#a);
    }
    #path-b {
      fill: url(#b);
    }
    #path-c {
      fill: url(#c);
    }
  }
`;

export const HeaderHomeButton = styled(IconButton)`
  && {
    background: #0f0f0f;
    border-radius: 4px;
    width: 40px;
    height: 40px;
    z-index: 100;

    &:hover {
      svg {
        path {
          stroke: url(#paint0_linear_11401_251635);
        }
      }
      background: #0f0f0f;
    }
  }
`;

export const HeaderHomeButtonWrapper = styled.div`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: -1;
    background: none;
    filter: blur(8px);
  }
  &:hover {
    &::before {
      background: linear-gradient(46.92deg, #b820ff 8.72%, #ffffff 115.55%);
    }
  }
`;

export const HeaderInput = styled(TextField)({
  '&.MuiTextField-root': {
    width: 310,
    maxWidth: '100%',
    height: 40,
    backgroundColor: '#0F0F0F',
    borderRadius: 6,
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
  },
  '& .MuiInputBase-input': {
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: '0.01em',
    color: '#C4C4C4',
  },
  '& .MuiInput-underline:after': {
    borderBottom: '2px solid violet',
  },
});

export const HeaderRightBlock = styled.div`
  max-width: 480px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const StyledBadge = styled(ButtonBase)`
  && {
    align-items: center;
    background: ${({ theme }) => theme.palette.grey87};
    border-radius: 50%;
    opacity: ${({ isActive }) => (typeof isActive === 'boolean' ? (isActive ? 1 : 0.5) : 1)};
    border: none;
    cursor: pointer;
    display: flex;
    z-index: 10;
    height: 40px;
    justify-content: center;
    position: relative;
    width: 40px;
    filter: ${({ theme }) => `drop-shadow(0 3px 3px ${theme.palette.black101})`};
    :hover {
      background: ${({ theme }) => theme.palette.grey78};
    }
    svg {
      circle {
        display: ${({ hasUnreadNotifications }) => (hasUnreadNotifications ? 'block' : 'none')};
      }
    }
  }
`;

export const HeaderCreateButton = styled(ButtonBase)`
  && {
    visibility: ${({ visibility }) => (visibility ? 'visible' : 'hidden')};
    display: flex;
    opacity: ${({ isActive }) => (isActive ? 1 : 0.5)};
    justify-content: flex-end;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      position: fixed;
      bottom: 2%;
      right: 2%;
    }
    background: transparent;
    border: 0;
    position: relative;
    filter: ${({ theme }) => `drop-shadow(0 3px 3px ${theme.palette.black101})`};
    &::before {
      content: '';
      position: absolute;
      height: 100%;
      width: 100%;
      z-index: -1;
      background: none;
      filter: blur(8px);
      border-radius: 100%;
      left: 0;
      top: 0;
    }

    &:hover {
      cursor: pointer;
      &::before {
        background: linear-gradient(270deg, #00baff -5.62%, #7427ff 45.92%, #ccbbff 103.12%);
      }
    }
  }
`;

export const TutorialButton = styled(Button)`
  && {
    min-height: 40px;
    margin-right: 16px;
    width: 160px;
  }
`;

export const TutorialText = styled.span`
  font-family: Space Grotesk;
`;

export const MissionControlIconWrapper = styled(HeaderHomeButton)`
  && {
    &:hover {
      svg {
        path {
          stroke: ${palette.white};
        }
      }
      background: ${palette.violet50};
    }
  }
`;

export const ConnectDiscordLink = styled.a`
  cursor: pointer;
  color: ${palette.highlightBlue};
`;

export const MenuContainer = styled.button`
  height: 40px;
  width: 40px;
  background: #2d2d2d;
  border-radius: 9px;
  border: none;
  display: flex;
  color: ${palette.blue20};
  align-items: center;
  justify-content: center;
  svg {
    font-size: 30px;
  }
`;

export const HeaderItemWrapper = styled.div`
  position: absolute;
  right: -14px;
  box-shadow: 0px 1px 11px 3px rgb(0 0 0 / 67%);
  top: -100%;
  height: fit-content;
  min-height: calc(100% + 28px);
  background: ${palette.black92};
  width: calc(100% + 28px);
  filter: drop-shadow(0px 4px 54px rgba(0, 0, 0, 0.35));
  border-radius: 0px 0px 0px 14px;
  padding: 24px 14px 14px 14px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100vw;
    border-radius: 0px 0px 14px 14px;
  }
`;
