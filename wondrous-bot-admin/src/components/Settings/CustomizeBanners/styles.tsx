import { Box, Divider, Grid, Typography } from "@mui/material";
import styled from "styled-components";

export const CustomizeBannersContainer = styled((props) => <Grid container item {...props} />)`
  && {
    display: flex;
    flex: 1;
  }
`;

export const CommandsContainer = styled((props) => <Grid container item {...props} />)`
  && {
    justify-content: center;
    gap: 24px;
  }

  ${({ theme }) => theme.breakpoints.up("xl")} {
    && {
      justify-content: flex-start;
    }
  }
`;

export const CommandBannerContainer = styled(Grid)`
  && {
    background-color: white;
    color: #4d4d4d;
    border-radius: 16px;
    width: 100%;
  }

  ${({ theme }) => theme.breakpoints.up("sm")} {
    max-width: 448px;
  }
`;

export const HeaderContainer = styled(Grid)`
  && {
    border-bottom: 1px solid #e0e0e0;
    margin: 14px;
    margin-bottom: 0;
  }
`;

export const HeaderContainerTooltipContent = styled(Grid)`
  && {
    display: flex;
    gap: 8px;
    width: fit-content;
  }
`;

export const HeaderText = styled(Typography)`
  && {
    padding-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
  }
`;

export const CommandBannerUploadContainer = styled(Grid)`
  ${({ theme }) => theme.breakpoints.up("lg")} {
    display: flex;
  }
`;

export const BannerUploadContainer = styled(Grid)`
  && {
    padding: 14px;
    flex: 1;
  }
`;

export const BannerUploadHeader = styled(Typography)`
  && {
    font-size: 13px;
    font-weight: 600;
    padding-bottom: 12px;
  }
`;

export const BannerUploadImageContainer = styled(Grid)`
  && {
    height: 70px;
    width: 100%;
    border-radius: 6px;
    overflow: hidden;
  }

  && > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;

export const BannerUploadTextButtonContainer = styled(Grid)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-top: 12px;

  ${({ theme }) => theme.breakpoints.up("md")} {
    && {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

export const BannerUploadText = styled(Typography)`
  && {
    font-size: 11px;
    font-weight: 500;
    width: fit-content;
  }
`;

export const BannerUploadButtonContainer = styled(Grid)`
  width: fit-content;
  display: flex;
  gap: 8px;
`;

export const ButtonInputContainer = styled(Grid)`
  && {
    position: absolute;

    & > input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      opacity: 0;
    }
  }
`;

export const SectionDivider = styled(Divider)`
  ${({ theme }) => theme.breakpoints.up("md")} {
    display: none;
  }
`;

export const TopImageSectionContainer = styled(Grid)`
  && {
    padding: 14px;
    display: flex;
    flex-direction: column;
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    && {
      flex-direction: column;
    }
  }
`;

export const TopImageImageButtonContainer = styled(Grid)`
  display: flex;
  gap: 12px;

  ${({ theme }) => theme.breakpoints.up("md")} {
    && {
      flex-direction: column;
    }
  }
`;

export const TopImageContainer = styled(Grid)`
  && {
    height: 70px;
    width: 70px;
    border-radius: 1000px;
    overflow: hidden;
  }
  && > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;

export const TopImageTextButtonContainer = styled(Grid)`
  && {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

export const TopImageText = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 11px;
  }
`;

export const TopImageButtonContainer = styled(Grid)`
  display: flex;
  gap: 8px;
`;
