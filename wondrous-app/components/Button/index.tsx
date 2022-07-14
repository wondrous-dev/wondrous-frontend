import styled from 'styled-components';
import { Button as MuiButton } from 'components/Common/button';

export const Button = styled(MuiButton)`
  && {
    min-height: 40px;
    height: 40px;
    background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
    align-self: end;
  }

  // TODO: Add background for hover
  button {
    &:hover {
      background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
    }
    padding: 2px 30px;
    font-family: Space Grotesk;
    font-size: 16px;
    font-weight: 600;
  }
`;
