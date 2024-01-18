import { Typography } from "@mui/material";
import { SharedSecondaryButton } from "components/Shared/styles";
import styled from "styled-components";

export const ModalLabel = styled(Typography)`
  && {
    color: black;
    text-align: center;
    font-family: Poppins;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
  }
`;

export const ModalTextBody = styled(Typography)`
  && {
    color: #4d4d4d;
    text-align: center;
    font-family: Poppins;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
  }
`;

export const SkipButton = styled(SharedSecondaryButton)`
  && {
    color: #949494;
    border: 1px solid #949494;
    min-width: 170px;
    background: transparent;
  }
`;
