import { Masonry } from "@mui/lab";
import { Grid, Box, Typography, ButtonBase } from "@mui/material";
import { CloseIcon } from "components/Shared/DatePicker/Shared/Icons";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import { Reward } from "components/ViewQuestResults/ViewRewards";
import { useMemo, useState } from "react";
import { constructRewards } from "utils/common";
import { REFERRAL_REWARD_SCHEME, REFERRAL_STATUSES } from "utils/constants";
import InfoModal from "./InfoModal";
import IndividualQuestComponent from "./IndividualQuestComponent";
import useStartQuest from "./utils/hooks";
import SafeImage from "components/SafeImage";
import InactiveQuestInfoModal from "./InactiveQuest";
import moment from "moment";
import ReferralAction from "./ReferralAction";
import { shouldDisplayJoinDiscordButton } from "./utils/customization";

const TopBarMessage = ({ displayName, hasEnded, orgId }) => {
  const showDiscordButton = shouldDisplayJoinDiscordButton(orgId);

  if (hasEnded)
    return (
      <>
        {showDiscordButton
          ? "This campaign is no longer active, but join our Discord to discover more quests!"
          : "This campaign has ended, but you can still complete the quests below!"}
      </>
    );
  return (
    <>
      <strong>{displayName}</strong> referred you, complete the quests below!
    </>
  );
};

