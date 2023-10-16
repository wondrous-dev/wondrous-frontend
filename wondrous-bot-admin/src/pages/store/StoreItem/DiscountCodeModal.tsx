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
import { IMPORT_DISCOUNT_CODES } from "graphql/mutations/cmtyStore";
import CSVFileDropzone from "components/CSVFileDropZone";
import { redColors } from "utils/theme/colors";

export const DISCOUNT_CODE_HEADERS = ["codes"];

const getFormattedCSVData = (data) => {
  const formattedData = [];

  data.forEach((rowData, idx) => {
    if (idx > 0) {
      formattedData.push(rowData[0]);
    }
  });

  return formattedData;
};

const getCodesFromData = ({ data, setError }) => {
  if (!isEqual(data[0], DISCOUNT_CODE_HEADERS)) {
    setError("CSV format does not match with the given format");
  }
  const formattedData = getFormattedCSVData(data);
  return formattedData;
};

export const DEFAULT_CODES_DATA = { codes: [] as any, key: Date.now() };

export const DISCOUNT_SCHEME = [
  {
    value: "percent",
    label: "Percentage",
  },
  {
    value: "amount",
    label: "Amount",
  },
];
export const DISCOUNT_TYPE = [
  {
    value: "one_time",
    label: "One Time",
  },
];
const UploadDiscountModal = ({ onClose, itemId }) => {
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAnchorOrigin } = useAlerts();
  const [uploadDiscountCodes] = useMutation(IMPORT_DISCOUNT_CODES, {
    onCompleted: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage("Success!");
      setSnackbarAlertAnchorOrigin({
        vertical: "top",
        horizontal: "center",
      });
    },
    refetchQueries: ["getStoreItemDiscountCodeInfo"],
  });
  const { activeOrg } = useContext(GlobalContext);
  const [isImportInProgress, setIsImportInProgress] = useState(false);
  const [codesData, setCodesData] = useState(DEFAULT_CODES_DATA);
  const [discount, setDiscount] = useState(null);
  const [discountType, setDiscountType] = useState("one_time");
  const [discountScheme, setDiscountScheme] = useState("percent");
  const [error, setError] = useState("");
  const handleFileUpload = useCallback((data) => {
    try {
      setError("");
      setCodesData(DEFAULT_CODES_DATA);
      const formattedData = getCodesFromData({ data, setError });

      const formattedDataIdentifier = Date.now();
      setCodesData({ codes: formattedData, key: formattedDataIdentifier });
    } catch (error) {
      setError(error.message);
    }
  }, []);

  const handleImportCodes = useCallback(() => {
    setIsImportInProgress(true);
    uploadDiscountCodes({
      variables: {
        input: {
          codes: codesData.codes,
          storeItemId: itemId,
          orgId: activeOrg?.id,
          discount: Math.round(Number(discount)),
          type: discountType,
          scheme: discountScheme,
        },
      },
    });
  }, [codesData.key]);
  const handleFileRemove = useCallback(() => {
    setCodesData(DEFAULT_CODES_DATA);
  }, [DEFAULT_CODES_DATA]);
  return (
    <Grid display="flex" flexDirection="column" gap="10px">
      <Typography fontFamily="Poppins" fontWeight={600} fontSize="14px" color="#06040A">
        Upload discount codes for this item. Please make sure to follow{" "}
        <a
          href="https://docs.google.com/spreadsheets/d/1Pw_nn0nMXjwUoE7N44O1e5dwSCyxYipJ0jN5afYUDsE/edit?usp=sharing"
          target="_blank"
        >
          {" "}
          this format{" "}
        </a>{" "}
        when uploading a CSV:
      </Typography>
      <Box>
        <CSVFileDropzone
          handleFileUpload={handleFileUpload}
          handleFileRemove={handleFileRemove}
          isDisabled={isImportInProgress}
        />
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
      </Box>
      <Box>
        <Label
          style={{
            marginBottom: "10px",
          }}
        >
          Discount
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
      <Box>
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
      </Box>
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
            handleImportCodes();
            onClose();
          }}
        >
          Start importing
        </SharedSecondaryButton>
      </Box>
    </Grid>
  );
};
const DiscountCodeModal = ({ openDiscountUploadModal, setOpenDiscountUploadModal, itemId }) => {
  return (
    <>
      <Modal
        maxWidth={600}
        open={openDiscountUploadModal}
        onClose={() => setOpenDiscountUploadModal(false)}
        title="Upload discount codes for this item"
      >
        <UploadDiscountModal onClose={() => setOpenDiscountUploadModal(false)} itemId={itemId} />
      </Modal>
    </>
  );
};

export default DiscountCodeModal;
