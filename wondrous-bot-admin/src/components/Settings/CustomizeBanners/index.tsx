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
  BannerUploadImageContainer,
  TopImageContainer,
} from "./styles";
import { StyledInformationTooltip } from "components/Shared/Tooltip";
import InformationTooltip from "components/Icons/information.svg";

const commandBanners = [
  {
    title: "Quests",
    tooltip: "Quests are a series of tasks that users can complete to earn rewards.",
    bannerImage: "/images/banner-images/quest-banner.png",
    topImage: "/images/banner-images/quest-circle.png",
  },

  {
    title: "My Submissions",
    tooltip: "View all of your submissions and their statuses.",
    bannerImage: "/images/banner-images/sub-banner.png",
    topImage: "/images/banner-images/sub-circle.png",
  },
  {
    title: "My Level",
    tooltip: "View your current level and experience points.",
    bannerImage: "/images/banner-images/my-level-banner.png",
    topImage: "/images/banner-images/my-level-circle.png",
  },
  {
    title: "Leaderboard",
    tooltip: "View the top users and their levels.",
    bannerImage: "/images/banner-images/leaderboard-banner.png",
    topImage: "/images/banner-images/leaderboard-circle.png",
  },
  {
    title: "Store",
    tooltip: "Purchase items with your experience points.",
    bannerImage: "/images/banner-images/store-banner.png",
    topImage: "/images/banner-images/store-circle.png",
  },
  {
    title: "My Purchases",
    tooltip: "View all of your purchases.",
    bannerImage: "/images/banner-images/my-purchases-banner.png",
    topImage: "/images/banner-images/my-purchases-circle.png",
  },
  {
    title: "Onboard Me",
    tooltip: "Complete the onboarding process.",
    bannerImage: "/images/banner-images/onboard-me-banner.png",
    topImage: "/images/banner-images/onboard-me-circle.png",
  },
];

const CommandBanner = ({ banner }) => {
  const { title, tooltip } = banner;

  const [bannerImage, setBannerImage] = useState(banner.bannerImage);

  const handleReplaceBannerImage = (file) => null;
  const handleDeleteBannerImage = () => setBannerImage(banner.bannerImage);

  const [topImage, setTopImage] = useState(banner.topImage);
  const handleReplaceTopImage = (file) => null;
  const handleDeleteTopImage = () => setTopImage(banner.topImage);

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
          <BannerUploadImageContainer>
            <img src={bannerImage} alt={title} />
          </BannerUploadImageContainer>
          <BannerUploadTextButtonContainer>
            <BannerUploadText>Optimal size: 640 x 140px</BannerUploadText>
            <BannerUploadButtonContainer>
              <ButtonIconWrapper onClick={handleReplaceBannerImage}>
                <ReplaceIcon />
              </ButtonIconWrapper>
              <ButtonIconWrapper onClick={handleDeleteBannerImage}>
                <DeleteIcon />
              </ButtonIconWrapper>
            </BannerUploadButtonContainer>
          </BannerUploadTextButtonContainer>
        </BannerUploadContainer>
        <SectionDivider />
        <TopImageSectionContainer>
          <BannerUploadHeader>Top Image</BannerUploadHeader>
          <TopImageImageButtonContainer>
            <TopImageContainer>
              <img src={topImage} alt={topImage} />
            </TopImageContainer>
            <TopImageTextButtonContainer>
              <TopImageText>400 x 400px</TopImageText>
              <TopImageButtonContainer>
                <ButtonIconWrapper onClick={handleReplaceTopImage}>
                  <ReplaceIcon />
                </ButtonIconWrapper>
                <ButtonIconWrapper onClick={handleDeleteTopImage}>
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
