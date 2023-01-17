import styled from 'styled-components';
import palette from 'theme/palette';
import Typography from '@mui/material/Typography';

export const ModalDescriptionText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    letter-spacing: 0.0025em;
    color: ${palette.blue20};
  }
`;
