import { Box } from '@material-ui/core';
import styled from 'styled-components';

export const StyledDropShadow = styled(Box)`
  background: linear-gradient(180deg, #0f0f0f 70.83%, rgba(15, 15, 15, 0) 100%);
  height: 220px;
  position: fixed;
  z-index: 20;
  width: 100%;
  margin-top: -30px;
`;

export const StyledBorder = styled(Box)`
  background: linear-gradient(176.18deg, rgba(75, 75, 75, 0.6) 13.53%, rgba(35, 35, 35, 0.6) 63.82%);
  padding: 1px;
  border-radius: 6px;
  width: max-content;
  margin: 44px auto;
`;

export const StyledBackground = styled(Box)`
  background: linear-gradient(180deg, #1e1e1e 10.26%, #141414 55.11%);
  width: 100%;
  height: 100%;
  border-radius: inherit;
  padding: 14px;
`;

export const DashboardPanelStatusCardWrapper = styled.div`
  display: flex;

  div {
    margin-left: 15px;
  }

  div:first-child {
    margin-left: 0;
  }
`;
