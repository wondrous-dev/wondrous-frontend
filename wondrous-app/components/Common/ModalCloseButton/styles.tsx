import { Button } from '@mui/material';
import styled from 'styled-components';

export const StyledCloseButton = styled(Button)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0px;
    background: rgba(0, 0, 0, 1);
    border-radius: ${(props) => (props.circle ? '50%' : '6px')};
    padding: 10px 9px;
    max-height: 32px;
    max-width: 32px;
    :hover {
      background: rgba(0, 0, 0, 0.4);
    }
  }
`;
