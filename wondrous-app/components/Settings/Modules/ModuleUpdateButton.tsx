import { useMutation } from '@apollo/client';
import { Box, ButtonBase } from '@mui/material';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { UPDATE_ORG_MODULES, UPDATE_POD_MODULES } from 'graphql/mutations';
import dynamic from 'next/dynamic';
import { useContext, useState } from 'react';
import palette from 'theme/palette';

const ModulesWarningDialog = dynamic(() => import('./ModulesWarningDialog'));

const useMutationUpdateModules = ({ orgId, podId, modulesData }) => {
  const { setSnackbarAlertMessage, setSnackbarAlertOpen, setSnackbarAlertSeverity } = useContext(SnackbarAlertContext);

  const onCompleted = () => {
    setSnackbarAlertMessage('Modules updated successfully');
    setSnackbarAlertSeverity('success');
    setSnackbarAlertOpen(true);
  };

  const onError = () => {
    setSnackbarAlertMessage('Something went wrong');
    setSnackbarAlertSeverity('error');
    setSnackbarAlertOpen(true);
  };

  const input = Object.keys(modulesData).reduce((acc, module) => {
    acc[module] = modulesData[module].active;
    return acc;
  }, {});

  const [updateOrgModules] = useMutation(UPDATE_ORG_MODULES, {
    refetchQueries: ['getOrgFromUsername', 'getOrgById'],
    variables: {
      orgId,
      input,
    },
    onCompleted,
    onError,
  });

  const [updatePodModules] = useMutation(UPDATE_POD_MODULES, {
    refetchQueries: ['getPodById'],
    variables: {
      podId,
      input,
    },
    onCompleted,
    onError,
  });

  return podId ? updatePodModules : updateOrgModules;
};

const ModuleUpdateButton = ({ modulesData, orgId, podId, onSubmit }) => {
  const [openWarningDialog, setOpenWarningDialog] = useState(false);

  const alteredModules = Object.keys(modulesData).filter((module) => {
    const { active, initialActiveState } = modulesData[module];
    return initialActiveState !== undefined && initialActiveState !== active;
  });

  const deactivatedModules = alteredModules.filter((module) => {
    const { active, initialActiveState } = modulesData[module];
    return initialActiveState !== undefined && !active;
  });

  const updateModules = useMutationUpdateModules({ orgId, podId, modulesData });

  const handleUpdateWorkspace = () => {
    if (deactivatedModules.length > 0) {
      setOpenWarningDialog(true);
      return;
    }
    updateModules().then(() => onSubmit());
  };

  const handleWarningDialogDeactivate = () => {
    updateModules().then(() => onSubmit());
  };

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
