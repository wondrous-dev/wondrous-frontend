import { Typography } from '@mui/material';
import styled from 'styled-components';

const GradientHeading = styled(Typography)`
  && {
    font-weight: bold;
    font-size: ${(props) => props.fontSize || 18}px;
    background: linear-gradient(89.67deg, #ccbbff 37.16%, #00baff 108.05%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    width: fit-content;
  }
`;

export default GradientHeading;
