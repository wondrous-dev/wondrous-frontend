import { List, Typography } from '@mui/material';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';
import AddIcon from 'components/Icons/add.svg';
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`;

export const SidebarWrapper = styled.div`
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
  ${ScrollBarStyles}
`;

export const ChildrenWrapper = styled.div`
  margin-left: ${({ minimized }) => (minimized ? '0px' : '280px')};
  width: 100%;
  padding-top: 94px;
  padding-bottom: 24px;
`;

export const Label = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    display: flex;
    color: #ccbbff;
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
  background: linear-gradient(270deg, #00baff -5.62%, #7427ff 45.92%, #ccbbff 103.12%);
  display: flex;
  height: 22px;
  justify-content: center;
  width: 22px;
  border-radius: 50px;
  > div {
    border-radius: 50px;
    align-items: center;
    background: #0f0f0f;
    display: flex;
    height: 21px;
    justify-content: center;
    width: 21px;
  }
`;
