import { Box } from "@mui/material";
import styled from "styled-components";
import { Label } from "components/CreateTemplate/styles";

export const IconWrapper = styled.div``;

export const ItemWrapper = styled(Box)`
  && {
    display: flex;
    align-items: center;
    gap: 8px;
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
      svg {
        rect {
          fill: #af9eff;
        }
      }
      background: #e3e3e3;
    }
  }
`;
