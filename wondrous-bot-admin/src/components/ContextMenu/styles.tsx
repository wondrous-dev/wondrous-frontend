import { ButtonBase, Grid } from "@mui/material";
import ScrollBarStyles from "components/Shared/ScrollBarStyles";
import styled from "styled-components";

export const ContextMenuItemsWrapper = styled(Grid)`
  && {
    overflow-x: hidden;
    overflow-y: auto;
    ${ScrollBarStyles}
  }
`;

export const ContextMenuButtonStyle = styled(ButtonBase)`
  && {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    gap: 6px;
    align-items: center;
    padding: 6px;
    border-radius: 6px;
    &:hover {
      background: #e4e4e4;
    }
  }
`;
