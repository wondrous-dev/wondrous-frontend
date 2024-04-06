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
import { ADD_CMTY_USER_TO_ORG } from "graphql/mutations";

const MemberAddBody = ({ onClose }) => {
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAnchorOrigin, setSnackbarAlertSeverity } = useAlerts();
  const [addCmtyUserToOrg] = useMutation(ADD_CMTY_USER_TO_ORG, {
    onCompleted: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage("Success!");
      setSnackbarAlertAnchorOrigin({
        vertical: "top",
        horizontal: "center",
      });
      onClose();
    },
    onError: (error) => {
      setError('Could not find the Discord user in the server');
    },
    refetchQueries: ["getCmtyUsersForOrg", "searchCmtyUsersForOrg"],
  });
  const { activeOrg } = useContext(GlobalContext);
  const [discordUsername, setDiscordUsername] = useState("");
  const [points, setPoints] = useState("");
  const [error, setError] = useState("");

  return (
    <Grid display="flex" flexDirection="column" gap="10px">
      <Box></Box>
      <Box>
        <Label
          style={{
            marginBottom: "10px",
          }}
        >
          Discord Username
        </Label>
        <TextField
          placeholder="Enter Discord Username without discriminator"
          value={discordUsername}
          onChange={(value) => {
            setDiscordUsername(value);
          }}
          multiline={false}
          // style={TextInputStyle}
        />
        <Label
          style={{
            marginTop: "20px",
            marginBottom: "10px",
          }}
        >
          Starting Points
        </Label>
        <TextField
          placeholder="Enter Discord Username without discriminator"
          number
          value={points}
          onChange={(value) => {
            setPoints(value);
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
            setError("");
            if (!discordUsername) {
              setError("Discord Username is required");
              return;
            }
            if (points) {
              const integerPoints = parseInt(points);
              if (!integerPoints || integerPoints < 0) {
                setError("Points must be a positive integer");
                return;
              }
            }
            addCmtyUserToOrg({
              variables: {
                orgId: activeOrg?.id,
                discordUsername,
                points: parseInt(points),
              },
            });

          }}
        >
          Add Member
        </SharedSecondaryButton>
      </Box>
    </Grid>
  );
};
const MemberAddModal = ({ openMemberAddModal, setOpenMemberAddModal }) => {
  return (
    <>
      <Modal
        maxWidth={600}
        open={openMemberAddModal}
        onClose={() => setOpenMemberAddModal(false)}
        title={"Add discord user to community"}
      >
        <MemberAddBody onClose={() => setOpenMemberAddModal(false)} />
      </Modal>
    </>
  );
};

export default MemberAddModal;
