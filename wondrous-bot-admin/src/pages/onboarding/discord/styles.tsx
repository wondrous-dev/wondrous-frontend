import { Typography } from "@mui/material";
import { InputUnstyled } from "@mui/base";
import styled from "styled-components";

export const ConnectWonderbotText = styled(Typography)`
  && {
    color: #2a8d5c;
    font-size: 24px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 700;
    line-height: 34px;
    letter-spacing: -0.72px;
  }
`;

export const ConnectWonderbotDescription = styled(Typography)`
  && {
    color: #5e5e5e;
    font-size: 15px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.45px;
    margin-top: 14px;
    margin-bottom: 32px;
  }
`;

export const ConnectWonderbotImg = styled.img`
  text-align: center;
  margin-bottom: 32px;
`;

export const ChannelContainer = styled.div`
  border-radius: 8px;
  cursor: pointer;
  background: #f7f7f7;
  display: flex;
  padding: 8px;
  align-items: center;
  gap: 0px;
  align-self: stretch;
  margin-bottom: 8px;
  &:hover {
    background: #e8e8e8;
  }
`;

export const ChannelText = styled(Typography)`
  && {
    color: #000;
    font-size: 14px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    line-height: 14px;
    letter-spacing: 0.28px;
  }
`;

export const HashtagContainer = styled.div`
  background: white;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  margin-right: 12px;
`;

export const Hashtag = styled(Typography)`
  && {
    font-size: 18px;
    color: rgba(42, 141, 92, 1);
    font-family: Poppins;
    font-weight: bold;
  }
`;

export const NewChannelInput = styled(InputUnstyled)`
  && {
    width: 100%;
    .MuiInput-input {
      background: transparent;
      border: none;
      color: black;
      font-family: Poppins;
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      :focus-visible {
        outline: none;
      }
    }
  }
`;
