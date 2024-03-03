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
import groupBy from "lodash/groupBy";
import SafeImage from "components/SafeImage";
import { usePaywall, useSubscriptionPaywall } from "utils/hooks";
import { useNavigate } from "react-router-dom";

const EXEMPTED_ORG_IDS = ["911445364593262592", "844677430694510634", "1192224585215639572"];

const BANNER_POSITION = {
  topImage: "topImage",
  banner: "banner",
};

const commandBanners: {
  title: string;
  tooltip: string;
  bannerImage: string;
  topImage: string;
  command: string;
}[] = [
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

const CommandBanner = ({ baseBanner, activeOrg, customBanner }) => {
  const { title, tooltip, command } = baseBanner;
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  const [updateBanner] = useMutation(UPDATE_ORG_BANNER);
  const [deleteBanner] = useMutation(DELETE_ORG_BANNER);
  const imageInputField = useRef(null);

  const customBannerImage = customBanner?.find((banner) => banner?.additionalData?.position === BANNER_POSITION.banner);
  const customTopImage = customBanner?.find((banner) => banner?.additionalData?.position === BANNER_POSITION.topImage);
  const customBannerImageUrl = customBannerImage?.url;
  const customTopImageUrl = customTopImage?.url;

  const handleReplaceImage = async ({ file, position, oldAssetId }) => {
    const image = file.target.files[0];
    const { filename } = await transformAndUploadMedia({
      file: image,
    });
    await updateBanner({
      variables: {
        orgId: activeOrg?.id,
        input: {
          command,
          url: filename,
          position,
          oldAssetId,
        },
      },
      refetchQueries: [GET_ORG_BANNERS],
      onCompleted: () => {
        imageInputField.current.value = "";
        setSnackbarAlertMessage("Updated successfully");
        setSnackbarAlertOpen(true);
      },
    });
  };

  const handleDeleteImage = async ({ assetId }) => {
    if (!assetId) {
      imageInputField.current.value = "";
      return;
    }
    await deleteBanner({
      variables: {
        orgId: activeOrg?.id,
        input: {
          assetId,
        },
      },
      refetchQueries: [GET_ORG_BANNERS],
      onCompleted: () => {
        imageInputField.current.value = "";
        setSnackbarAlertMessage("Deleted successfully");
        setSnackbarAlertOpen(true);
      },
    });
  };

  const handleReplaceBannerImage = async (file) => {
    handleReplaceImage({
      file,
      position: BANNER_POSITION.banner,
      oldAssetId: customBannerImage?.id,
    });
  };
  const handleDeleteBannerImage = async () => {
    handleDeleteImage({
      assetId: customBannerImage?.id,
    });
  };

  const handleReplaceTopImage = async (file) => {
    handleReplaceImage({
      file,
      position: BANNER_POSITION.topImage,
      oldAssetId: customTopImage?.id,
    });
  };
  const handleDeleteTopImage = async () => {
    handleDeleteImage({
      assetId: customTopImage?.id,
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
            {customBannerImageUrl ? (
              <SafeImage
                src={customBannerImageUrl}
                alt={`${title} banner`}
                style={{
                  height: "auto",
                  objectFit: "cover",
                  width: "100%",
                  maxHeight: "25vh",
                }}
              />
            ) : (
              <img src={baseBanner?.bannerImage} alt={`${title} banner`} />
            )}
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
              {customTopImageUrl ? (
                <SafeImage
                  src={customTopImageUrl}
                  alt={`${title} top image`}
                  style={{
                    height: "auto",
                    objectFit: "cover",
                    width: "100%",
                    maxHeight: "25vh",
                  }}
                />
              ) : (
                <img src={baseBanner?.topImage} alt={`${title} top image`} />
              )}
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
  const navigate = useNavigate();
  const { activeOrg } = useContext(GlobalContext);
  const { isPremiumPlan, isEcosystemPlan } = useSubscriptionPaywall();
  const { setPaywall, setPaywallMessage, setOnCancel, setCanBeClosed } = usePaywall() || {};
  const { data } = useQuery(GET_ORG_BANNERS, {
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
  });

  if (!isPremiumPlan || !isEcosystemPlan || EXEMPTED_ORG_IDS.includes(activeOrg?.id)) {
    setOnCancel(() => {
      return () => {
        setPaywall(false);
        setPaywallMessage("");
        setOnCancel(null);
        setCanBeClosed(true);
        navigate(-1);
      };
    });
    setPaywallMessage("Customize Banners");
    setPaywall(true);
    return;
  }

  const groupedBannerByCommand = groupBy(data?.getOrgBanners, (banner) => banner?.additionalData?.command);
  return (
    <CustomizeBannersContainer>
      <CommandsContainer>
        {commandBanners.map((banner, index) => {
          const customBanner = groupedBannerByCommand[banner.command];
          return (
            <CommandBanner
              key={`${banner.command}-banner-${index}`}
              baseBanner={banner}
              customBanner={customBanner}
              activeOrg={activeOrg}
            />
          );
        })}
      </CommandsContainer>
    </CustomizeBannersContainer>
  );
};

export default CustomizeBanners;
