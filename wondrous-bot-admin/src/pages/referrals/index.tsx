import { useQuery } from "@apollo/client";
import { Box } from "@mui/material";
import PageHeader from "components/PageHeader";
import ReferralsList from "components/ReferralsList";
import { SharedBlackOutlineButton, SharedSecondaryButton } from "components/Shared/styles";
import { GET_REFERRAL_CAMPAIGN_FOR_ORG } from "graphql/queries/referral";
import { useNavigate } from "react-router-dom";
import { LIMIT, REFERRAL_STATUSES } from "utils/constants";
import { useGlobalContext } from "utils/hooks";

const ReferralsPage = () => {
  const navigate = useNavigate();
  const { activeOrg } = useGlobalContext();
  const { data, fetchMore, refetch, loading } = useQuery(GET_REFERRAL_CAMPAIGN_FOR_ORG, {
    variables: {
      input: {
        orgId: activeOrg?.id,
        limit: LIMIT,
        offset: 0,
        statuses: [REFERRAL_STATUSES.ACTIVE, REFERRAL_STATUSES.INACTIVE],
      },
    },
  });

  const handleNewReferral = () => navigate("/referrals/create");

  return (
    <>
      <PageHeader
        title={`${data?.getReferralCampaignForOrg?.total || 0} Referrals`}
        withBackButton={false}
        renderActions={() => (
          <Box display="flex" gap="10px" width="100%" alignItems="center">
            <SharedSecondaryButton onClick={handleNewReferral}>New Referral</SharedSecondaryButton>
          </Box>
        )}
      />
      <ReferralsList data={data?.getReferralCampaignForOrg?.items} refetch={refetch} fetchMore={fetchMore} />
    </>
  );
};

export default ReferralsPage;
