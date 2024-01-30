import { Grid } from "@mui/material";
import { CommonTypography, DataTitle, TextWrapper } from "components/MembersAnalytics/styles";
import { ModalHeader, StyledModalComponent } from "components/Shared/Modal/styles";
import { ButtonIconWrapper, SharedSecondaryButton } from "components/Shared/styles";
import styled from "styled-components";

export const ModalWrapper = styled.div`
  ${StyledModalComponent} {
    ${ModalHeader} {
      background-color: red !important;
    }
  }
`;

export const BadgeWrapper = styled(Grid)`
  && {
    ${TextWrapper} {
      background-color: transparent;
      border: 1px solid #e8e8e8;
    }
    ${SharedSecondaryButton} {
      background-color: black;
      color: white;
      transition: all 0.1s ease-in-out;
      &:hover {
        background-color: transparent;
        color: black;
      }
    }
    ${CommonTypography} {
      color: #4d4d4d;
      font-size: 13px;
    }
    ${DataTitle} {
      font-weight: 500;
    }
    ${ButtonIconWrapper} {
      background-color: black;
      svg {
        path {
          stroke: white;
        }
      }
    }
  }
`;

export const StyledLink = styled.a`
  && {
    color: #000;

    text-align: center;
    font-family: Poppins;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 15px; /* 100% */
    letter-spacing: 0.15px;
    text-decoration-line: underline;
  }
`;
