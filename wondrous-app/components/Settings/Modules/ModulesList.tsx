import { Box, Typography } from '@mui/material';
import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import palette from 'theme/palette';
import ModulesListItem from './ModulesListItem';

const ModulesList = () => (
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
        <ModulesListItem status="remove" moduleName="milestones" ModuleIcon={CheckBoxIcon} createdCount={100} />
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
          outline: '1px solid #2A2A2A',
        }}
      >
        <ModulesListItem status="add" moduleName="tasks" ModuleIcon={CheckBoxIcon} createdCount={1} />
      </Box>
    </Box>
  </Box>
);

export default ModulesList;
