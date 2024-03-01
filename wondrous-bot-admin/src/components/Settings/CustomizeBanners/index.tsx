import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import DeleteIcon from "components/Icons/Delete";
import { useContext, useRef, useState } from "react";
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
  ButtonInputContainer,
} from "./styles";
import { StyledInformationTooltip } from "components/Shared/Tooltip";
import InformationTooltip from "components/Icons/information.svg";
import { DELETE_ORG_BANNER, UPDATE_ORG_BANNER } from "graphql/mutations/orgAsset";
import { useMutation, useQuery } from "@apollo/client";
import GlobalContext from "utils/context/GlobalContext";
import { transformAndUploadMedia } from "utils/media";
import { GET_ORG_BANNERS } from "graphql/queries/orgAsset";

const commandBanners = [
  {
    title: "Quests",
    tooltip: "Quests are a series of tasks that users can complete to earn rewards.",
    bannerImage: "/images/banner-images/quest-banner.png",
    topImage: "/images/banner-images/quest-circle.png",
    command: "quests",
  },

  {
    title: "My Submissions",
    tooltip: "View all of your submissions and their statuses.",
    bannerImage: "/images/banner-images/sub-banner.png",
    topImage: "/images/banner-images/sub-circle.png",
    command: "my-submissions",
  },
  {
    title: "My Level",
    tooltip: "View your current level and experience points.",
    bannerImage: "/images/banner-images/my-level-banner.png",
    topImage: "/images/banner-images/my-level-circle.png",
    command: "my-level",
  },
  {
    title: "Leaderboard",
    tooltip: "View the top users and their levels.",
    bannerImage: "/images/banner-images/leaderboard-banner.png",
    topImage: "/images/banner-images/leaderboard-circle.png",
    command: "leaderboard",
  },
  {
    title: "Store",
    tooltip: "Purchase items with your experience points.",
    bannerImage: "/images/banner-images/store-banner.png",
    topImage: "/images/banner-images/store-circle.png",
    command: "store",
  },
  {
    title: "My Purchases",
    tooltip: "View all of your purchases.",
    bannerImage: "/images/banner-images/my-purchases-banner.png",
    topImage: "/images/banner-images/my-purchases-circle.png",
    command: "my-purchases",
  },
  {
    title: "Onboard Me",
    tooltip: "Complete the onboarding process.",
    bannerImage: "/images/banner-images/onboard-me-banner.png",
    topImage: "/images/banner-images/onboard-me-circle.png",
    command: "onboard-me",
  },
];

const CommandBanner = ({ banner, activeOrg }) => {
  const { title, tooltip, command } = banner;
  const [updateBanner] = useMutation(UPDATE_ORG_BANNER);
  const [deleteBanner] = useMutation(DELETE_ORG_BANNER);
  const imageInputField = useRef(null);

  const handleReplaceImage = async ({ file, position, callbackSetState }) => {
    const image = file.target.files[0];
    const { filename } = await transformAndUploadMedia({
      file: image,
    });
    const response = await updateBanner({
      variables: {
        orgId: activeOrg?.id,
        input: {
          command,
          url: filename,
          position,
          oldAssetId: "",
        },
      },
    });
    if (response?.data?.updateOrgBanner?.success) {
      callbackSetState(URL.createObjectURL(image));
      imageInputField.current.value = "";
    }
  };

  const handleDeleteImage = async ({ callback }) => {
    const response = await deleteBanner({
      variables: {
        orgId: activeOrg?.id,
        input: {
          oldAssetId: "",
        },
      },
    });
    if (response?.data?.deleteOrgBanner?.success) {
      callback();
      imageInputField.current.value = "";
    }
  };

  const [bannerImage, setBannerImage] = useState(banner.bannerImage);
  const handleReplaceBannerImage = async (file) => {
    handleReplaceImage({ file, position: "banner", callbackSetState: setBannerImage });
  };
  const handleDeleteBannerImage = async () => {
    handleDeleteImage({
      callback: () => setBannerImage(banner.bannerImage),
    });
  };

  const [topImage, setTopImage] = useState(banner.topImage);
  const handleReplaceTopImage = async (file) => {
    handleReplaceImage({ file, position: "topImage", callbackSetState: setTopImage });
  };
  const handleDeleteTopImage = async () => {
    handleDeleteImage({
      callback: () => setTopImage(banner.topImage),
    });
  };

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
              <ButtonInputContainer>
                <input type="file" accept="image/*" ref={imageInputField} onChange={handleReplaceBannerImage} />
                <ButtonIconWrapper>
                  <ReplaceIcon />
                </ButtonIconWrapper>
              </ButtonInputContainer>
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
                <ButtonInputContainer>
                  <input type="file" accept="image/*" ref={imageInputField} onChange={handleReplaceTopImage} />
                  <ButtonIconWrapper>
                    <ReplaceIcon />
                  </ButtonIconWrapper>
                </ButtonInputContainer>
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
  const { activeOrg } = useContext(GlobalContext);
  const { data } = useQuery(GET_ORG_BANNERS, {
    //TODO: update query when implemented in backend
    variables: {
      orgId: activeOrg?.id,
    },
  });
  return (
    <CustomizeBannersContainer>
      <CommandsContainer>
        {commandBanners.map((banner, index) => (
          <CommandBanner key={index} banner={banner} activeOrg={activeOrg} />
        ))}
      </CommandsContainer>
    </CustomizeBannersContainer>
  );
};

export default CustomizeBanners;
