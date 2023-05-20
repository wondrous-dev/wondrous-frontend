import { useMutation } from '@apollo/client';
import { Box, ButtonBase } from '@mui/material';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { UPDATE_ORG_MODULES } from 'graphql/mutations';
import { useContext } from 'react';
import palette from 'theme/palette';

const ModuleUpdateButton = ({ modulesData, orgId }) => {
  const { setSnackbarAlertMessage, setSnackbarAlertOpen, setSnackbarAlertSeverity } = useContext(SnackbarAlertContext);
  const input = Object.keys(modulesData).reduce((acc, module) => {
    acc[module] = modulesData[module].active;
    return acc;
  }, {});

  const [updateOrgModules] = useMutation(UPDATE_ORG_MODULES, {
    refetchQueries: ['getOrgByUsername', 'getOrgById'],
    variables: {
      orgId,
      input,
    },
    onCompleted: () => {
      setSnackbarAlertMessage('Modules updated successfully');
      setSnackbarAlertOpen(true);
    },
    onError: () => {
      setSnackbarAlertMessage('Something went wrong');
      setSnackbarAlertSeverity('error');
      setSnackbarAlertOpen(true);
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
          cursor: 'pointer',
        }}
      >
        Update Workspace
      </ButtonBase>
    </Box>
  );
};

export default ModuleUpdateButton;
