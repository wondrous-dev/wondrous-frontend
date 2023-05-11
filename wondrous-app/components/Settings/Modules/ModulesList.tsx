import { Box, Typography } from '@mui/material';
import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import { useState } from 'react';
import palette from 'theme/palette';
import { ENTITIES_TYPES } from 'utils/constants';
import { useSettings } from 'utils/hooks';
import ModulesListItem from './ModulesListItem';

const ModulesList = () => {
  const settingsData = useSettings();
  const { modules } = settingsData?.pod ?? settingsData?.org ?? {};
  const isModuleActive = (module) => {
    // Defaults to true if the module is null or undefined;
    const moduleStatus = modules?.[module];
    return moduleStatus || moduleStatus === null || moduleStatus === undefined;
  };
  const [modulesData, setModulesData] = useState({
    [ENTITIES_TYPES.POD]: {
      active: isModuleActive([ENTITIES_TYPES.POD]),
      ModuleIcon: CheckBoxIcon,
      createdCount: 0,
    },
    [ENTITIES_TYPES.TASK]: {
      active: isModuleActive([ENTITIES_TYPES.TASK]),
      ModuleIcon: CheckBoxIcon,
      createdCount: 0,
    },
    [ENTITIES_TYPES.BOUNTY]: {
      active: isModuleActive([ENTITIES_TYPES.BOUNTY]),
      ModuleIcon: CheckBoxIcon,
      createdCount: 0,
    },
    [ENTITIES_TYPES.MILESTONE]: {
      active: isModuleActive([ENTITIES_TYPES.MILESTONE]),
      ModuleIcon: CheckBoxIcon,
      createdCount: 0,
    },
    [ENTITIES_TYPES.PROPOSAL]: {
      active: isModuleActive([ENTITIES_TYPES.PROPOSAL]),
      ModuleIcon: CheckBoxIcon,
      createdCount: 0,
    },
    [ENTITIES_TYPES.GRANT]: {
      active: isModuleActive([ENTITIES_TYPES.GRANT]),
      ModuleIcon: CheckBoxIcon,
      createdCount: 0,
    },

    [ENTITIES_TYPES.COLLAB]: {
      active: isModuleActive([ENTITIES_TYPES.COLLAB]),
      ModuleIcon: CheckBoxIcon,
      createdCount: 0,
    },

    Docs: {
      active: isModuleActive('Docs'),
      ModuleIcon: CheckBoxIcon,
      createdCount: 0,
    },
  });

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
            const { ModuleIcon, createdCount } = modulesData[module];
            return (
              <ModulesListItem
                key={module}
                handleOnClick={() => handleSetModuleActiveStatus(module)}
                buttonStatus="remove"
                moduleName={module}
                ModuleIcon={ModuleIcon}
                createdCount={createdCount}
              />
            );
          })}
        </Box>
      </Box>
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
            const { ModuleIcon, createdCount } = modulesData[module];
            return (
              <ModulesListItem
                key={module}
                handleOnClick={() => handleSetModuleActiveStatus(module)}
                buttonStatus="add"
                moduleName={module}
                ModuleIcon={ModuleIcon}
                createdCount={createdCount}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ModulesList;
