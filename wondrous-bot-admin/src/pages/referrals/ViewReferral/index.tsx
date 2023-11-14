import { useQuery } from "@apollo/client";
import { Box, Grid, Typography } from "@mui/material";
import {
  ImageContainer,
  ImageDefault,
  HoveredImage,
  HeaderBar,
  TutorialButton,
  TutorialLink,
} from "components/Navbar/styles";
import PageSpinner from "components/PageSpinner";
import PageWrapper from "components/Shared/PageWrapper";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import { StyledLink } from "components/ViewQuest/styles";
import ViewRefferal from "components/ViewReferral";
import { GET_REFERRAL_CAMPAIGN_BY_ID } from "graphql/queries/referral";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { BG_TYPES } from "utils/constants";

const ViewReferralPage = () => {
  let { id, ...rest } = useParams();
  const { data, loading, refetch } = useQuery(GET_REFERRAL_CAMPAIGN_BY_ID, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    variables: {
      referralCampaignId: id,
    },
  });
  return (
    <>
      <HeaderBar>
        <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
          <StyledLink to="/" style={{ position: "relative" }}>
            <ImageContainer>
              <ImageDefault src="/wonder.svg" />
              <HoveredImage src="/wonder-colored.svg" />
            </ImageContainer>
          </StyledLink>
          <Box flex="1" />
          <TutorialLink href="https://wonderverse.gitbook.io/wonder-communities/" target="_blank">
            <TutorialButton>?</TutorialButton>
          </TutorialLink>
        </Box>
      </HeaderBar>

      <PageWrapper
        containerProps={{
          sx: {
            justifyContent: "center",
            backgroundImage: "none",
            marginTop: "182px",
            flexDirection: "column",
            overflow: "hidden"
          },
        }}
        bgType={BG_TYPES.VIEW_QUESTS}
      >
        <Grid justifyContent="center" alignItems="center" display="flex" height="100%" width="100%" flexDirection="column" flex="1">
          {/* <Link to="/"> */}
          {!data?.getReferralCampaignById || loading ? (
            <PageSpinner color="#fee2ca" />
          ) : (
            <ViewRefferal referralCampaign={data?.getReferralCampaignById} />
          )}
        </Grid>
      </PageWrapper>
    </>
  );
};

export default ViewReferralPage;
