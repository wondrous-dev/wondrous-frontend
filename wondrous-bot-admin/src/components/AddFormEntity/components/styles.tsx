import { InputUnstyled } from '@mui/base';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components';

export const CustomTextField = styled(InputUnstyled)`
  width: 100%;
  && {
    .Mui-disabled {
      pointer-events: none;
    }
    .MuiInput-input {
      border-radius: ${({ borderRadius }) => borderRadius || "6px"};
      background: #e8e8e8;
      padding: ${({ padding = "14px" }) => padding};
      box-sizing: border-box;

      border: none;
      color: black;
      width: 100%;
      font-family: Poppins;
      font-size: 15px;
      font-style: normal;
      font-weight: 400;
      height: ${({ multiline }) => (multiline ? "110px" : "40px")};
      resize: none;
      width: 100%;
      :focus-visible {
        outline: 2px solid black;
      }
    }
  }
`;

export const Label = styled(Typography)`
  && {
    color: ${({color = '#4d4d4d'}) => color};
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 15px;
  }
`;

export const IndexContainer = styled(Box)`
  && {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    background: #f7f7f7;
    border-radius: 6px;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 24px;
    /* identical to box height, or 160% */

    letter-spacing: 0.0125em;

    color: #1d1d1d;
  }
`;
