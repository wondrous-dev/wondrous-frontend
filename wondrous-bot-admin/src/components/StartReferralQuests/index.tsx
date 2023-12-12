import { Masonry } from "@mui/lab";
import { Grid, Box, Typography, ButtonBase } from "@mui/material";
import { CloseIcon } from "components/Shared/DatePicker/Shared/Icons";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import { Reward } from "components/ViewQuestResults/ViewRewards";
import { useMemo, useState } from "react";
import { constructRewards } from "utils/common";
import { REFERRAL_REWARD_SCHEME } from "utils/constants";
import InfoModal from "./InfoModal";
import IndividualQuestComponent from "./IndividualQuestComponent";
import useStartQuest from "./utils/hooks";

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

  const masonryColumnsConfig = useMemo(() => {
    if (quests?.length <= 1) {
      return { xs: 1 };
    } else if (quests?.length <= 2) {
      return { xs: 1, sm: 2 };
    }
    return { xs: 1, sm: 2, md: 2, lg: 3 };
  }, [quests?.length]);

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
      />

      {displayReferrer ? (
        <Box display="flex" width="100%" justifyContent="center" alignItems="center">
          <Box
            display="flex"
            padding="13px 14px"
            flex="1 0 0"
            top="100px"
            zIndex="10"
            width="calc(100% - 56px)"
            position="fixed"
            alignItems="center"
            justifyContent="space-between"
            alignSelf="stretch"
            borderRadius="12px"
            border="1px solid #2A8D5C"
            bgcolor="#d0e1d6"
          >
            <Box />
            <Typography color="black" fontSize="14px" fontFamily="Poppins" fontWeight={500}>
              {<strong>{referralCodeInfo?.referrerDisplayName}</strong>} referred you, complete the quests below!
            </Typography>
            <ButtonBase onClick={() => setDisplayReferrer(false)}>
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
        <Box display="flex" flexDirection="column" gap="11px" justifyContent="center" alignItems="center">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            border="2px solid #000000"
            borderRadius="100%"
            padding="2px"
            position="relative"
          >
            <OrgProfilePicture
              profilePicture={referralCodeInfo?.orgProfilePicture}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "100%",
              }}
            />
          </Box>
        </Box>
        <Typography fontWeight={600} fontFamily="Poppins" fontSize="22px" color="black">
          {referralCodeInfo?.orgDisplayName}
        </Typography>
        {org.description ? (
          <Typography fontWeight={500} fontFamily="Poppins" fontSize="17" color="#626262" textAlign="center">
            {org?.description}
          </Typography>
        ) : null}
        {referredRewards?.length ? (
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

        <Box
          bgcolor="#AF9EFF"
          height="100%"
          padding="32px 56px"
          display="flex"
          width="100%"
          flex="1"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Masonry
            spacing={4}
            columns={masonryColumnsConfig}
            sx={{
              alignContent: "center",
              width: "100%",
            }}
          >
            {quests?.map((quest, index) => (
              <Box
                width="100%"
                display="flex"
                justifyContent="center"
                sx={{
                  maxWidth: "400px",
                }}
              >
                <IndividualQuestComponent quest={quest} key={index} onStartQuest={onStartQuest} />
              </Box>
            ))}
          </Masonry>
        </Box>
      </Grid>
    </>
  );
};

export default StartReferralQuests;
