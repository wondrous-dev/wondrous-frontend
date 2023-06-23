import { Typography } from "@mui/material";
import styled from "styled-components";

export const FeedBackButtonContainer = styled.div`
  border-radius: 16px;
  border: 1px solid #000;
  background: #fff;
  display: flex;
  padding: 14px;
  align-items: center;
  gap: 8px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
`;

export const FeedbackImg = styled.img`
  width: 24px;
  height: 24px;
`;
export const FeedbackButtonText = styled(Typography)`
  && {
    font-family: Poppins;
    color: #000;
    text-align: center;
    font-size: 15px;
    font-family: Poppins;
    font-weight: 600;
    line-height: 15px;
    letter-spacing: -0.15px;
  }
`;

export const FeedbackButtonLink = styled.a`
  color: #000;
  text-decoration: none;
  font-family: Poppins;
`;
