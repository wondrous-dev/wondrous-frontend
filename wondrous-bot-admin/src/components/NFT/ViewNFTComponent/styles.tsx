import { Box, Typography } from '@mui/material';
import styled from 'styled-components';


export const TextWrapper = styled(Box)`
  && {
    border-radius: 6px;
    background: ${({ bgcolor = "#e8e8e8" }) => bgcolor};
    display: flex;
    padding: ${({padding = "8px"}) => padding};
    justify-content: center;
    align-items: center;
  }
`;

export const DataLabel = styled(Typography)`
  && {
    color: #626262;
    font-family: Poppins;
    font-size: 13px;
    font-style: normal;
    font-weight: 600;
    line-height: 15px;
    min-width: 30%;
  }
`;
