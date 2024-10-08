import { Box, Grid } from "@mui/material";
import {
  ImageContainer,
  ImageDefault,
  HoveredImage,
  TutorialLink,
  TutorialButton,
} from "components/NavigationBar/styles";
import PageSpinner from "components/PageSpinner";
import PageWrapper from "components/Shared/PageWrapper";
import { BG_TYPES } from "utils/constants";
import { StyledLink } from "./styles";
import { useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { GET_REFERRAL_CAMPAIGN_BY_EXTERNAL_ID, GET_REFERRAL_CODE_INFO, GET_REFERRAL_USER_LIMIT_REACHED } from "graphql/queries/referral";
import StartReferralQuests from "components/StartReferralQuests";

const StartReferralPage = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const referralCode = searchParams?.get("referralCode");
  const referralCampaignExternalId = searchParams?.get("referralCampaignExternalId") || null;

  const { data: referralCodeInfoData } = useQuery(GET_REFERRAL_CODE_INFO, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    variables: {
      referralCode,
    },
    skip: !referralCode,
  });

  const { data, loading } = useQuery(GET_REFERRAL_CAMPAIGN_BY_EXTERNAL_ID, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    variables: {
      referralCampaignExternalId,
    },
    skip: !referralCampaignExternalId,
  });

  const {data: referralLimitReached, loading: referralLimitLoading} = useQuery(GET_REFERRAL_USER_LIMIT_REACHED, {
    variables: {
      referralCode,
      referralCampaignExternalId
    },
    skip: !referralCode
  });

  const {hasReachedLimit = false} = referralLimitReached?.getReferralUserLimitReached || {};

  return (
    <>
      <PageWrapper
        containerProps={{
          sx: {
            justifyContent: "center",
            backgroundImage: "none",
            marginTop: '24px',
            flexDirection: "column",
            overflow: "hidden",
          },
        }}
        bgType={BG_TYPES.VIEW_QUESTS}
      >
        <Grid
          justifyContent="center"
          alignItems="center"
          display="flex"
          height="100%"
          width="100%"
          flexDirection="column"
          flex="1"
        >
          {!data?.getReferralCampaignByReferralExternalId || loading || referralLimitLoading ? (
            <PageSpinner color="#fee2ca" />
          ) : (
            <StartReferralQuests
              hasReachedLimit={hasReachedLimit}
              referralCampaign={data?.getReferralCampaignByReferralExternalId}
              referralCode={referralCode}
              referralCodeInfo={referralCodeInfoData?.getReferralCodeInfo}
              referralCampaignExternalId={referralCampaignExternalId}
            />
          )}
        </Grid>
      </PageWrapper>
    </>
  );
};

export default StartReferralPage;
