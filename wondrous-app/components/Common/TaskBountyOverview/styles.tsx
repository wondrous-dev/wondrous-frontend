import { LinearProgress, Typography } from '@mui/material';
import styled from 'styled-components';

export const TaskContentBountyWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
`;

export const TaskContentBountyCard = styled.div`
  background: #0f0f0f;
  flex-basis: 100%;
  border-radius: 6px;
  padding: 13px 10px;
`;

export const TaskContentHeader = styled(Typography)`
  && {
    font-family: var(--font-space-grotesk);
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    color: #c4c4c4;
    display: flex;
    justify-content: space-between;
  }
`;

export const TaskContentHeaderEntriesCount = styled.div``;
export const TaskContentHeaderPaidSubmissions = styled.div``;

export const TaskContentPaidOutWrapper = styled.div`
  position: relative;
  margin-top: 10px;
`;

export const TaskContentPaidOut = styled(LinearProgress)`
  && {
    border-radius: 6px;
    height: 28px;
    background: #1c1c1c;
  }
  .MuiLinearProgress-bar {
    background: #396cff;
    border-radius: inherit;
  }
`;

export const TaskContentPaidOutPercentage = styled(Typography)`
  && {
    position: absolute;
    font-family: var(--font-space-grotesk);
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    color: #4b4b4b;
    top: 0px;
    right: 10px;
    z-index: 1;
  }
`;
