import { Box, Grid, Typography } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { Label } from "components/CreateTemplate/styles";
import SelectComponent from "components/Shared/Select";
import { SharedSecondaryButton } from "components/Shared/styles";
import Modal from "components/Shared/Modal";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import useAlerts from "utils/hooks";
import TextField from "components/Shared/TextField";
import GlobalContext from "utils/context/GlobalContext";
import isEqual from "lodash/isEqual";
import { IMPORT_DISCOUNT_CODES, UPDATE_DISCOUNT_CODES } from "graphql/mutations/cmtyStore";
import { redColors } from "utils/theme/colors";
import { DISCOUNT_SCHEME, DISCOUNT_TYPE } from "pages/store/StoreItem/DiscountCodeModal";
import EditSvg from "components/Icons/edit.svg";

const EditDiscountModalBody = ({ discountInfo, onClose }) => {
  const [updateDiscountCodes] = useMutation(UPDATE_DISCOUNT_CODES, {
    refetchQueries: ["getStoreItemDiscountCodeInfo", "getAllStoreItemDiscountCodes", "getStoreItemDiscountCodeCount"],
  });
  const [discount, setDiscount] = useState(discountInfo?.discount);
  const [discountType, setDiscountType] = useState(discountInfo?.type);
  const [discountScheme, setDiscountScheme] = useState(discountInfo?.scheme);
  return (
    <Grid display="flex" flexDirection="column" gap="10px">
      <Box>
        <Label
          style={{
            marginBottom: "10px",
            lineHeight: "24px",
          }}
        >
          Discount percentage/amount: You can only edit for codes that have not been delivered!
        </Label>
        <TextField
          placeholder="Discount"
          value={discount}
          onChange={(value) => {
            if (value) {
              setDiscount(Number(value));
            } else {
              setDiscount(null);
            }
          }}
          multiline={false}
          // style={TextInputStyle}
          type="number"
        />
      </Box>
      <Box>
        <Typography
          fontFamily="Poppins"
          fontWeight={600}
          fontSize="14px"
          color="#06040A"
          marginBottom="8px"
          marginTop={"8px"}
        >
          Discount scheme
        </Typography>
        <SelectComponent
          boxStyle={{
            flex: 1,
          }}
          options={DISCOUNT_SCHEME}
          background="#C1B6F6"
          value={discountScheme}
          onChange={(value) => setDiscountScheme(value)}
        />
      </Box>
      {/* <Box>
        <Typography
          fontFamily="Poppins"
          fontWeight={600}
          fontSize="14px"
          color="#06040A"
          marginBottom="8px"
          marginTop={"8px"}
        >
          Discount type
        </Typography>
        <SelectComponent
          boxStyle={{
            flex: 1,
          }}
          options={DISCOUNT_TYPE}
          background="#C1B6F6"
          value={discountType}
          onChange={(value) => setDiscountType(value)}
        />
      </Box> */}
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
            updateDiscountCodes({
              variables: {
                storeItemId: discountInfo?.itemId,
                discount,
                type: discountType,
                scheme: discountScheme,
              },
            });
            onClose();
          }}
        >
          Update
        </SharedSecondaryButton>
      </Box>
    </Grid>
  );
};

const EditDiscountModal = ({ discountInfo, editDiscountModalOpen, setEditDiscountModalOpen }) => {
  return (
    <Modal
      maxWidth={600}
      open={editDiscountModalOpen}
      onClose={() => setEditDiscountModalOpen(false)}
      title="Edit discount codes for this item"
    >
      <EditDiscountModalBody onClose={() => setEditDiscountModalOpen(false)} discountInfo={discountInfo} />
    </Modal>
  );
};

export const DiscountEdit = ({ discountInfo }) => {
  const [editDiscountModalOpen, setEditDiscountModalOpen] = useState(false);
  return (
    <>
      <EditDiscountModal
        discountInfo={discountInfo}
        editDiscountModalOpen={editDiscountModalOpen}
        setEditDiscountModalOpen={setEditDiscountModalOpen}
      />
      <img
        style={{
          cursor: "pointer",
          marginLeft: "12px",
          width: "38px",
        }}
        src={EditSvg}
        onClick={() => setEditDiscountModalOpen(true)}
      />
    </>
  );
};
