import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import useBuildModulesData from 'hooks/modules/useBuildModulesData';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import palette from 'theme/palette';
import { useSettings } from 'utils/hooks';

const ModuleUpdateButton = dynamic(() => import('./ModuleUpdateButton'));
const ModulesList = dynamic(() => import('./ModulesList'));

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

  const clearAlteredModulesActiveState = () =>
    setModulesData((prev) => {
      const prevCopy = { ...prev };
      Object.keys(prevCopy).forEach((module) => {
        delete prevCopy[module].initialActiveState;
      });
      return prevCopy;
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
      <ModuleUpdateButton modulesData={modulesData} orgId={orgId} onSubmit={clearAlteredModulesActiveState} />
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
