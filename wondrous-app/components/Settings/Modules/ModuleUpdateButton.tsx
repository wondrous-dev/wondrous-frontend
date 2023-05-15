import { useMutation } from '@apollo/client';
import { Box, ButtonBase } from '@mui/material';
import { UPDATE_ORG_MODULES } from 'graphql/mutations';
import palette from 'theme/palette';

const ModuleUpdateButton = ({ modulesData, orgId }) => {
  const input = {};

  Object.keys(modulesData).forEach((module) => {
    input[module] = modulesData[module].active;
  });

  const [updateOrgModules] = useMutation(UPDATE_ORG_MODULES, {
    refetchQueries: ['getOrgByUsername', 'getOrgById'],
    variables: {
      orgId,
      input,
    },
  });

  const handleOnClick = () => updateOrgModules();

  return (
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
        onClick={handleOnClick}
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
  );
};

export default ModuleUpdateButton;
