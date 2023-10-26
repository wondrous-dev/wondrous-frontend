import { Box, Grid, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { Label } from "components/CreateTemplate/styles";
import { SharedSecondaryButton } from "components/Shared/styles";
import Modal from "components/Shared/Modal";
import { useMutation } from "@apollo/client";
import useAlerts from "utils/hooks";
import TextField from "components/Shared/TextField";
import GlobalContext from "utils/context/GlobalContext";
import { redColors } from "utils/theme/colors";
import { RESET_ORG_CMTY_USER_POINTS, RESET_ORG_CMTY_USER_POINT_BALANCE } from "graphql/mutations";
const RESET_TEXT = "RESET";

const ResetPointsModalBody = ({ onClose, pointsBalance }) => {
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAnchorOrigin } = useAlerts();
  const [resetPoints] = useMutation(RESET_ORG_CMTY_USER_POINTS, {
    onCompleted: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage("Success!");
      setSnackbarAlertAnchorOrigin({
        vertical: "top",
        horizontal: "center",
      });
    },
    refetchQueries: ["getCmtyUsersForOrg", "searchCmtyUsersForOrg"],
  });
  const [resetPointBalance] = useMutation(RESET_ORG_CMTY_USER_POINT_BALANCE, {
    onCompleted: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage("Success!");
      setSnackbarAlertAnchorOrigin({
        vertical: "top",
        horizontal: "center",
      });
    },
    refetchQueries: ["getCmtyUsersForOrg", "searchCmtyUsersForOrg"],
  });
  const { activeOrg } = useContext(GlobalContext);
  const [isImportInProgress, setIsImportInProgress] = useState(false);
  const [resetText, setResetText] = useState("");
  const [error, setError] = useState("");

  return (
    <Grid display="flex" flexDirection="column" gap="10px">
      <Typography fontFamily="Poppins" fontWeight={600} fontSize="14px" color="#06040A">
        Please type RESET in all caps to reset points. This action cannot be undone.
      </Typography>
      <Box></Box>
      <Box>
        <Label
          style={{
            marginBottom: "10px",
          }}
        >
          Reset Points {pointsBalance && "Balance"}
        </Label>
        <TextField
          placeholder="Type RESET"
          value={resetText}
          onChange={(value) => {
            setResetText(value);
          }}
          multiline={false}
          // style={TextInputStyle}
        />
      </Box>
      {error && (
        <Typography
          fontFamily={"Poppins"}
          fontWeight={500}
          fontSize="12px"
          lineHeight="14px"
          color={redColors.red400}
          paddingLeft="4px"
        >
          {error}
        </Typography>
      )}

      <Box display="flex" gap="10px" alignItems="center" width="100%" marginTop="8px">
        <SharedSecondaryButton
          sx={{
            flex: 1,
          }}
          $reverse
          onClick={onClose}
        >
          Cancel
        </SharedSecondaryButton>
        <SharedSecondaryButton
          sx={{
            flex: 1,
          }}
          onClick={() => {
            if (resetText === RESET_TEXT) {
              if (pointsBalance && activeOrg?.id) {
                resetPointBalance({
                  variables: {
                    orgId: activeOrg?.id,
                  },
                });
              } else {
                resetPoints({
                  variables: {
                    orgId: activeOrg?.id,
                  },
                });
              }
              onClose();
            } else {
              setError("Text did not match. Please try again");
            }
          }}
        >
          Reset Points {pointsBalance && "Balance"}
        </SharedSecondaryButton>
      </Box>
    </Grid>
  );
};
const ResetPointsModal = ({ openResetPointsModal, setOpenResetPointsModal, pointsBalance }) => {
  return (
    <>
      <Modal
        maxWidth={600}
        open={openResetPointsModal}
        onClose={() => setOpenResetPointsModal(false)}
        title={pointsBalance ? 'Reset member point balances' : 'Reset member points'}
      >
        <ResetPointsModalBody onClose={() => setOpenResetPointsModal(false)} pointsBalance={pointsBalance} />
      </Modal>
    </>
  );
};

export default ResetPointsModal;
