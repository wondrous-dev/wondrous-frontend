import { Box, ButtonBase } from '@mui/material';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';
import ModulesList from './ModulesList';

const ModulesSettings = () => (
  <Box width="100%" display="flex" flexDirection="column" gap="112px" alignItems="center">
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
      <ModulesList />
    </Box>
    <Box
      bgcolor={palette.grey87}
      display="flex"
      alignItems="center"
      justifyContent="center"
      paddingY="14px"
      borderRadius="6px"
      width="100%"
    >
      <ButtonBase
        disableRipple
        sx={{
          bgcolor: palette.highlightPurple,
          color: palette.white,
          fontWeight: 600,
          fontSize: '15px',
          padding: '8px 24px',
          borderRadius: '35px',
        }}
      >
        Update Workspace
      </ButtonBase>
    </Box>
  </Box>
);

export default ModulesSettings;
