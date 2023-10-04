import PageHeader from "components/PageHeader";
import { MenuSwitcher, OrgDetails } from "components/Settings";
import PageWrapper from "components/Shared/PageWrapper";
import SettingsLayout from "components/Shared/SettingsLayout";
import { BG_TYPES } from "utils/constants";

const SettingsPage = () => {
  return (
    <>
      <SettingsLayout title="Settings">
        <OrgDetails />
      </SettingsLayout>
    </>
  );
};

export default SettingsPage;