const StartReferralQuests = ({ referralCampaign, referralCode, referralCampaignExternalId, referralCodeInfo }) => {
  const [infoModalQuestId, setInfoModalQuestId] = useState(null);
  const discordUrlParams = {
    referralCode,
    referralCampaignExternalId,
    orgId: referralCampaign?.orgId,
  };
  const {
    isDiscordConneceted,
    isMember,
    isConnectionLoading,
    handleJoinDiscord,
    handleOnConnect,
    handleInfoModalClose,
    onStartQuest,
    isQuestInactive,
    setIsQuestInactive,
  } = useStartQuest({
    setInfoModalQuestId,
    orgId: referralCampaign?.orgId,
    quest: null,
    quests: referralCampaign?.quests,
    referralCode,
    referralCampaignExternalId,
    discordUrlParams,
  });

  const org = referralCampaign?.org;
  const [displayReferrer, setDisplayReferrer] = useState(true);

  const referredRewards = useMemo(() => {
    const { rewards, referredPointReward } = referralCampaign || {};
    return rewards?.reduce(
      (acc, reward) => {
        if (reward?.scheme === REFERRAL_REWARD_SCHEME.REFERRED || reward?.scheme === REFERRAL_REWARD_SCHEME.TWO_WAY) {
          acc.push(reward);
        }
        return acc;
      },
      referredPointReward ? [{ type: "points", value: referredPointReward }] : []
    );
  }, [referralCampaign?.rewards, referralCampaign?.referredPointReward]);

  const quests = referralCampaign?.quests || [];
  const rewardsValue = constructRewards({ rewards: referredRewards || [] });

  const referralBannerImage = referralCampaign?.media?.[0]?.slug;

  const endDate = referralCampaign?.endDate ? moment(referralCampaign?.endDate) : null;
  const hasEnded =
    referralCampaign?.status !== REFERRAL_STATUSES.ACTIVE ||
    (endDate && endDate.isBefore(moment().utcOffset(0)?.endOf("day")?.toISOString()));

  return (
    <>
      <InfoModal
        isOpen={!!infoModalQuestId}
        onStartQuest={() => onStartQuest(infoModalQuestId)}
        onClose={handleInfoModalClose}
        showConnect={!isDiscordConneceted}
        showJoinDiscord={isDiscordConneceted && !isMember}
        showStartQuest={isDiscordConneceted && isMember}
        handleJoinDiscord={handleJoinDiscord}
        handleOnConnect={handleOnConnect}
        isConnectionLoading={isConnectionLoading}
        orgId={referralCampaign?.orgId}
        orgProfilePicture={referralCampaign?.org?.profilePicture}
      />
      <InactiveQuestInfoModal
        isOpen={isQuestInactive}
        onClose={() => setIsQuestInactive(false)}
        orgId={referralCampaign?.orgId}
      />

      {displayReferrer ? (
        <Box
          display="flex"
          width="calc(100% - 40px)"
          position="sticky"
          alignItems="center"
          justifyContent="center"
          zIndex="10"
          maxWidth="620px"
        >
          <Box
            display="flex"
            padding="13px 20px"
            flex="1 0 0"
            height="fit-content"
            top="100px"
            zIndex="10"
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            alignSelf="stretch"
            borderRadius="12px"
            border="1px solid transparent"
            borderColor={hasEnded ? "#F2C30C" : "#2A8D5C"}
            bgcolor={hasEnded ? "rgba(242, 195, 12, 0.30)" : "#d0e1d6"}
          >
            <Box />
            <Typography color="black" fontSize="14px" fontFamily="Poppins" fontWeight={500} textAlign={"center"}>
              <TopBarMessage
                orgId={referralCampaign?.orgId}
                hasEnded={hasEnded}
                displayName={referralCodeInfo?.referrerDisplayName}
              />
            </Typography>
            <ButtonBase
              onClick={() => setDisplayReferrer(false)}
              sx={{
                marginRight: "14px",
              }}
            >
              <CloseIcon />
            </ButtonBase>
          </Box>
        </Box>
      ) : null}

      <Grid
        display="flex"
        flexDirection="column"
        gap="24px"
        width="100%"
        justifyContent="center"
        alignItems="center"
        height="100%"
        flex="1"
      >
        <Box
          display="flex"
          marginBottom={{
            xs: "0",
            sm: referralBannerImage ? "48px" : "0",
          }}
          gap="14px"
          justifyContent="center"
          alignItems="center"
          position="relative"
          padding="20px 20px 0px 20px"
          maxWidth="620px"
          width="calc(100% - 40px)"
          flexDirection="column"
        >
          <SafeImage
            placeholderSrc={referralBannerImage ? "/images/referral-placeholder.png" : null}
            src={referralBannerImage}
            style={{
              width: "100%",
              borderRadius: "12px",
              height: "auto",
              maxHeight: "140px",
              objectFit: "cover",
            }}
          />
          <Box
            position={{
              xs: "relative",
              sm: referralBannerImage ? "absolute" : "relative",
            }}
            bottom="calc(-20% - 32px)"
          >
            <Box display="flex" flexDirection="column" gap="11px" justifyContent="center" alignItems="center">
              <Box
                display="flex"
                bgcolor="white"
                justifyContent="center"
                alignItems="center"
                borderRadius="100%"
                position="relative"
                border="7px solid white"
              >
                <OrgProfilePicture
                  profilePicture={referralCodeInfo?.orgProfilePicture}
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "100%",
                    border: "2px solid #000000",
                  }}
                />
              </Box>
            </Box>
            <Typography fontWeight={600} fontFamily="Poppins" fontSize="22px" color="black">
              {referralCodeInfo?.orgDisplayName}
            </Typography>
          </Box>
        </Box>
        {org.description ? (
          <Typography fontWeight={500} fontFamily="Poppins" fontSize="17" color="#626262" textAlign="center">
            {org?.description}
          </Typography>
        ) : null}
        {referredRewards?.length && !hasEnded ? (
          <Box display="flex" gap="14px" alignItems="center" justifyContent="center" flexDirection="column">
            <Typography fontFamily="Poppins" fontSize="13px" color="black" fontWeight={500}>
              Earn rewards for completing these quests!
            </Typography>
            <Grid container alignItems="center" gap="14px" flex="1" justifyContent="center">
              {rewardsValue.map(Reward)}
            </Grid>
          </Box>
        ) : null}
        {/* //TODO: REPLACE THIS WITH NEWEST CARD */}

        <ReferralAction
          hasEnded={hasEnded}
          orgId={referralCampaign?.orgId}
          quests={quests}
          onStartQuest={onStartQuest}
        />
      </Grid>
    </>
  );
};

export default StartReferralQuests;
