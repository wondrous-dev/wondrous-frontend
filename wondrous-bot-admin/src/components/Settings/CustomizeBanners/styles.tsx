import { Divider, Grid, Typography } from "@mui/material";
import styled from "styled-components";

export const CustomizeBannersContainer = styled(Grid)`
  && {
    max-width: 100%;
  }

  ${({ theme }) => theme.breakpoints.up("sm")} {
    && {
      max-width: 50%;
    }
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    && {
      max-width: 80%;
    }
  }
`;

export const CommandsContainer = styled((props) => <Grid container item {...props} />)`
  && {
    gap: 24px;
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
  ${({ theme }) => theme.breakpoints.up("md")} {
    display: flex;
    gap: 12px;
  }
`;

export const BannerUploadContainer = styled(Grid)`
  padding: 14px;
`;

export const BannerUploadHeader = styled(Typography)`
  && {
    font-size: 13px;
    font-weight: 600;
    padding-bottom: 12px;
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
