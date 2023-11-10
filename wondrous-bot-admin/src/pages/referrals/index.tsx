import { Box } from "@mui/material";
import PageHeader from "components/PageHeader";
import ReferralsList from "components/ReferralsList";
import { SharedBlackOutlineButton, SharedSecondaryButton } from "components/Shared/styles";
import { useNavigate } from "react-router-dom";

const ReferralsPage = () => {
  const navigate = useNavigate();

  const handleNewReferral = () => navigate("/referrals/create");

  return (
    <>
      <PageHeader
        title={`0 Referrals`}
        withBackButton={false}
        renderActions={() => (
          <Box display="flex" gap="10px" width="100%" alignItems="center">
            <SharedSecondaryButton onClick={handleNewReferral}>New Referral</SharedSecondaryButton>
          </Box>
        )}
      />
      <ReferralsList />
    </>
  );
};

export default ReferralsPage;
