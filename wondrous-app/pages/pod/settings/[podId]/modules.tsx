import ModulesSettings from 'components/Settings/Modules';
import SettingsWrapper from 'components/Common/SidebarSettings';

const PodModulesSettings = () => (
  <SettingsWrapper showPodIcon={false} fullWidth>
    <ModulesSettings />;
  </SettingsWrapper>
);

export default PodModulesSettings;
