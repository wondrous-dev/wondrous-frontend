import { useLazyQuery } from "@apollo/client";
import { Masonry } from "@mui/lab";
import { Grid, Box, Typography, ButtonBase, Paper, styled } from "@mui/material";
import { CardHoverWrapper, CardWrapper, Label } from "components/QuestsList/styles";
import { CloseIcon } from "components/Shared/DatePicker/Shared/Icons";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import { SharedSecondaryButton } from "components/Shared/styles";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import ViewRewards, { Reward } from "components/ViewQuestResults/ViewRewards";
import { GET_CMTY_USER_TOKEN_EXPIRE_CHECK, GET_ORG_DISCORD_INVITE_LINK } from "graphql/queries";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { constructRewards } from "utils/common";
import { getDiscordUrl } from "utils/discord";

const QuestCard = ({ quest }) => {
  const rewardsValue = constructRewards({ rewards: quest?.rewards || [] });

  return (
    <CardHoverWrapper
      width="100%"
      height="100%"
      // maxWidth={{
      //   xs: "100%",
      //   sm: "50%",
      //   md: "50%",
      //   lg: "33.333333%",

      // }}
      // maxWidth={{}}
      // onClick={() => navigate(`/quests/${item.id}`)}
      flex={1}
    >
      <CardWrapper
        item
        sx={{
          border: "1px solid black",
          padding: "24px 14px !important",
        }}
      >
        <Label
          fontSize="15px"
          style={{
            textAlign: "center",
            overflowWrap: "anywhere",
          }}
        >
          {quest?.title}
        </Label>
        <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" color="#626262">
          {quest?.description}
        </Typography>
        <Divider style={{ backgroundColor: "#F5F5F5" }} />
        <Box display="flex" gap="14px" alignItems="center" justifyContent="center" flexDirection="column">
          <Typography fontFamily="Poppins" fontSize="13px" color="black" fontWeight={500}>
            Quest Rewards
          </Typography>
          <Grid container alignItems="center" gap="14px" flex="1" justifyContent="center">
            {rewardsValue.map(Reward)}
          </Grid>
          <SharedSecondaryButton>Start Quest</SharedSecondaryButton>
        </Box>
      </CardWrapper>
    </CardHoverWrapper>
  );
};

const ViewRefferal = ({ referralCampaign }) => {
  const cmtyUserToken = localStorage.getItem("cmtyUserToken");
  const params = {
    referralCode: referralCampaign?.referralCode,
  };
  console.log(referralCampaign, 'ref camp')
  const discordAuthUrl = getDiscordUrl(
    "/discord/callback/referral",
    `&state=${encodeURIComponent(JSON.stringify(params))}`
  );


  const [isDiscordConnected, setIsDiscordConnected] = useState(false);
  const [getOrgDiscordInviteLink, { data: orgDiscordInviteLinkData }] = useLazyQuery(GET_ORG_DISCORD_INVITE_LINK);
  const [verifyToken] = useLazyQuery(GET_CMTY_USER_TOKEN_EXPIRE_CHECK, {
    context: {
      headers: {
        Authorization: `Bearer ${cmtyUserToken}`,
      },
    },
  });

  useEffect(() => {
    if (cmtyUserToken) {
      verifyToken().then(({ data }) => setIsDiscordConnected(data?.getCmtyUserTokenExpireCheck?.success));
    }
  }, [cmtyUserToken]);

  const org = referralCampaign?.org;
  const [isReffererView, setIsReffererView] = useState(true);

  // const quests = [...referralCampaign?.quests, ...referralCampaign?.quests, ...referralCampaign?.quests, ...referralCampaign?.quests] || [];
  const quests = referralCampaign?.quests || [];
  const rewardsValue = constructRewards({ rewards: referralCampaign?.rewards || [] });

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
      {isReffererView ? (
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
              {<strong>{referralCampaign?.creator?.firstName}</strong>} referred you, complete the quests below!
            </Typography>
            <ButtonBase onClick={() => setIsReffererView(false)}>
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
              profilePicture={org?.profilePicture}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "100%",
              }}
            />
          </Box>
        </Box>
        <Typography fontWeight={600} fontFamily="Poppins" fontSize="22px" color="black">
          {org?.name}
        </Typography>
        {org.description ? (
          <Typography fontWeight={500} fontFamily="Poppins" fontSize="17" color="#626262" textAlign="center">
            {org?.description}
          </Typography>
        ) : null}
        {referralCampaign?.rewards?.length ? (
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
         {isDiscordConnected ?  <Masonry
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
                  ...(quests?.length === 1 && {
                    maxWidth: "40%",
                  }),
                }}
              >
                <QuestCard quest={quest} key={index} />
              </Box>
            ))}
          </Masonry> : (
            <SharedSecondaryButton>Connect Discord</SharedSecondaryButton>
          )}
        </Box>
      </Grid>
    </>
  );
};

export default ViewRefferal;
