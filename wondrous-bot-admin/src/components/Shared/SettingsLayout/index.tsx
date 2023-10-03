import PageHeader from "components/PageHeader";
import { MenuSwitcher } from "components/Settings";
import TeamSettings from "components/Settings/TeamSettings";
import PageWrapper from "components/Shared/PageWrapper";
import { BG_TYPES } from "utils/constants";

const SettingsLayout = ({ children, title, headerProps = {} }) => {
  return (
    <>
      <PageHeader title={title} 
      {...headerProps}
      />
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
        {children}
      </PageWrapper>
    </>
  );
};

export default SettingsLayout;
