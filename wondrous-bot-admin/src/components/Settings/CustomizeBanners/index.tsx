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
} from "./styles";

const CommandBanner = () => {
  const [data, setData] = useState({ profilePicture: null });
  const handleChange = (value) => setData({ profilePicture: value });
  const handleRemoveFile = () => handleChange(null);
  const handleReplaceImage = () => handleChange(null);

  return (
    <CommandBannerContainer>
      <HeaderContainer>
        <HeaderText>/Quests</HeaderText>
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
      <CommandBanner />
      <CommandBanner />
    </CustomizeBannersContainer>
  );
};

export default CustomizeBanners;
