import { Box, ButtonBase, Grid, Typography } from "@mui/material";
import styled from "styled-components";

export const AssetPanelWrapper = styled(ButtonBase)`
  && {
    display: flex;
    width: 50%;
    height: 89px;
    padding: 20.418px 0px 20.415px 0px;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    background: linear-gradient(0deg, #e8e8e8 0%, #e8e8e8 100%), url(<path-to-image>), lightgray 50% / cover no-repeat;
    &:hover {
      cursor: pointer;
    }
  }
`;

export const Container = styled(Grid)`
  && {
    width: 100%;
    border-radius: 12px;
    background: #f9f9f9;
    display: flex;
    padding: 24px 0px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 14px;
    align-self: stretch;
  }
`;

export const AssetDisclaimer = styled(Typography)`
  && {
    color: #828282;
    text-align: center;
    font-family: Poppins;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 14px; /* 107.692% */
    letter-spacing: 0.26px;
  }
`;
