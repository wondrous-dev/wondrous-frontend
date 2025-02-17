import { Box } from "@mui/material";
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
import { DELETE_ORG_BANNER, UPSERT_ORG_CUSTOM_BANNER } from "graphql/mutations/orgAsset";
import { useMutation, useQuery } from "@apollo/client";
import GlobalContext from "utils/context/GlobalContext";
import { transformAndUploadMedia } from "utils/media";
import { GET_ORG_CUSTOM_ASSETS } from "graphql/queries/orgAsset";
import SafeImage from "components/SafeImage";
import useAlerts, { useSubscriptionPaywall } from "utils/hooks";
import { useNavigate } from "react-router-dom";
import AvatarEditor, { AVATAR_EDITOR_TYPES } from "components/ImageUpload/AvatarEditor";

const EXEMPTED_ORG_IDS = ["911445364593262592", "844677430694510634", "1192224585215639572"];

const ORG_ASSET_PURPOSE = {
  questBanner: "quest_banner",
  levelBanner: "level_banner",
  leaderboardBanner: "leaderboard_banner",
  startQuestBanner: "start_quest_banner",
  mySubmissionBanner: "my_submission_banner",
  storeBanner: "store_banner",
  myPurchasesBanner: "my_purchases_banner",
  onboardMeBanner: "onboard_me_banner",
  referralBanner: "referral_banner",
  questThumbnail: "quest_thumbnail",
  levelThumbnail: "level_thumbnail",
  leaderboardThumbnail: "leaderboard_thumbnail",
  mySubmissionThumbnail: "my_submission_thumbnail",
  storeThumbnail: "store_thumbnail",
  myPurchasesThumbnail: "my_purchases_thumbnail",
  onboardMeThumbnail: "onboard_me_thumbnail",
  referralThumbnail: "referral_thumbnail",
};

const commandBanners: {
  title: string;
  tooltip: string;
  banner: {
    purpose: (typeof ORG_ASSET_PURPOSE)[keyof typeof ORG_ASSET_PURPOSE];
    image: string;
  };
  logo: {
    purpose: (typeof ORG_ASSET_PURPOSE)[keyof typeof ORG_ASSET_PURPOSE];
    image: string;
  };
}[] = [
  {
    title: "Quests",
    tooltip: "Quests are a series of tasks that users can complete to earn rewards.",
    banner: {
      purpose: ORG_ASSET_PURPOSE.questBanner,
      image: "/images/banner-images/quest-banner.png",
    },
    logo: {
      purpose: ORG_ASSET_PURPOSE.questThumbnail,
      image: "/images/banner-images/quest-circle.png",
    },
  },

  {
    title: "My Submissions",
    tooltip: "View all of your submissions and their statuses.",
    banner: {
      purpose: ORG_ASSET_PURPOSE.mySubmissionBanner,
      image: "/images/banner-images/sub-banner.png",
    },
    logo: {
      purpose: ORG_ASSET_PURPOSE.mySubmissionThumbnail,
      image: "/images/banner-images/sub-circle.png",
    },
  },
  {
    title: "My Level",
    tooltip: "View your current level and experience points.",
    banner: {
      purpose: ORG_ASSET_PURPOSE.levelBanner,
      image: "/images/banner-images/my-level-banner.png",
    },
    logo: {
      purpose: ORG_ASSET_PURPOSE.levelThumbnail,
      image: "/images/banner-images/my-level-circle.png",
    },
  },
  {
    title: "Leaderboard",
    tooltip: "View the top users and their levels.",
    banner: {
      purpose: ORG_ASSET_PURPOSE.leaderboardBanner,
      image: "/images/banner-images/leaderboard-banner.png",
    },
    logo: {
      purpose: ORG_ASSET_PURPOSE.leaderboardThumbnail,
      image: "/images/banner-images/leaderboard-circle.png",
    },
  },
  {
    title: "Store",
    tooltip: "View all of the items available for purchase.",
    banner: {
      purpose: ORG_ASSET_PURPOSE.storeBanner,
      image: "/images/banner-images/store-banner.png",
    },
    logo: {
      purpose: ORG_ASSET_PURPOSE.storeThumbnail,
      image: "/images/banner-images/store-circle.png",
    },
  },
  {
    title: "My Purchases",
    tooltip: "View all of your purchases.",
    banner: {
      purpose: ORG_ASSET_PURPOSE.myPurchasesBanner,
      image: "/images/banner-images/my-purchases-banner.png",
    },
    logo: {
      purpose: ORG_ASSET_PURPOSE.myPurchasesThumbnail,
      image: "/images/banner-images/my-purchases-circle.png",
    },
  },
  {
    title: "Onboard Me",
    tooltip: "Complete the onboarding process.",
    banner: {
      purpose: ORG_ASSET_PURPOSE.onboardMeBanner,
      image: "/images/banner-images/onboard-me-banner.png",
    },
    logo: {
      purpose: ORG_ASSET_PURPOSE.onboardMeThumbnail,
      image: "/images/banner-images/onboard-me-circle.png",
    },
  },
];

