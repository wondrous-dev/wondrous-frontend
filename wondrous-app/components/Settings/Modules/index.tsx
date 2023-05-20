import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import useBuildModulesData from 'hooks/modules/useBuildModulesData';
import { useState } from 'react';
import palette from 'theme/palette';
import { useSettings } from 'utils/hooks';
import ModuleUpdateButton from './ModuleUpdateButton';
import ModulesList from './ModulesList';

const ModulesSettingsComponent = ({ data, orgId }) => {
  const [modulesData, setModulesData] = useState(data);
  const handleOnClickActiveStatus = (module) => {
    setModulesData((prev) => {
      const { active, ...rest } = prev[module];
      const { active: initialActiveState } = data[module];
      return {
        ...prev,
        [module]: {
          ...rest,
          active: !active,
          initialActiveState,
        },
      };
    });
  };
  const stateIsAltered = Object.keys(modulesData).some((module) => {
    const { active, initialActiveState } = modulesData[module];
    return initialActiveState !== undefined && initialActiveState !== active;
  });
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      paddingBottom="24px"
      alignItems="center"
      position="relative"
    >
      <Box display="flex" flexDirection="column" gap="24px" alignItems="center" width="90%">
        <Box
          display="flex"
          flexDirection="column"
          gap="12px"
          paddingY="24px"
          borderBottom={`1px solid ${palette.black92}`}
          width="100%"
        >
          <Typography color={palette.white} fontWeight="500" fontSize="26px">
            Workspace Modules
          </Typography>
          <Typography color={palette.grey250} fontSize="14px">
            Customize your workspace to only show the features your project uses.
          </Typography>
        </Box>
        <ModulesList modulesData={modulesData} handleOnClickActiveStatus={handleOnClickActiveStatus} />
      </Box>
      {stateIsAltered && (
        <Box position="fixed" width="80%" bottom="10px" margin="0 auto">
          <ModuleUpdateButton modulesData={modulesData} orgId={orgId} />
        </Box>
      )}
    </Box>
  );
};

const ModulesSettings = () => {
  const settingsData = useSettings();
  const { id: podId } = settingsData?.pod || {};
  const { id: orgId } = settingsData?.org || {};
  const initialData = useBuildModulesData({ orgId, podId });
  if (!initialData) return null;

  return <ModulesSettingsComponent data={initialData} orgId={orgId} />;
};

export default ModulesSettings;
