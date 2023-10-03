import TeamSettings from "components/Settings/TeamSettings";
import SettingsLayout from "components/Shared/SettingsLayout";

const SettingsPage = () => {
  return (
    <>
      <SettingsLayout title="Team Settings">
        <TeamSettings />
      </SettingsLayout>
    </>
  );
};

export default SettingsPage;
