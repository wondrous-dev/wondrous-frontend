import { Grid, Typography } from "@mui/material";
import styled from "styled-components";
import { TextareaAutosize } from "@mui/base";

export const Panel = styled(Grid)`
  && {
    filter: drop-shadow(0px 4px 34px rgba(0, 0, 0, 0.24));
    border-radius: 16px;
    background: #f7f7f7;
    width: 100%;
  }
`;

export const CampaignOverviewTitle = styled(Typography)`
  && {
    font-family: "Poppins";
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 18px;
    color: #fee2ca;
  }
`;

export const Label = styled(Typography)`
  && {
    font-family: Poppins;
    font-style: normal;
    font-weight: ${({ fontWeight = 700 }) => fontWeight};
    font-size: 14px;
    line-height: 15px;
    min-width: 150px;
    letter-spacing: 0.01em;
    text-align: left;
    color: ${({ color = "#626262" }) => color};
  }
`;

export const TitleInput = styled(TextareaAutosize)`
  && {
    width: 100%;
    min-width: 600px;
    display: flex;
    height: 24px;
    justify-content: center;
    align-items: center;
    border: none;
    resize: none;
    font-family: Poppins;
    background: transparent;
    font-family: "Poppins";
    height: 24px;
    font-style: normal;
    width: 20rem;
    font-weight: 500;
    font-size: 28px;
    &:focus-visible {
      outline: none;
    }
    ${({ theme }) => theme.breakpoints.down("sm")} {
      min-width: 300px;
    }

    letter-spacing: -0.0375em;
    &:placeholder {
      color: #949494;
    }
    color: black;
  }
`;
