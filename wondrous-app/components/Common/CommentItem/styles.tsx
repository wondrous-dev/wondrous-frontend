import Typography from '@mui/material/Typography';
import { keyframes } from '@mui/system';
import styled from 'styled-components';
import palette from 'theme/palette';

const highlightComment = keyframes`
  from {
      background: ${palette.grey250};
   }
    to {
      background: transparent;
    }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid ${palette.grey87};
  padding: 12px 0px;
  ${({ highlight }) =>
    highlight &&
    `
    animation-name: ${highlightComment};
    animation-duration: 2s;
    padding: 2px;
    border-radius: 4px
  `}
`;
