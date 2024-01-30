import { Grid } from "@mui/material";
import CmtyUserHeader from "./Header";
import FooterComponent from "./Footer";
import ProfilePanel from "./Components/ProfilePanel";
import BadgesPanel from "./Components/BadgesPanel";
import PurchasesTable from "./Components/PurchasesTable";
import Submissions from "./Components/Submissions";
import { useQuery } from "@apollo/client";
import { GET_CMTY_USER_ACTIVITY_STATS } from "graphql/queries";

const CmtyUserActivityComponent = ({ cmtyUser, org }) => {
  const { data, loading, error } = useQuery(GET_CMTY_USER_ACTIVITY_STATS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    variables: {
      cmtyUserId: cmtyUser?.id,
      orgId: org?.id,
    },
    skip: !cmtyUser?.id || !org?.id,
  });

  return (
    <Grid display="flex" flexDirection="column" position="relative" minHeight="100vh">
      <CmtyUserHeader org={org} />
      <Grid
        padding="24px 24px 42px 24px"
        flex="1"
        display="flex"
        direction="column"
        alignItems="flex-start"
        gap="32px"
        bgcolor="#FFFFFF"
        height="100%"
        width="100%"
        position="relative"
      >
        <ProfilePanel cmtyUser={cmtyUser} stats={data?.getCmtyUserActivityStats} />
        <BadgesPanel count={data?.getCmtyUserActivityStats?.badges} cmtyUser={cmtyUser} org={org} />
        <PurchasesTable count={data?.getCmtyUserActivityStats?.purchases} orgId={org?.id} cmtyUserId={cmtyUser?.id} />
        <Submissions count={data?.getCmtyUserActivityStats?.submissions} cmtyUserId={cmtyUser?.id} orgId={org?.id} />
      </Grid>
      <FooterComponent />
    </Grid>
  );
};

export default CmtyUserActivityComponent;
