import styled from 'styled-components';
import { Typography } from '@mui/material';

export const ConfirmationModalBody = styled(Typography)`
  && {
    font-family: var(--font-space-grotesk);
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 24px;
    padding-left: 24px;
    padding-right: 24px;
    letter-spacing: 0.01em;

    color: #c4c4c4;
  }
`;

export const ConfirmationModalFooter = styled.div`
  padding-top: 24px;
  padding-bottom: 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: #141414;
  gap: 18px;
`;
