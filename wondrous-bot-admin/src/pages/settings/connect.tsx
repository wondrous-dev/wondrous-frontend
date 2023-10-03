import { Grid } from "@mui/material";
import ConnectBotComponent from "components/ConnectBotComponent";
import { SharedLabel } from "components/ConnectBotComponent/styles";
import PageHeader from "components/PageHeader";
import { MenuSwitcher } from "components/Settings";
import PageWrapper from "components/Shared/PageWrapper";
import SettingsLayout from "components/Shared/SettingsLayout";
import { BG_TYPES } from "utils/constants";

//TODO - add shared component
const ConnectPage = () => {
  return (
    <>
      <SettingsLayout
        title="Connect Bot"
      >
        <Grid
          flex="1"
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          gap="32px"
          width={{
            xs: "100%",
            sm: "70%",
          }}
        >
          <SharedLabel>You can connect your bot to either or both platforms below.</SharedLabel>

          <ConnectBotComponent />
        </Grid>
      </SettingsLayout>
    </>
  );
};

export default ConnectPage;
