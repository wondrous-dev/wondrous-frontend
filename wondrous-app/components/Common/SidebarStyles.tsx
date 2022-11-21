import { ButtonBase, List, Typography } from '@mui/material';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';
import AddIcon from 'components/Icons/add.svg';
import styled from 'styled-components';

export const mainSidebarWidth = '84px';

const entitySidebarWidth = '200px';

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`;

export const SidebarWrapper = styled.div`
  background: ${({ theme }) => theme.palette.black92};
  flex-direction: column;
  gap: 28px;
  height: 100%;
  overflow-y: auto;
  padding: 24px 14px;
  position: fixed;
  width: ${entitySidebarWidth};
  display: flex;
  z-index: 500;
  justify-content: space-between;
  ${({ minimized }) => minimized && `left: -100%`};
  ${ScrollBarStyles}
`;

export const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  flex-grow: 1;
`;

export const ChildrenWrapper = styled.div`
  margin-left: ${({ minimized }) => (minimized ? mainSidebarWidth : entitySidebarWidth)};
  width: 100%;
`;

export const Label = styled(Typography)`
  && {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    display: flex;
    color: ${({ theme }) => theme.palette.blue20};
  }
`;

export const ListWrapper = styled(List)`
  && {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

export const AddIconWrapper = styled((props) => (
  <div {...props}>
    <div>
      <AddIcon />
    </div>
  </div>
))`
  align-items: center;
  background: ${({ theme }) =>
    `linear-gradient(270deg, ${theme.palette.highlightBlue} -5.62%, ${theme.palette.highlightPurple} 45.92%, ${theme.palette.blue20} 103.12%)`};
  display: flex;
  height: 22px;
  justify-content: center;
  width: 22px;
  border-radius: 50px;
  > div {
    border-radius: 50px;
    align-items: center;
    background: ${({ theme }) => theme.palette.background.default};
    display: flex;
    height: 20px;
    justify-content: center;
    width: 20px;
  }
`;

export const toolTipStyle = {
  fontFamily: var(--font-space-grotesk),
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
