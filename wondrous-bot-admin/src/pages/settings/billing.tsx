import BillingSettings from "components/Settings/Billing";
import SettingsLayout from "components/Shared/SettingsLayout";

const SettingsPage = () => {
  return (
    <>
      <SettingsLayout title="Billing">
        <BillingSettings />
      </SettingsLayout>
    </>
  );
};

export default SettingsPage;
