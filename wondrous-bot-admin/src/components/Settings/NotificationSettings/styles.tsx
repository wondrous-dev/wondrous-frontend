import { Typography } from "@mui/material";
import styled from "styled-components";

export const NotificationWrapper = styled.div`
  display: flex;
  background: white;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 16px;
  margin-bottom: 24px;
  width: 100%;
  max-width: 840px;
`;

export const NotificationHalves = styled.div`
  display flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
`;

export const NotificationTitle = styled(Typography)`
  && {
    color: #000;
    font-size: 14px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 600;
    line-height: 15px;
    letter-spacing: 0.14px;
  }
`;

export const NotificationDescription = styled(Typography)`
  && {
    color: #868686;
    font-size: 13px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    max-width: 640px;
    letter-spacing: 0.13px;
    margin-top: 8px;
  }
`;

export const NotificationSwitchContainer = styled.div`
  background: rgba(74, 74, 77, 1);
  padding: 1px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  height: 32px;
`;

export const NotificationSwitchInnerDiv = styled.div`
  border-radius: 8px;
  width: 50%;
  min-width: 38px;
  text-align: center;
  height: 32px;
  background: ${({ active }) => (active ? "rgba(42, 141, 92, 1)" : "rgba(74, 74, 77, 1)")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 100ms all;
`;

export const NotificationSwitchText = styled(Typography)`
  && {
    color: ${({ active }) => (active ? "#E9FF90" : "#D3D3D3")};
    font-size: 14px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.175px;
  }
`;

export const NotificationPostingToText = styled(Typography)`
  && {
    color: #828282;
    font-size: 13px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    line-height: 14px;
    letter-spacing: 0.26px;
    margin-right: 4px;
  }
`;

export const ChannelContainer = styled.div`
  border-radius: 4px;
  border: 1px solid #84bcff;
  background: rgba(132, 188, 255, 0.6);
  padding: 2px 4px;
`;
export const ChannelContainerText = styled(Typography)`
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

export const EditImg = styled.img`
  cursor: pointer;
`;

export const ModalTitleText = styled(Typography)`
  && {
    color: #4d4d4d;
    font-size: 14px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 600;
    line-height: 15px;
    letter-spacing: 0.14px;
    margin-bottom: 8px;
  }
`;

export const ModalDescriptionText = styled(Typography)`
  && {
    color: #828282;
    font-size: 13px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    line-height: 14px;
    letter-spacing: 0.26px;
    margin-bottom: 16px;
  }
`;

export const AddChannelText = styled(Typography)`
  && {
    Copy
    color: #000;
    text-align: center;
    font-size: 15px;
    font-family: Space Grotesk;
    font-style: normal;
    font-weight: 600;
    line-height: 15px;
    letter-spacing: -0.15px;
    margin-left: 8px
  }
`;
