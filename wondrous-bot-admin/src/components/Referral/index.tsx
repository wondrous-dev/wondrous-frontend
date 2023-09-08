import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Box, CircularProgress, Divider, Grid } from "@mui/material";
import { DiscordRoleIcon, NFTIcon, PointsIcon } from "components/Icons/Rewards";
import PageSpinner from "components/PageSpinner";
import PageWrapper from "components/Shared/PageWrapper";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import { SharedSecondaryButton } from "components/Shared/styles";
import { START_QUEST } from "graphql/mutations";
import { GET_ORG_BY_REFERRAL_CODE, GET_ORG_DISCORD_INVITE_LINK, GET_QUEST_REWARDS } from "graphql/queries";
import { useEffect, useMemo } from "react";
import { BG_TYPES, ERRORS_LABELS } from "utils/constants";
import { getDiscordUrl } from "utils/discord";
import useAlerts from "utils/hooks";
import { ImageComponent, StyledLink, TextLabel } from "components/ViewQuest/styles";
import useErrorHandler from "components/ViewQuest//useErrorHandler";
import { useSearchParams } from "react-router-dom";

const ReferralConnect = () => {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams?.get("referralCode");
  const params = {
    referralCode,
  };
  const discordAuthUrl = getDiscordUrl(
    "/discord/callback/cmty-user-connect",
    `&state=${encodeURIComponent(JSON.stringify(params))}`
  );

  const cmtyUserToken = localStorage.getItem("cmtyUserToken");
  const [getOrgByReferralCode, { data: orgData }] = useLazyQuery(GET_ORG_BY_REFERRAL_CODE);
  const [getOrgDiscordInviteLink, { data: orgDiscordInviteLinkData }] = useLazyQuery(GET_ORG_DISCORD_INVITE_LINK);

  useEffect(() => {
    if (referralCode) {
      getOrgByReferralCode({
        variables: {
          referralCode,
        },
      });
    }
  }, [referralCode]);

  const org = orgData?.getOrgByReferralCode;
  console.log("org", org);
  const { handleError } = useErrorHandler();

  const handleConnectDiscord = () => {
    window.open(discordAuthUrl);
  };

  const link = orgDiscordInviteLinkData?.getOrgDiscordInviteLink?.link;
  return (
    <PageWrapper
      containerProps={{
        sx: {
          justifyContent: "center",
        },
      }}
      bgType={BG_TYPES.VIEW_QUESTS}
    >
      <Grid
        justifyContent="center"
        alignItems="center"
        display="flex"
        width={{
          xs: "100%",
          md: "70%",
        }}
        height="100%"
        padding={{
          xs: "70px 0px 0px 0px",
          md: "70px",
        }}
      >
        <StyledLink to="/">
          <img src="/images/wonder-logo-3.svg" />
        </StyledLink>

        <Grid
          width={{
            xs: "100%",
            md: "90%",
          }}
          height="100%"
        >
          <Grid
            position="relative"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            bgcolor="white"
            borderRadius={{
              xs: "0px",
              md: "32px 0px 0px 0px",
            }}
            paddingTop="42px"
            paddingBottom="24px"
            gap="24px"
          >
            <Box display="flex" flexDirection="column" gap="12px" alignItems="center" width="100%">
              <OrgProfilePicture
                profilePicture={org?.profilePicture}
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "100%",
                }}
              />
              <TextLabel>{org?.name}</TextLabel>
              <Divider
                sx={{
                  width: "100%",
                  marginTop: "20px",
                  height: "1px",
                  backgroundColor: "#EAEAEA",
                }}
              />
            </Box>
            <TextLabel weight={600} color="#846AFF">
              Referral link
            </TextLabel>
            <TextLabel weight={600} fontSize="24px">
              You have been invited to {org?.name}
            </TextLabel>
            <ImageComponent src="/images/view-quest-artwork.png" />
            <TextLabel color="#2A8D5C" fontSize="16px" weight={600}>
              Connect your Discord to join the community and earn rewards!
            </TextLabel>
            <SharedSecondaryButton onClick={handleConnectDiscord}>Connect your Discord</SharedSecondaryButton>
            <Box
              height="42px"
              width="52px"
              borderRadius="0px 32px 0px 0px"
              position="absolute"
              bgcolor="white"
              top="0"
              display={{
                xs: "none",
                md: "block",
              }}
              right="-52px"
            >
              <Box height="100%" width="100%" bgcolor="#AF9EFF" borderRadius="32px 32px 0px 0px" />
            </Box>
          </Grid>
          <Box
            display={{
              xs: "none",
              md: "block",
            }}
            height="42px"
            width="100%"
            bgcolor="#AF9EFF"
            position="relative"
            borderRadius="0px 0px 32px 0px"
          >
            <Box
              height="100%"
              width="100%"
              bgcolor="#AF9EFF"
              position="absolute"
              left="-10%"
              borderRadius="0px 0px 0px 32px"
            />
            <Box
              bgcolor="white"
              height="100%"
              width="84px"
              position="absolute"
              right="0"
              borderRadius="0px 0px 32px 32px"
            />
          </Box>
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default ReferralConnect;
