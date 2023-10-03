import PageHeader from "components/PageHeader";
import { MenuSwitcher } from "components/Settings";
import NotificationSettings from "components/Settings/NotificationSettings";
import PageWrapper from "components/Shared/PageWrapper";
import SettingsLayout from "components/Shared/SettingsLayout";
import { BG_TYPES } from "utils/constants";

const SettingsPage = () => {
  return (
    <>
      <SettingsLayout title="Notification Settings">
      <NotificationSettings />
      </SettingsLayout>
    </>
  );
};

export default SettingsPage;
