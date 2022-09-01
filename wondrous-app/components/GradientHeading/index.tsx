import { Typography } from '@mui/material';
import styled from 'styled-components';

const GradientHeading = styled(Typography)`
  && {
    font-weight: bold;
    font-size: ${(props) => props.fontSize || 18}px;
    color: white;
    background: -webkit-linear-gradient(
      ${(props) => props.gradient || '180deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%'}
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

export default GradientHeading;
