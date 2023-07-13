import { Box, ToggleButton } from "@mui/material";
import styled from "styled-components";

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
    ${({ theme }) => theme.breakpoints.down("sm")} {
      flex-direction: column;
      align-items: center;
    }
  }
`;

export const PricingOptionsListItemInnerWrapper = styled(Box)`
  && {
    border-radius: 16px;
    outline-width: 2px;
    outline-style: solid;
    outline-color: ${({ $colorScheme }) => $colorScheme};
    background-color: #fff;
    height: 100%;
    width: 100%;
    min-width: 0;
  }
`;

export const PricingOptionsListItemWrapper = styled(Box)`
  && {
    width: 23%;
    max-width: 300px;
    min-width: 0;
    border-radius: 16px;
    font-family: Poppins, sans-serif;
    background-color: #000;
    position: relative;
    height: ${({ $childHeight, $willExpire }) => ($willExpire ? $childHeight + 20 : $childHeight)}px;

    ${({ theme }) => theme.breakpoints.down("md")} {
      width: 45%;
    }

    ${({ theme }) => theme.breakpoints.down("sm")} {
      width: 85%;
    }

    ${({ theme }) => theme.breakpoints.up("md")} {
      :hover {
        height: ${({ $childHeight }) => $childHeight}px;
        outline: 2px solid black;
        cursor: pointer;
        ${PricingOptionsListItemInnerWrapper} {
          position: absolute;
          right: 0;
          left: 0;
          top: -20px;
          bottom: 0;
        }

        .cta-button {
          background: ${({ $colorScheme }) => $colorScheme};
        }
      }
    }
  }
`;

export const BillingIntervalToggleButton = styled((props) => (
  <ToggleButton disableRipple disableFocusRipple disableTouchRipple {...props} />
))`
  && {
    background: transparent;
    color: #d3d3d3;
    text-transform: capitalize;
    font-family: Poppins, sans-serif;
    margin: 2px;
    border-radius: 6px !important;
    height: 28px;
    line-height: 0;
    border: none;
    font-weight: 500;
    font-size: 14px;
    &:hover {
      background-color: #2a8d5c;
      color: #e9ff90;
    }
    &:focus {
      outline: 0 !important;
      border: none;
    }
    ${({ $selected }) =>
      $selected &&
      `
    background: #2a8d5c;
    color: #e9ff90;
    `}
  }
`;
