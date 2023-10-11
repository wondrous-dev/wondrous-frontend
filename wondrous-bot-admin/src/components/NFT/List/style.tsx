import { Grid } from "@mui/material";
import styled from "styled-components";

export const CardWrapper = styled(Grid)`
  && {
    display: flex;
    min-height: 94px;
    padding: 8px 24px 8px 8px;
    align-items: center;
    gap: 14px;
    width: 100%;
    flex: 1 0 0;
    border-radius: 16px;
    background: #f7f7f7;
    cursor: pointer;
  }
`;

export const NFTImage = styled.img`
  && {
    border-radius: 16px;
    position: relative;
    left: 0;
    height: 100%;
    max-width: 100%;
  }
`;
