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
import { useEffect } from "react";
import { GET_STORE_ITEM_DISCOUNT_CODE_INFO } from "graphql/queries";

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
const UploadDiscountModal = ({ onClose, itemId, setCodesOnCreate = [] as any, setFilenameOnCreate = "" as any }) => {
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
  const [filename, setFilename] = useState("");
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
  const [getDiscountCodeInfo, { data: discountInfoData }] = useLazyQuery(GET_STORE_ITEM_DISCOUNT_CODE_INFO);
  const discountInfo = discountInfoData?.getStoreItemDiscountCodeInfo;
  useEffect(() => {
    if (itemId) {
      getDiscountCodeInfo({
        variables: {
          storeItemId: itemId,
        },
      });
    }
  }, [itemId]);
  useEffect(() => {
    if (discountInfo?.type) {
      setDiscountType(discountInfo?.type);
    }
    if (discountInfo?.scheme) {
      setDiscountScheme(discountInfo?.scheme);
    }
    if (discountInfo?.discount) {
      setDiscount(discountInfo?.discount);
    }
  }, [discountInfo?.discountType, discountInfo?.scheme, discountInfo?.discount]);
  const handleImportCodes = useCallback(() => {
    setIsImportInProgress(true);
    if (!discount) {
      setError("Please enter discount");
    } else if (!codesData?.codes || codesData?.codes?.length === 0) {
      setError("Please upload CSV!");
    } else {
      if (setCodesOnCreate && setFilename) {
        setCodesOnCreate({
          codes: codesData?.codes,
          discount,
          type: discountType,
          scheme: discountScheme,
        });
        setFilenameOnCreate(filename);
        onClose();
      } else {
        setError("No item ID!");
      }
    }
  }, [codesData.key, discount, discountType, discountScheme, itemId, onClose]);
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
      {discountInfo?.discount && (
        <Typography fontFamily="Poppins" fontWeight={600} fontSize="12px" color="grey">
          P.S You can upload more codes but you cannot upload with different discount amount/percentage, types and
          scheme. You can change these settings on the left panel.{" "}
          <b>Note: codes will be imported after you save your changes</b>
        </Typography>
      )}
      <Box>
        <CSVFileDropzone
          handleFileUpload={handleFileUpload}
          handleFileRemove={handleFileRemove}
          isDisabled={isImportInProgress}
          setFilename={setFilename}
        />
        {error && (
          <Typography
            fontFamily={"Poppins"}
            fontWeight={500}
            fontSize="12px"
            lineHeight="14px"
            color={redColors.red400}
            paddingLeft="4px"
            marginTop={"8px"}
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
          Discount amount/percentage
        </Label>
        <TextField
          placeholder="Discount"
          value={discount}
          disabled={!!discountInfo?.discount}
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
          Discount type
        </Typography>
        <SelectComponent
          boxStyle={{
            flex: 1,
          }}
          options={DISCOUNT_TYPE}
          disabled={!!discountInfo?.type}
          background="#C1B6F6"
          value={discountType}
          onChange={(value) => setDiscountType(value)}
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
          disabled={!!discountInfo?.scheme}
          boxStyle={{
            flex: 1,
          }}
          options={DISCOUNT_SCHEME}
          background="#C1B6F6"
          value={discountScheme}
          onChange={(value) => setDiscountScheme(value)}
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
          }}
        >
          Import codes
        </SharedSecondaryButton>
      </Box>
    </Grid>
  );
};
const DiscountCodeModal = ({
  openDiscountUploadModal,
  setOpenDiscountUploadModal,
  itemId,
  setCodesOnCreate = false as any,
  setFilenameOnCreate = false as any,
}) => {
  return (
    <>
      <Modal
        maxWidth={600}
        open={openDiscountUploadModal}
        onClose={() => setOpenDiscountUploadModal(false)}
        title="Upload discount codes for this item"
      >
        <UploadDiscountModal
          onClose={() => setOpenDiscountUploadModal(false)}
          itemId={itemId}
          setCodesOnCreate={setCodesOnCreate}
          setFilenameOnCreate={setFilenameOnCreate}
        />
      </Modal>
    </>
  );
};

export default DiscountCodeModal;
