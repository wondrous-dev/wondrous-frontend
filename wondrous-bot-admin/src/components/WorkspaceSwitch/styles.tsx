import { Box, ButtonBase, Grid } from "@mui/material";
import { Label } from "components/CreateTemplate/styles";
import { scrollbarStyles } from "components/Shared/styles";
import styled from "styled-components";

export const WorkspaceImageWrapper = styled(Box)`
  && {
    height: 28px;
    width: 28px;
    min-width: 28px;
    min-height: 28px;
    overflow: hidden;
    border-radius: 6px;
    border: 1px solid transparent;
    display: flex;
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
