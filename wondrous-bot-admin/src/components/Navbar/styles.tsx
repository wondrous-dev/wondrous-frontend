import styled from "styled-components";

import AppBar from "@mui/material/AppBar";
import { HEADER_HEIGHT } from "utils/constants";
import { ButtonBase } from "@mui/material";

export const HeaderBar = styled(AppBar)`
  && {
    padding: 10px 14px 10px 14px;
    background: ${({ theme }) => theme.palette.background.header};
    display: flex;
    height: ${HEADER_HEIGHT}px;
    z-index: 1000;
    top: 14px;
    width: calc(100% - 28px);
    right: 14px;
    border-radius: 16px;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    ${({ theme }) => theme.breakpoints.down("md")} {
      top: 0;
      right: 0;
      width: 100%;
      border-radius: 0;
    })
  }
`;

export const MenuIconWrapper = styled(ButtonBase)`
  && {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;

    background: white;
    border-radius: 12px;
  }
`;

export const LinkButton = styled(ButtonBase)`
  && {
    border: 2px solid #ffffff;
    width: 100%;
    background: ${({ bgColor }) => bgColor || "white"};
    border-radius: 12px;
    justify-content: space-between;
    align-items: center;
    padding: 14px 24px;
    display: flex;
    font-family: "Poppins";
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 32px;

    letter-spacing: 0.18em;
    text-transform: uppercase;

    color: #000000;
  }
`;

export const TutorialButton = styled.div`
  width: 34.5px;
  height: 34.5px;
  border-radius: 50%;
  margin-right: 16px;
  margin-left: -40px;
  border: 1.5px solid #baacfa;
  color: #baacfa;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
`;

export const TutorialLink = styled.a`
  text-decoration: none;
  outline: 0;
  color: #baacfa;
  font-weight: 500;
  font-size: 19px;
`;
