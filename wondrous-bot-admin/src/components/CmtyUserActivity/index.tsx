import { Grid } from "@mui/material";
import CmtyUserHeader from "./Header";
import FooterComponent from "./Footer";
import ProfilePanel from "./Components/ProfilePanel";
import BadgesPanel from "./Components/BadgesPanel";
import PurchasesTable from "./Components/PurchasesTable";
import SubmissionsTable from "./Components/SubmissionsTable";

const CmtyUserActivityComponent = ({ cmtyUserId }) => {
  return (
    <Grid display="flex" flexDirection="column" position="relative" minHeight="100vh">
      <CmtyUserHeader />
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
        <ProfilePanel />
        <BadgesPanel />
        <PurchasesTable />
        <SubmissionsTable />
      </Grid>
      <FooterComponent />
    </Grid>
  );
};

export default CmtyUserActivityComponent;
