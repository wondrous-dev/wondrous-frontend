import { Button, ButtonBase, Typography } from "@mui/material";
import styled from "styled-components";

export const SharedLabel = styled(Typography)`
  && {
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 24px;
    color: black;
  }
`;

export const StatusPill = styled(ButtonBase)`
  && {
    padding: 8px 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 35px;
    height: 40px;
    min-width: 40px;
    width: auto;
    color: #2a8d5c;
    font-family: "Poppins";
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    border: 1px solid #2a8d5c;
  }
`;

export const AddBotLink = styled(ButtonBase)`
  && {
    display: flex;
    height: 40px;
    width: 100%;
    padding: 6px 10px;
    justify-content: space-between;
    color: #000;
    font-family: Poppins;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 15px; /* 100% */
    align-items: center;
    gap: 14px;
    align-self: stretch;
    border-radius: 6px;
    background: #c1b6f6;
  }
`;