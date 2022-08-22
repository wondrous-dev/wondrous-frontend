import { Typography } from '@mui/material';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';
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
`;

export const Label = styled(Typography)`
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  display: flex;
  color: #ccbbff;
`;
