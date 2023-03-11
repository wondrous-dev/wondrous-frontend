import { ButtonBase, List, Typography } from '@mui/material';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';
import styled from 'styled-components';

export const mainSidebarWidth = '84px';

export const entitySidebarWidth = '220px';

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`;

export const SidebarWrapper = styled.div`
  background: ${({ theme }) => theme.palette.black92};
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  position: fixed;
  top: 0px;
  padding-top: 70px;
  z-index: 100;
  width: ${({ minimized }) => (minimized ? mainSidebarWidth : entitySidebarWidth)};
  display: flex;
  transition: width 0.2s;
  justify-content: space-between;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: ${({ minimized }) => (minimized ? '0px' : '100%')};
  }
  ${ScrollBarStyles};
`;

export const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const ChildrenWrapper = styled.div`
  padding-left: ${({ minimized }) => (minimized ? mainSidebarWidth : entitySidebarWidth)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-left: ${({ minimized }) => (minimized ? '0px' : 'auto')};
  }
  width: 100%;
`;

export const Label = styled(Typography)`
  && {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    display: flex;
    padding: 0px 14px 0px 18px;
    color: ${({ theme }) => theme.palette.grey57};
    ${({ minimized }) => (minimized ? 'visibility: hidden' : '')}}
  }
`;

export const ListWrapper = styled(List)`
  && {
    display: flex;
    flex-direction: column;
    gap: 8px;
    ${({ minimized }) =>
      minimized &&
      ` 
      justify-content: center;
      align-items: center;
    `})}
  }
`;

export const toolTipStyle = {
  fontFamily: 'Space Grotesk',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: '12px',
  lineHeight: '20px',
  letterSpacing: '0.01em',
  color: '#C4C4C4',
};

export const GreyButton = styled(ButtonBase)`
  && {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px 6px;
    width: 79px;
    height: 36px;
    background: ${({ theme }) => theme.palette.grey87};
    border-radius: 216px;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.palette.white};
    :hover {
      background: ${({ theme }) => theme.palette.grey58};
      filter: drop-shadow(0px 6px 14px rgba(0, 0, 0, 0.5));
    }
  }
`;
