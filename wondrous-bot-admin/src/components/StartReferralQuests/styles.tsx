import { ButtonBase } from "@mui/material";
import { DisconnectButton } from "components/ConnectBotComponent/styles";
import styled from "styled-components";

export const SuccessInfoButton = styled(DisconnectButton)`
  && {
    border: 2px solid #7fbb9d;
    background: #fff;
    color: #0b9e77;
    pointer-events: none;
    padding: 8px 48px;
  }
`;
