import { Box, Grid, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { Label } from "components/CreateTemplate/styles";
import { SharedSecondaryButton } from "components/Shared/styles";
import Modal from "components/Shared/Modal";
import { useMutation } from "@apollo/client";
import useAlerts from "utils/hooks";
import TextField from "components/Shared/TextField";
import GlobalContext from "utils/context/GlobalContext";
import { DELETE_ALL_STORE_ITEM_DISCOUNT_CODES } from "graphql/mutations/cmtyStore";
import { redColors } from "utils/theme/colors";
const RESET_TEXT = "DELETE";

const DeleteDiscountCodesModalBody = ({ onClose, storeItemId }) => {
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAnchorOrigin } = useAlerts();
  const [deleteDiscountCodes] = useMutation(DELETE_ALL_STORE_ITEM_DISCOUNT_CODES, {
    onCompleted: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage("Success!");
      setSnackbarAlertAnchorOrigin({
        vertical: "top",
        horizontal: "center",
      });
    },
    refetchQueries: ["getStoreItemDiscountCodeInfo", "getAllStoreItemDiscountCodes", "getStoreItemDiscountCodeCount"],
  });
  const { activeOrg } = useContext(GlobalContext);
  const [resetText, setResetText] = useState("");
  const [error, setError] = useState("");

  return (
    <Grid display="flex" flexDirection="column" gap="10px">
      <Typography fontFamily="Poppins" fontWeight={600} fontSize="14px" color="#06040A">
        Please type DELETE in all caps to delete discount codes. This action cannot be undone.
      </Typography>
      <Box></Box>
      <Box>
        <Label
          style={{
            marginBottom: "10px",
          }}
        >
          Delete All Discount Codes
        </Label>
        <TextField
          placeholder="Type DELETE"
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
              deleteDiscountCodes({
                variables: {
                  storeItemId,
                },
              });
              onClose();
            } else {
              setError("Text did not match. Please try again");
            }
          }}
        >
          Delete Discount Codes
        </SharedSecondaryButton>
      </Box>
    </Grid>
  );
};
const DeleteDiscountCodesModal = ({ openDeleteDiscountCodesModal, setOpenDeleteDiscountCodesModal, storeItemId }) => {
  return (
    <>
      <Modal
        maxWidth={600}
        open={openDeleteDiscountCodesModal}
        onClose={() => setOpenDeleteDiscountCodesModal(false)}
        title="Upload discount codes for this item"
      >
        <DeleteDiscountCodesModalBody
          onClose={() => setOpenDeleteDiscountCodesModal(false)}
          storeItemId={storeItemId}
        />
      </Modal>
    </>
  );
};

export default DeleteDiscountCodesModal;
