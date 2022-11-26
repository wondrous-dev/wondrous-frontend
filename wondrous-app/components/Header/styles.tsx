import { AppBar, ButtonBase, IconButton, TextField } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';
import { Button } from '../Common/button';
import { Logo } from '../Common/ci';

export const HeaderBar = styled(AppBar)`
  && {
    margin-top: 18px;
    background: transparent;
    display: flex;
    align-items: center;
    z-index: 200;
    width: 100%;
    flex-direction: row;
    gap: 14px;
    justify-content: flex-end;
    box-shadow: none;
    padding: 0 30px;
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
    border: none;
    cursor: pointer;
    display: flex;
    height: 40px;
    justify-content: center;
    position: relative;
    width: 40px;
    filter: ${({ theme }) => `drop-shadow(0 3px 3px ${theme.palette.black101})`};
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
    justify-content: flex-end;
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
        background: linear-gradient(
          212.53deg,
          #ff6dd7 -79.63%,
          #b820ff -41.63%,
          #f93701 -9.97%,
          #ffd653 22.6%,
          #00baff 56.07%,
          #06ffa5 85.93%
        );
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
  color: ${palette.highlightBlue}
`;
