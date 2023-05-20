import { Box, ButtonBase, Dialog, Typography } from '@mui/material';
import { WarningIcon } from 'components/Icons/WarningIcon';
import PrivacyMembersIcon from 'components/Icons/privacyMembers.svg';
import palette from 'theme/palette';
import pluralize from 'pluralize';

const ModulesWarningDialog = ({ open, setOpen, modulesData, deactivatedModules, handleWarningDialogDeactivate }) => {
  const handleOnClickCancel = () => setOpen(false);
  const handleOnClickDeactivate = () => {
    setOpen(false);
    handleWarningDialogDeactivate();
  };

  return (
    <Dialog
      open={open}
      onClose={handleOnClickCancel}
      PaperProps={{
        sx: {
          border: `1px solid ${palette.grey58}`,
          backgroundColor: palette.grey920,
        },
      }}
    >
      <Box width="fit-content" bgcolor={palette.grey920}>
        <Box display="flex" padding="24px" gap="24px">
          <Box
            minWidth="42px"
            width="42px"
            height="42px"
            borderRadius="100%"
            bgcolor={palette.grey910}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <WarningIcon />
          </Box>
          <Box display="flex" gap="18px" flexDirection="column">
            <Box display="flex" gap="8px" flexDirection="column">
              <Typography color={palette.white} fontWeight="600" fontSize="16px">
                Are you sure you want to deactivate these features?
              </Typography>
              <Typography color={palette.grey250} fontSize="14px">
                Members will lose access to all items under these features. This can be reversed by reactivating the
                features again.
              </Typography>
            </Box>
            <Box borderRadius="6px" overflow="hidden">
              {deactivatedModules.map((module) => {
                const { Icon, count = 0, active } = modulesData[module];
                if (active) return null;
                return (
                  <Box
                    key={module}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    bgcolor={palette.grey900}
                    padding="8px"
                    borderBottom={`1px solid ${palette.black92}`}
                    sx={{
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap="14px">
                      <Box
                        minWidth="24px"
                        height="24px"
                        width="24px"
                        bgcolor={palette.grey87}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="4px"
                        sx={{
                          '& svg': {
                            path: {
                              stroke: palette.red650,
                            },
                            rect: {
                              stroke: palette.red650,
                            },
                          },
                        }}
                      >
                        <Icon />
                      </Box>
                      <Typography color={palette.white} fontWeight="600" fontSize="16px" textTransform="capitalize">
                        {module}
                      </Typography>
                    </Box>
                    <Box
                      bgcolor={palette.grey87}
                      padding="4px"
                      borderRadius="4px"
                      display="flex"
                      alignItems="center"
                      width="fit-content"
                      gap="6px"
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        sx={{
                          transform: 'scale(0.71)',
                          '& svg': {
                            path: {
                              stroke: palette.red650,
                            },
                          },
                        }}
                      >
                        <PrivacyMembersIcon />
                      </Box>
                      <Typography fontWeight="500" fontSize="13px" color={palette.grey250}>
                        {count} {pluralize('item', count)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
        <Box bgcolor={palette.grey910} padding="24px" display="flex" justifyContent="flex-end" gap="12px" width="100%">
          <ButtonBase
            onClick={handleOnClickCancel}
            sx={{
              color: palette.white,
              fontWeight: 600,
              fontSize: '15px',
              bgcolor: palette.grey87,
              padding: '8px 24px',
              width: 'fit-content',
              borderRadius: '35px',
            }}
          >
            Cancel
          </ButtonBase>
          <ButtonBase
            onClick={handleOnClickDeactivate}
            sx={{
              color: palette.white,
              fontWeight: 600,
              fontSize: '15px',
              bgcolor: palette.highlightPurple,
              padding: '8px 24px',
              width: 'fit-content',
              borderRadius: '35px',
            }}
          >
            Deactivate
          </ButtonBase>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ModulesWarningDialog;
