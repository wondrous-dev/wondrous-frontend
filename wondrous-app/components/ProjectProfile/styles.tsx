import { Grid } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';

export const ProfileGrid = styled(Grid)`
  && {
    flex-wrap: nowrap;
    width: auto;
  }
`;

export const DndIconWrapper = styled(Grid)`
  && {
    display: none;
    &:hover {
      background: ${palette.black80};
      svg {
        circle {
          fill: ${palette.white};
        }
      }
    }
  }
`;

export const CardWrapper = styled(Grid)`
  && {
    ${DndIconWrapper} {
      ${({ isDragging }) =>
        isDragging
          ? `
        display: flex;
        background: ${palette.black80};
        svg {
          circle {
            fill: ${palette.white};
          }
        }
      
      `
          : ''};
    }
    &:hover {
      ${DndIconWrapper} {
        ${({ hasFullAccess }) => (hasFullAccess ? 'display: flex;' : '')})}
      }
    }
  }
`;
