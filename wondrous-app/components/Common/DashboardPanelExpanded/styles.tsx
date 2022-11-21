import styled from 'styled-components';
import { Box, Typography } from '@mui/material';

export const StyledBorder = styled(Box)`
  background: linear-gradient(176.18deg, rgba(75, 75, 75, 0.6) 13.53%, rgba(35, 35, 35, 0.6) 63.82%);
  min-height: 178px;
  min-width: 500px;
  width: max-content;
  padding: 1px;
  border-radius: 6px;
`;

export const StyledBackground = styled(StyledBorder)`
  background: linear-gradient(180deg, #1e1e1e 10.26%, #141414 55.11%);
  height: 100%;
  padding: 15px;
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled(Typography)`
  && {
    font-family: var(--font-space-grotesk);
    font-size: 22px;
    font-weight: 600;
    color: #fff;
  }
`;

export const PanelViewButton = styled.div`
  display: flex;
  align-items: center;
`;

export const PanelViewButtonLabel = styled(Typography)`
  && {
    font-family: var(--font-space-grotesk);
    font-size: 14px;
    font-weight: 400;
    color: #828282;
  }
`;

export const DashboardPanelStatusCardWrapper = styled.div`
  display: flex;
  margin-top: 17px;

  div {
    margin-left: 14px;
  }

  div:first-child {
    margin-left: 0;
  }
`;

export const CircularProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 17px; ;
`;
