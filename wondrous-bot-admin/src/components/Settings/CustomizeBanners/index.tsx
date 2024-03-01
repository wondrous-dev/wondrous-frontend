import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import DeleteIcon from "components/Icons/Delete";
import ImageUpload from "components/ImageUpload";
import { AVATAR_EDITOR_TYPES } from "components/ImageUpload/AvatarEditor";
import { useState } from "react";
import { ButtonIconWrapper } from "components/Shared/styles";
import ReplaceIcon from "components/Icons/ReplaceIcon";
import {
  CommandBannerContainer,
  HeaderText,
  HeaderContainer,
  BannerUploadText,
  BannerUploadButtonContainer,
  BannerUploadTextButtonContainer,
  TopImageTextButtonContainer,
  TopImageText,
  CommandBannerUploadContainer,
  TopImageSectionContainer,
  TopImageImageButtonContainer,
  TopImageButtonContainer,
  SectionDivider,
  CustomizeBannersContainer,
  BannerUploadHeader,
  BannerUploadContainer,
  CommandsContainer,
  HeaderContainerTooltipContent,
  HeaderInfoIconContainer,
} from "./styles";
import { StyledInformationTooltip } from "components/Shared/Tooltip";
import InformationTooltip from "components/Icons/information.svg";

const commandBanners = [
  {
    title: "Quests",
    tooltip: "Quests are a series of tasks that users can complete to earn rewards.",
  },

  {
    title: "My Submissions",
    tooltip: "View all of your submissions and their statuses.",
  },
  {
    title: "My Level",
    tooltip: "View your current level and experience points.",
  },
  {
    title: "LeaderBoard",
    tooltip: "View the top users and their levels.",
  },
  {
    title: "Store",
    tooltip: "Purchase items with your experience points.",
  },
  {
    title: "My Purchases",
    tooltip: "View all of your purchases.",
  },
  {
    title: "Onboard Me",
    tooltip: "Complete the onboarding process.",
  },
];

const CommandBanner = ({ banner }) => {
  const { title, tooltip } = banner;
  const [data, setData] = useState({ profilePicture: null });
  const handleChange = (value) => setData({ profilePicture: value });
  const handleRemoveFile = () => handleChange(null);
  const handleReplaceImage = () => handleChange(null);

  return (
    <CommandBannerContainer>
      <HeaderContainer>
        <StyledInformationTooltip placement="right" title={tooltip}>
          <HeaderContainerTooltipContent>
            <HeaderText>/{title}</HeaderText>
            <Box>
              <img src={InformationTooltip} alt="information" />
            </Box>
          </HeaderContainerTooltipContent>
        </StyledInformationTooltip>
      </HeaderContainer>
      <CommandBannerUploadContainer>
        <BannerUploadContainer>
          <BannerUploadHeader>Banner</BannerUploadHeader>
          <img src="https://placekitten.com/310/74" alt="banner" />
          <BannerUploadTextButtonContainer>
            <BannerUploadText>Optimal size: 640 x 140px</BannerUploadText>
            <BannerUploadButtonContainer>
              <ButtonIconWrapper onClick={handleReplaceImage}>
                <ReplaceIcon />
              </ButtonIconWrapper>
              <ButtonIconWrapper onClick={handleRemoveFile}>
                <DeleteIcon />
              </ButtonIconWrapper>
            </BannerUploadButtonContainer>
          </BannerUploadTextButtonContainer>
        </BannerUploadContainer>
        <SectionDivider />
        <TopImageSectionContainer>
          <BannerUploadHeader>Top Image</BannerUploadHeader>
          <TopImageImageButtonContainer>
            <Box>
              <img src="https://placekitten.com/74" alt="banner" />
            </Box>
            <TopImageTextButtonContainer>
              <TopImageText>400 x 400px</TopImageText>
              <TopImageButtonContainer>
                <ButtonIconWrapper onClick={handleReplaceImage}>
                  <ReplaceIcon />
                </ButtonIconWrapper>
                <ButtonIconWrapper onClick={handleRemoveFile}>
                  <DeleteIcon />
                </ButtonIconWrapper>
              </TopImageButtonContainer>
            </TopImageTextButtonContainer>
          </TopImageImageButtonContainer>
        </TopImageSectionContainer>
      </CommandBannerUploadContainer>
    </CommandBannerContainer>
  );
};

const CustomizeBanners = () => {
  return (
    <CustomizeBannersContainer>
      <CommandsContainer>
        {commandBanners.map((banner, index) => (
          <CommandBanner key={index} banner={banner} />
        ))}
      </CommandsContainer>
    </CustomizeBannersContainer>
  );
};

export default CustomizeBanners;
