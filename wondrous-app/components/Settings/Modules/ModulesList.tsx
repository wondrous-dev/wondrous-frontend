import { Box, Typography } from '@mui/material';
import palette from 'theme/palette';
import ModulesListItem from './ModulesListItem';

const ModulesList = ({ modulesData, handleOnClickActiveStatus }) => {
  const modulesStatuses = {
    active: {
      label: 'Active features',
      items: Object.keys(modulesData).filter((module) => modulesData[module].active),
    },
    inactive: {
      label: 'Inactive features',
      items: Object.keys(modulesData).filter((module) => !modulesData[module].active),
    },
  };

  return (
    <Box display="flex" flexDirection="column" gap="24px" width="100%">
      {Object.keys(modulesStatuses).map((status, index) => {
        const { label, items } = modulesStatuses[status];
        if (items.length === 0) return null;
        return (
          <Box display="flex" gap="14px" flexDirection="column" key={status}>
            <Typography color={palette.white} fontWeight="700" fontSize="13px">
              {label}
            </Typography>
            <Box
              borderRadius="12px"
              overflow="hidden"
              sx={{
                outline: '1px solid #2A2A2A', // TODO: add color to palette
              }}
            >
              {items.map((module) => {
                const moduleData = modulesData[module];
                return (
                  <ModulesListItem
                    key={module}
                    handleOnClick={() => handleOnClickActiveStatus(module)}
                    buttonStatus={index === 0 ? 'active' : 'inactive'}
                    moduleName={module}
                    moduleData={moduleData}
                  />
                );
              })}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default ModulesList;
