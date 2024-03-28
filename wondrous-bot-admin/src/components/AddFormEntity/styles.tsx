import { ButtonBase, Grid } from "@mui/material";
import styled from "styled-components";

export const Header = styled(Grid)`
  && {
    background: #f7f7f7;
    padding: 14px;
    width: 100%;
    border-radius: 16px;
  }
`;

export const Button = styled(ButtonBase)`
  && {
    height: 40px;
    color: #000;
    padding: 12px;
    padding-right: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${({ bgcolor = "#C1B6F6" }) => bgcolor};
    gap: 14px;
    border-radius: 6px;
    text-transform: capitalize;

    &:hover {
      opacity: 0.8;
    }
  }
`;
