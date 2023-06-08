import { Grid } from "@mui/material";
import styled from "styled-components";
export const MainWrapper = styled(Grid)`
  && {
    width: 100%;
    min-height: 100vh;
    height: 100%;
    background: url("/images/wonder-bg.png") no-repeat center center;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    padding: 0 20px;

    @media (min-width: 641px) {
      padding: 0;
    }
  }
`;
