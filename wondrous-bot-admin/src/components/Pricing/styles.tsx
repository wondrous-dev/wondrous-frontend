import { Box } from "@mui/material";
import styled from "@mui/styled-engine-sc";

export const PricingListOptionWrapper = styled(Box)`
  && {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    z-index: 10;
    height: max-content;
    width: 100%;
    gap: 14px;
    position: relative;
    ${({ theme }) => theme.breakpoints.down("md")} {
      flex-direction: column;
      align-items: center;
    }
  }
`;

export const PricingOptionsListItemInnerWrapper = styled(Box)`
  && {
    border-radius: 16px;
    outline-width: 1px;
    outline-style: solid;
    outline-color: ${({ colorScheme }) => colorScheme};
    background-color: #fff;
    height: 100%;
  }
`;

export const PricingOptionsListItemWrapper = styled(Box)`
  && {
    width: 323px;
    min-width: 0;
    border-radius: 16px;
    font-family: Poppins, sans-serif;
    background-color: #000;
    position: relative;

    ${({ theme }) => theme.breakpoints.down("md")} {
      width: 500px;
      height: fit-content;
    }

    ${({ theme }) => theme.breakpoints.between("md", "xl")} {
      width: 21%;
    }

    ${({ theme }) => theme.breakpoints.up("lg")} {
      height: 715px;
      :hover {
        cursor: pointer;
        box-sizing: content-box;
        ${PricingOptionsListItemInnerWrapper} {
          position: absolute;
          right: 0;
          left: 0;
          top: -16px;
          bottom: 0;
        }

        .cta-button {
          background: ${({ colorScheme }) => colorScheme};
        }
      }
    }
  }
`;
