import { Grid, Typography } from "@mui/material";
import styled from "styled-components";
import { TextareaAutosize } from "@mui/base";

export const Panel = styled(Grid)`
  && {
    filter: ${({ filter = "drop-shadow(0px 4px 34px rgba(0, 0, 0, 0.24))" }) => filter};
    border-radius: 16px;
    background: #f7f7f7;
    width: 100%;
    transition: transform 0.2s ease;
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

export const PaymentMethodRowContainer = styled.div`
  background: #fff;
  padding: 14px;
  border-radius: 16px;
  border: 2px solid rgba(232, 232, 232, 1);
`;

export const PaymentMethodRowHeader = styled(Typography)`
  && {
    font-weight: 600;
    font-size: 15px;
    color: rgba(42, 141, 92, 1);
    font-family: "Poppins";
    margin-bottom: 8px;
  }
`;

export const PaymentMethodSecondRowHeader = styled(Typography)`
  && {
    font-weight: 600;
    font-size: 13px;
    color: #4d4d4d;
    font-family: "Poppins";
  }
`;

export const PaymentRowContentBox = styled.div`
  border-radius: 8px;
  border: 1px solid rgba(232, 232, 232, 1);
  padding: 8px;
  display: flex;
  align-items: center;
  margin-left: 8px;
`;

export const PaymentRowContentText = styled(PaymentMethodSecondRowHeader)`
  && {
    font-weight: normal;
    text-transform: capitalize;
    margin-left: -4px;
    color: black;
  }
`;

export const RewardHeaderText = styled(Typography)`
  && {
    font-family: Poppins;
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 15px;
    color: #626262;
    white-space: nowrap;
    min-width: 80px;
  }
`;

export const PoapImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 15px;
`;
