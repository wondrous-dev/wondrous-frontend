import { useMutation } from '@apollo/client';
import { Box, ButtonBase } from '@mui/material';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { UPDATE_ORG_MODULES } from 'graphql/mutations';
import dynamic from 'next/dynamic';
import { useContext, useState } from 'react';
import palette from 'theme/palette';

const ModulesWarningDialog = dynamic(() => import('./ModulesWarningDialog'));

const ModuleUpdateButton = ({ modulesData, orgId, onSubmit }) => {
  const { setSnackbarAlertMessage, setSnackbarAlertOpen, setSnackbarAlertSeverity } = useContext(SnackbarAlertContext);
  const [openWarningDialog, setOpenWarningDialog] = useState(false);

  const alteredModules = Object.keys(modulesData).filter((module) => {
    const { active, initialActiveState } = modulesData[module];
    return initialActiveState !== undefined && initialActiveState !== active;
  });

  const deactivatedModules = alteredModules.filter((module) => {
    const { active, initialActiveState } = modulesData[module];
    return initialActiveState !== undefined && !active;
  });

  const [updateOrgModules] = useMutation(UPDATE_ORG_MODULES, {
    refetchQueries: ['getOrgFromUsername', 'getOrgById'],
    variables: {
      orgId,
      input: Object.keys(modulesData).reduce((acc, module) => {
        acc[module] = modulesData[module].active;
        return acc;
      }, {}),
    },
    onCompleted: () => {
      setSnackbarAlertMessage('Modules updated successfully');
      setSnackbarAlertOpen(true);
      onSubmit();
    },
    onError: () => {
      setSnackbarAlertMessage('Something went wrong');
      setSnackbarAlertSeverity('error');
      setSnackbarAlertOpen(true);
    },
  });

  const handleUpdateWorkspace = () => {
    if (deactivatedModules.length > 0) {
      setOpenWarningDialog(true);
      return;
    }
    updateOrgModules();
  };

  const handleWarningDialogDeactivate = () => updateOrgModules();

  return (
    <>
      <ModulesWarningDialog
        open={openWarningDialog}
        setOpen={setOpenWarningDialog}
        modulesData={modulesData}
        deactivatedModules={deactivatedModules}
        handleWarningDialogDeactivate={handleWarningDialogDeactivate}
      />
      {Boolean(alteredModules.length) && (
        <Box position="fixed" width="80%" bottom="10px" margin="0 auto">
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
              onClick={handleUpdateWorkspace}
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
        </Box>
      )}
    </>
  );
};

export default ModuleUpdateButton;
