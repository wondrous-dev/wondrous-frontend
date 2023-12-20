import { ButtonBase } from "@mui/material";
import styled from "styled-components";
import { HEADER_HEIGHT } from "utils/constants";

export const HeaderBar = styled.header`
  padding: 14px;
  top: 0;
  height: calc(${HEADER_HEIGHT}px - 28px);
  z-index: 999999;
  position: sticky;
  justify-content: space-between;
  background-color: #fff;
  display: none;
  border-bottom: 1px solid #cdcdcd;
  ${({ theme }) => theme.breakpoints.down("md")} {
    width: calc(100% - 28px);
    display: flex;
  }
`;

export const MenuIconWrapper = styled(ButtonBase)`
  && {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;

    background: #af9eff;
    border-radius: 12px;
  }
`;
