import styled from 'styled-components';
import palette from 'theme/palette';
import { HEADER_HEIGHT } from 'utils/constants';

export const MissionControlWrapper = styled.div`
  display: flex;
  height: 100%;
  min-height: 100vh;
  overflow: hidden;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
  }
`;

export const MissionControlWidgetsWrapper = styled.div`
  flex: 2.8;
  background: linear-gradient(180deg, #7427ff 12.22%, #292153 100%);
  mix-blend-mode: normal;
  box-shadow: 10px 4px 54px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(34px);
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
  padding: 14px;
  align-content: baseline;

  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: center;
  }
`;

export const MissionControlSidebarWrapper = styled.div`
  flex: 1;
  background-image: url(/images/mission-control/sidebar-bg.png);
  background-size: cover;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  z-index: 1;
  background-position: bottom;
`;

export const MissionControlWorkspaceCard = styled.div`
  border: 1px solid black;
  width: 49%;
  flex-grow: 1;
`;

export const MissionControlWidgetsContainer = styled.div`
  flex-basis: 100%;
  display: flex;
  gap: 14px;
  justify-content: flex-start;
  align-items: baseline;
  flex-wrap: wrap;
  flex: 1;

  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex-direction: column;
    align-items: center;
    max-width: 49%;
    width: 100%;
  }

  ${({ theme }) => theme.breakpoints.down('md')} {
    max-width: 60%;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    max-width: 100%;
  }
`;

export const MissionControlSidebarIconWrapper = styled.div`
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  bottom: 10%;
  position: absolute;
  width: 100%;
  z-index: 0;
  @-moz-keyframes spin {
    from {
      -moz-transform: rotate(0deg);
    }
    to {
      -moz-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    from {
      -webkit-transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  svg {
    height: auto;
    width: 20rem;
    animation-name: spin;
    animation-duration: 12000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    position: static;
  }
`;

export const FocusWrapper = styled.div`
  z-index: 1;
`;

export const ContributorGradient = `linear-gradient(180deg, ${palette.highlightPurple} 0%, #F2C678 100%)`;

export const OperatorGradient = `linear-gradient(180deg, ${palette.highlightBlue} 0%, #F2C678 100%)`;
