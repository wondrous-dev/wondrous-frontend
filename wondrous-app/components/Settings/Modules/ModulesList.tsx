import { Box, Typography } from '@mui/material';
import palette from 'theme/palette';
import ModulesListItem from './ModulesListItem';

const ModulesList = ({ modulesData, setModulesData }) => {
  const handleSetModuleActiveStatus = (module) => {
    setModulesData((prev) => {
      const { active, ...rest } = prev[module];
      return {
        ...prev,
        [module]: {
          ...rest,
          active: !active,
        },
      };
    });
  };

  const activeModules = Object.keys(modulesData).filter((module) => modulesData[module].active);
  const inactiveModules = Object.keys(modulesData).filter((module) => !modulesData[module].active);

  return (
    <Box display="flex" flexDirection="column" gap="24px" width="100%">
      {Boolean(activeModules.length) && (
        <Box display="flex" gap="14px" flexDirection="column">
          <Typography color={palette.white} fontWeight="700" fontSize="13px">
            Active features
          </Typography>

          <Box
            borderRadius="12px"
            overflow="hidden"
            sx={{
              outline: '1px solid #2A2A2A', // TODO: add color to palette
            }}
          >
            {activeModules.map((module) => {
              const { Icon, count = 0 } = modulesData[module];
              return (
                <ModulesListItem
                  key={module}
                  handleOnClick={() => handleSetModuleActiveStatus(module)}
                  buttonStatus="remove"
                  moduleName={module}
                  ModuleIcon={Icon}
                  createdCount={count}
                />
              );
            })}
          </Box>
        </Box>
      )}
      {Boolean(inactiveModules.length) && (
        <Box display="flex" gap="14px" flexDirection="column">
          <Typography color={palette.white} fontWeight="700" fontSize="13px">
            Inactive features
          </Typography>
          <Box
            borderRadius="12px"
            overflow="hidden"
            sx={{
              outline: '1px solid #2A2A2A', // TODO: add color to palette
            }}
          >
            {inactiveModules.map((module) => {
              const { Icon, createdCount = 0 } = modulesData[module];
              return (
                <ModulesListItem
                  key={module}
                  handleOnClick={() => handleSetModuleActiveStatus(module)}
                  buttonStatus="add"
                  moduleName={module}
                  ModuleIcon={Icon}
                  createdCount={createdCount}
                />
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ModulesList;
