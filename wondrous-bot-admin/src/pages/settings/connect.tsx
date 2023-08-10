import { Grid } from "@mui/material";
import ConnectBotComponent from "components/ConnectBotComponent";
import { SharedLabel } from "components/ConnectBotComponent/styles";
import PageHeader from "components/PageHeader";
import { MenuSwitcher } from "components/Settings";
import PageWrapper from "components/Shared/PageWrapper";
import { BG_TYPES } from "utils/constants";

//TODO - add shared component
const ConnectPage = () => {
  return (
    <>
      <PageHeader title="Connect Bot" />
      <PageWrapper
        bgType={BG_TYPES.DEFAULT}
        containerProps={{
          direction: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          minHeight: "100vh",
          gap: "24px",
          padding: {
            xs: "14px 14px 120px 14px",
            sm: "24px 56px 150px 24px",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <MenuSwitcher />
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
      </PageWrapper>
    </>
  );
};

export default ConnectPage;
