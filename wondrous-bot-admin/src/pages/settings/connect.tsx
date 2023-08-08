import ConnectBotComponent from "components/ConnectBotComponent";
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
        <ConnectBotComponent />
      </PageWrapper>
    </>
  );
};

export default ConnectPage;
