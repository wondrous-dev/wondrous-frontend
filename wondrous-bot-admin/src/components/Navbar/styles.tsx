import styled from "styled-components";

import AppBar from "@mui/material/AppBar";
import { HEADER_HEIGHT } from "utils/constants";
import { ButtonBase, Grid, Typography } from "@mui/material";

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
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;

    background: ${({ $isOpen }) => ($isOpen ? "white" : "#AF9EFF")};
    border-radius: 12px;
  }
`;

export const LinkButton = styled(ButtonBase)`
  && {
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
  width: 27px;
  height: 27px;
  border-radius: 50%;
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

export const ImageDefault = styled.img`
  transition: all 0.1s;
`;

export const HoveredImage = styled.img`
  opacity: 0;
  height: 0;
  width: 0;
`;
export const ImageContainer = styled.div`
  &:hover {
    ${ImageDefault} {
      opacity: 0;
      height: 0;
      width: 0;
    }
    ${HoveredImage} {
      opacity: 1;
      height: 100%;
      width: 100%;
    }
  }
`;

// fontFamily="Poppins"
// fontWeight={600}
// fontSize="14px"
// borderBottom={isActive ? `2px solid ${link.textColor}` : "2px solid transparent"}
// paddingBottom="2px"
// lineHeight="16px"
// color={isActive ? link.textColor : "#E8E8E8"}

export const NavbarLinkText = styled(Typography)`
  && {
    font-family: Poppins;
    font-weight: 600;
    font-size: 14px;
    padding-bottom: 2px;
    line-height: 16px;
    border-bottom: ${({ borderBottomColor = "transparent" }) => `2px solid ${borderBottomColor}`};
    color: ${({ color = "#e8e8e8" }) => color};
  }
`;

export const NavbarLinkWrapper = styled(Grid)`
  && {
    cursor: pointer;
    padding: 6px 8px;
    &:hover {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      ${NavbarLinkText} {
        border-color: ${({ color = "transparent" }) => color}; 
      }
    }
  }
`;
