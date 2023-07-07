import { Box } from "@mui/material";
import styled from "@mui/styled-engine-sc";

export const PricingListOptionWrapper = styled(Box)`
  && {
    display: flex;
    flex-wrap: wrap;
    gap: 46px;
    justify-content: center;
    z-index: 10;
    height: max-content;
    width: 100%;
    ${({ theme }) => theme.breakpoints.down("md")} {
      flex-direction: column;
      align-items: center;
    }
  }
`;

export const PricingOptionsListItemWrapper = styled(Box)`
  && {
    width: 323px;
    min-width: 0;
    border-radius: 16px;
    font-family: Poppins, sans-serif;
    background: #fff;
    position: relative;
    outline: 1px solid black;

    ${({ theme }) => theme.breakpoints.down("md")} {
      width: 500px;
    }

    ${({ theme }) => theme.breakpoints.between("md", "xl")} {
      width: 40%;
    }
  }
`;
