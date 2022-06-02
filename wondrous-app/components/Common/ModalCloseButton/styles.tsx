import { Button } from '@mui/material';
import styled from 'styled-components';

export const StyledCloseButton = styled(Button)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0px;
    width: 34.9px;
    height: 34.9px;
    background: rgba(0, 0, 0, 1);

    :hover {
      background: rgba(0, 0, 0, 0.4);
    }
  }
`;
