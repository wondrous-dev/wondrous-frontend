import { Typography } from "@mui/material";
import styled from "styled-components";

export const BillingInfoContainer = styled.a`
  border-radius: 6px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  margin-top: 24px;
`;

export const BillingInfoHeader = styled.div`
  border-radius: 35px;
  border: 3px solid #2a8d5c;
  padding: 8px 24px;
`;

export const BillingInfoHeaderText = styled(Typography)`
  && {
    color: #000;
    text-align: center;
    font-family: Poppins;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%;
    letter-spacing: -0.15px;
  }
`;

export const BillingInfoUpdateText = styled(Typography)`
  && {
    color: #828282;
    text-align: center;
    font-family: Poppins;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 15px;
    letter-spacing: 0.26px;
    margin-top: 16px;
  }
`;

export const BillingInfoUpdateLink = styled.a`
  color: #828282;
  text-align: center;
  font-family: Poppins;
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: 15px;
  letter-spacing: 0.26px;
  text-decoration: none;
`;