const CommandBanner = ({
  baseBanner,
  customBanner,
  handleReplaceImage,
  handleDeleteImage,
  setSelectedAvatarProps,
  setTempImage,
  handleResetAvatarImage,
}) => {
  const { title, tooltip, banner, logo } = baseBanner;
  const bannerImageInputField = useRef(null);
  const topImageInputField = useRef(null);

  const customBannerImage = customBanner?.find((customBanner) => customBanner.purpose === banner.purpose);
  const customTopImage = customBanner?.find((customBanner) => customBanner.purpose === logo.purpose);
  const customBannerImageUrl = customBannerImage?.publicUrl;
  const customTopImageUrl = customTopImage?.publicUrl;

  const handleDeleteBannerImage = async () => {
    handleDeleteImage({
      assetId: customBannerImage?.id,
      imageInputField: bannerImageInputField,
    });
  };

  const handleDeleteTopImage = async () => {
    handleDeleteImage({
      assetId: customTopImage?.id,
      imageInputField: topImageInputField,
    });
  };

  const handleOnSave = async ({ file, replaceImageCallback }) => {
    if (!file) {
      handleResetAvatarImage();
      return;
    }
    replaceImageCallback();
    handleResetAvatarImage();
  };

  const handleSetBannerImageAvatarProps = () => {
    if (bannerImageInputField.current.value === "") {
      bannerImageInputField.current.click();
      return;
    }
    setSelectedAvatarProps({
      originalImage: customBannerImageUrl || banner.image,
      open: true,
      openSelectFile: () => bannerImageInputField.current.click(),
      imageType: AVATAR_EDITOR_TYPES.BANNER_IMAGE,
      onSave: async (file: File) =>
        handleOnSave({
          file,
          replaceImageCallback: async () =>
            await handleReplaceImage({ file, purpose: banner.purpose, imageInputField: bannerImageInputField }),
        }),
      onCancel: () => (bannerImageInputField.current.value = ""),
    });
  };

  const handleBannerImageOnChange = (e) => {
    const image = e?.target?.files[0];
    if (!image) return;
    setTempImage(e.target.files[0]);
    handleSetBannerImageAvatarProps();
  };

  const handleSetTopImageAvatarProps = (logo) => {
    if (topImageInputField.current.value === "") {
      topImageInputField.current.click();
      return;
    }
    setSelectedAvatarProps({
      originalImage: customTopImageUrl || logo.image,
      open: true,
      openSelectFile: () => topImageInputField.current.click(),
      imageType: AVATAR_EDITOR_TYPES.BANNER_LOGO_IMAGE,
      onSave: async (file: File) =>
        handleOnSave({
          file,
          replaceImageCallback: async () =>
            await handleReplaceImage({ file, purpose: logo.purpose, imageInputField: topImageInputField }),
        }),
      onCancel: () => (topImageInputField.current.value = ""),
    });
  };

  const handleSetTopImageOnChange = (e) => {
    const image = e?.target?.files[0];
    if (!image) return;
    setTempImage(e.target.files[0]);
    handleSetTopImageAvatarProps(logo);
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
                  maxHeight: "100%",
                }}
              />
            ) : (
              <img src={banner.image} alt={`${title} banner`} />
            )}
          </BannerUploadImageContainer>
          <BannerUploadTextButtonContainer>
            <BannerUploadText>Optimal size: 640 x 140px</BannerUploadText>
            <BannerUploadButtonContainer>
              <ButtonIconWrapper onClick={handleSetBannerImageAvatarProps}>
                <ReplaceIcon />
              </ButtonIconWrapper>
              <ButtonInputContainer>
                <input type="file" accept="image/*" ref={bannerImageInputField} onChange={handleBannerImageOnChange} />
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
                <img src={logo.image} alt={`${title} top image`} />
              )}
            </TopImageContainer>
            <TopImageTextButtonContainer>
              <TopImageText>400 x 400px</TopImageText>
              <TopImageButtonContainer>
                <ButtonIconWrapper onClick={handleSetTopImageAvatarProps}>
                  <ReplaceIcon />
                </ButtonIconWrapper>
                <ButtonInputContainer>
                  <input type="file" accept="image/*" ref={topImageInputField} onChange={handleSetTopImageOnChange} />
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
  const { isLoading, isPremiumPlan, isEcosystemPlan, setPaywall, setPaywallMessage, setOnCancel, setCanBeClosed } =
    useSubscriptionPaywall();
  const { data } = useQuery(GET_ORG_CUSTOM_ASSETS, {
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
  });
  const { setSnackbarAlertMessage, setSnackbarAlertOpen, setSnackbarAlertSeverity, showError } = useAlerts();
  const [updateBanner] = useMutation(UPSERT_ORG_CUSTOM_BANNER);
  const [deleteBanner] = useMutation(DELETE_ORG_BANNER);

  const defaultAvatarProps = {
    originalImage: null,
    open: false,
    onCancel: () => {},
    onSave: () => {},
    openSelectFile: () => {},
    imageType: AVATAR_EDITOR_TYPES.BANNER_IMAGE,
  };
  const [selectedAvatarProps, setSelectedAvatarProps] = useState(defaultAvatarProps);
  const [tempImage, setTempImage] = useState(null);
  const handleResetAvatarImage = () => {
    selectedAvatarProps?.onCancel();
    setTempImage(null);
    setSelectedAvatarProps(defaultAvatarProps);
  };
  const handleClearInput = () => {
    selectedAvatarProps?.onCancel();
    setSelectedAvatarProps({ ...selectedAvatarProps, originalImage: selectedAvatarProps?.originalImage });
  };

  if (isLoading || !(isPremiumPlan || isEcosystemPlan) || EXEMPTED_ORG_IDS.includes(activeOrg?.id)) {
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
    return null;
  }

  if (isEcosystemPlan || isPremiumPlan) {
    setPaywall(false);
  }

  const handleReplaceImage = async ({ file, purpose, imageInputField }) => {
    const image = file[0];

    if (!image || !image.type.includes("image")) {
      showError("Invalid file type");
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (image.size > MAX_FILE_SIZE) {
      showError("File size should be less than 5MB");
      return;
    }

    const { filename } = await transformAndUploadMedia({
      file: image,
    });

    await updateBanner({
      variables: {
        input: {
          orgId: activeOrg?.id,
          purpose,
          mediaUpload: {
            uploadSlug: filename,
          },
        },
      },
      refetchQueries: [GET_ORG_CUSTOM_ASSETS],
      onCompleted: () => {
        imageInputField.current.value = "";
        setSnackbarAlertSeverity("success");
        setSnackbarAlertMessage("Updated successfully");
        setSnackbarAlertOpen(true);
      },
      onError: () => {
        showError("Error updating image");
      },
    });
  };

  const handleDeleteImage = async ({ assetId, imageInputField }) => {
    const onCompleted = () => {
      imageInputField.current.value = "";
      setSnackbarAlertSeverity("success");
      setSnackbarAlertMessage("Deleted successfully");
      setSnackbarAlertOpen(true);
      return;
    };
    if (!assetId) {
      onCompleted();
      return;
    }
    await deleteBanner({
      variables: {
        orgAssetId: assetId,
      },
      refetchQueries: [GET_ORG_CUSTOM_ASSETS],
      onCompleted,
      onError: () => {
        showError("Error deleting image");
      },
    });
  };

  return (
    <>
      <AvatarEditor
        title={"Upload Image"}
        open={selectedAvatarProps?.open}
        onSave={selectedAvatarProps?.onSave}
        imageType={selectedAvatarProps?.imageType}
        openSelectFile={selectedAvatarProps?.openSelectFile}
        originalImage={tempImage || selectedAvatarProps?.originalImage}
        onCancel={handleResetAvatarImage}
        clearInput={handleClearInput}
      />
      <CustomizeBannersContainer>
        <CommandsContainer>
          {commandBanners.map((banner) => {
            return (
              <CommandBanner
                key={`${banner.title}-banner`}
                baseBanner={banner}
                customBanner={data?.getOrgCustomAssets}
                handleReplaceImage={handleReplaceImage}
                handleDeleteImage={handleDeleteImage}
                setSelectedAvatarProps={setSelectedAvatarProps}
                setTempImage={setTempImage}
                handleResetAvatarImage={handleResetAvatarImage}
              />
            );
          })}
        </CommandsContainer>
      </CustomizeBannersContainer>
    </>
  );
};

export default CustomizeBanners;
