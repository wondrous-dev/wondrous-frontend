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
import PageHeader from "components/PageHeader";
import PageSpinner from "components/PageSpinner";
import PageWrapper from "components/Shared/PageWrapper";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import { SharedSecondaryButton } from "components/Shared/styles";
import SingleReferralComponent from "components/SingleReferralComponent";
import SingleReferralPage from "components/SingleReferralComponent";
import { StyledLink } from "components/ViewQuest/styles";
import ViewRefferal from "components/ViewReferral";
import { GET_REFERRAL_CAMPAIGN_BY_ID } from "graphql/queries/referral";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BG_TYPES, REFERRAL_REWARD_SCHEME } from "utils/constants";
import CreateQuestContext from "utils/context/CreateQuestContext";

// const StartReferralPage = () =>  (
//   <>
//     <HeaderBar>
//       <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
//         <StyledLink to="/" style={{ position: "relative" }}>
//           <ImageContainer>
//             <ImageDefault src="/wonder.svg" />
//             <HoveredImage src="/wonder-colored.svg" />
//           </ImageContainer>
//         </StyledLink>
//         <Box flex="1" />
//         <TutorialLink href="https://wonderverse.gitbook.io/wonder-communities/" target="_blank">
//           <TutorialButton>?</TutorialButton>
//         </TutorialLink>
//       </Box>
//     </HeaderBar>

//     <PageWrapper
//       containerProps={{
//         sx: {
//           justifyContent: "center",
//           backgroundImage: "none",
//           marginTop: "182px",
//           flexDirection: "column",
//           overflow: "hidden"
//         },
//       }}
//       bgType={BG_TYPES.VIEW_QUESTS}
//     >
//       <Grid justifyContent="center" alignItems="center" display="flex" height="100%" width="100%" flexDirection="column" flex="1">
//         {/* <Link to="/"> */}
//         {!data?.getReferralCampaignById || loading ? (
//           <PageSpinner color="#fee2ca" />
//         ) : (
//           <ViewRefferal referralCampaign={data?.getReferralCampaignById} />
//         )}
//       </Grid>
//     </PageWrapper>
//   </>
// );

// const DEFAULT_QUEST_SETTINGS = {
//   name: "",
//   description: "",
//   endDate: null,
//   referrerPointReward: null,
//   referredPointReward: null,
//   maxPerUser: null,
//   level: null,
//   status: REFERRAL_STATUSES.ACTIVE,
// };

// const DEFAULT_QUEST_DATA = {
//   type: null,
//   questIds: [null],
//   storeItemId: null,
//   rewards: [],
//   rewardScheme: REFERRAL_REWARD_SCHEME.REFERRER,
// };

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
  const [errors, setErrors] = useState({});

  const referralItem = data?.getReferralCampaignById;
  const headerActionsRef = useRef(null);

  const setRefValue = (value) => (headerActionsRef.current = value);

  const referralItemData = {
    type: referralItem?.type,
    questIds: referralItem?.quests?.map((item) => item.id) || [null],
    storeItemId: referralItem?.storeItem?.id || null,
    rewards: referralItem?.rewards || [],
    rewardScheme: REFERRAL_REWARD_SCHEME.REFERRER,
  };

  const referralItemSettings = {
    name: referralItem?.name,
    description: referralItem?.description,
    endDate: referralItem?.endDate,
    referrerPointReward: referralItem?.referrerPointReward,
    referredPointReward: referralItem?.referredPointReward,
    maxPerUser: referralItem?.maxPerUser,
    level: referralItem?.level,
    status: referralItem?.status,
  };

  return (
    <>
      <CreateQuestContext.Provider
        value={{
          errors,
          setErrors,
        }}
      >
        <PageHeader
          withBackButton
          title="Create Referral"
          renderActions={() => (
            <SharedSecondaryButton onClick={() => headerActionsRef.current?.handleSave()}>
              Save Referral
            </SharedSecondaryButton>
          )}
        />
        {!loading && referralItem ? (
          <SingleReferralComponent
            existingReferralItemData={referralItemData}
            existingReferralItemSettings={referralItemSettings}
            setRefValue={setRefValue}
            referralCampaignId={referralItem?.id}
          />
        ) : (
          <PageSpinner />
        )}
      </CreateQuestContext.Provider>
    </>
  );
};

export default ViewReferralPage;
