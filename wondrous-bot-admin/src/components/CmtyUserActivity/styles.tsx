import { Box, Grid } from "@mui/material";
import ScrollBarStyles from "components/Shared/ScrollBarStyles";
import styled from "styled-components";

export const Wrapper = styled(Grid)`
  && {
    padding: 24px 24px 42px 24px;
    display: flex;
    direction: column;
    align-items: flex-start;
    gap: 32px;
    background-color: #ffffff;
    height: 100%;
    width: 100%;
    min-height: 100vh;
    overflow: auto;
    ${ScrollBarStyles};
  }
`;

export const HeaderBar = styled(Box)`
  && {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #f6f6f6;
    width: 100%;
    width: 100%;
    overflow: hidden;
  }
`;

export const HeaderInfoImage = styled.img`
  height: auto;
  width: 20px;
  object-fit: cover;
`;

export const FooterBar = styled.footer`
  width: 100%;
  height: 100%;
  background-color: #f6f6f6;
  overflow: hidden;
`;
