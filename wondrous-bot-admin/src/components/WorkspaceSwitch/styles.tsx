import { Box, ButtonBase, Grid, Typography } from "@mui/material";
import { Label } from "components/CreateTemplate/styles";
import { scrollbarStyles } from "components/Shared/styles";
import styled from "styled-components";

export const WorkspaceImageWrapper = styled(Box)`
  && {
    height: ${({ height = "2.2rem" }) => height};
    width: ${({ width = "2.2rem" }) => width};
    min-width: 28px;
    min-height: 28px;
    max-height: 2.2rem;
    max-width: 2.2rem;
    overflow: hidden;
    border-radius: ${({ borderRadius = "300px" }) => borderRadius};
    border: 1px solid #8d8d8d;
    display: flex;
    transition: 0s all;
    justify-content: center;
    align-items: center;
  }
`;

export const WorkspaceWrapper = styled(ButtonBase)`
  && {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    padding: 3px;
    border-radius: 8px;
    cursor: pointer;
    ${Label} {
      text-align: left;
    }
    .workspace-switch-profile-picture {
      border: 1px solid black;
      border-radius: 6px;
    }
    &:hover {
      ${WorkspaceImageWrapper} {
        border-color: black;
      }
      background: #e3e3e3;
    }
  }
`;

export const WorkspaceContainer = styled(Grid)`
  overflow-x: hidden;
  max-width: 300px;
  && {
    ${scrollbarStyles}
  }
`;

export const SidebarLabel = styled(Typography)`
  && {
    font-family: Poppins;
    color: ${({ color = "black" }) => color};
    font-size: 14px;
    font-weight: 500;
    line-height: 14x;
    opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
    transform: ${({ $isCollapsed }) => ($isCollapsed ? "translateX(-10px)" : "translateX(0)")};
    ${({ $isCollapsed }) =>
      $isCollapsed
        ? `
        opacity: 0;
        position: absolute;
        visiblity: hidden;
        transform: translateX(-10px);
      `
        : `
        opacity: 1;
        transition: all 0.2s ease;
        transform: translateX(0);
      `}
`;
