import CustomizeBanners from "components/Settings/CustomizeBanners";
import SettingsLayout from "components/Shared/SettingsLayout";

const SettingsPage = () => {
  return (
    <>
      <SettingsLayout title="Customize Banners">
        <CustomizeBanners />
      </SettingsLayout>
    </>
  );
};

export default SettingsPage;
