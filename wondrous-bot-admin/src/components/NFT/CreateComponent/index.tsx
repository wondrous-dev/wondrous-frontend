import { Box, FormControl } from "@mui/material";
import { Label } from "components/AddFormEntity/components/styles";
import SelectComponent from "components/Shared/Select";
import TextField from "components/Shared/TextField";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { useState } from "react";
import useAlerts, { useGlobalContext } from "utils/hooks";
import AssetUpload from "./AssetUpload";
import { validateTypes } from "utils/common";
import { SharedSecondaryButton } from "components/Shared/styles";
import * as Yup from "yup";
import { transformAndUploadMedia } from "utils/media";
import { useMutation } from "@apollo/client";
import { CREATE_COMMUNITY_NFT } from "graphql/mutations/payment";
import Modal from "components/Shared/Modal";
import PageSpinner from "components/PageSpinner";
import Spinner from "components/Shared/Spinner";
import Ethereum from "assets/ethereum";
import Polygon from "assets/polygonMaticLogo.svg";

const formSchema = Yup.object().shape({
  name: Yup.string().required("Please enter an NFT name"),
  externalUrl: Yup.string().url("Invalid URL format").notRequired(),
  description: Yup.string().required("Description is required"),
  maxSupply: Yup.number()
    .positive("Supply must be a positive number")
    .integer("Supply must be an integer")
    .nullable()
    .notRequired(),
  chain: Yup.string().required("Blockchain selection is required"),
  mediaUpload: Yup.mixed().required("Please upload a file"),
});

export const NFT_MINTING_CHAIN_SELECT_OPTIONS = [
  {
    label: "Ethereum",
    value: "ethereum",
    icon: (
      <Ethereum
        style={{
          width: "20px",
          marginRight: "8px",
        }}
      />
    ),
  },
  {
    label: "Polygon",
    value: "polygon",
    icon: (
      <img
        style={{
          width: "20px",
          marginRight: "8px",
        }}
        src={Polygon}
      />
    ),
  },
];
const MB_LIMIT = 30;

const CreateNFTComponent = ({ handleClose }) => {
  const { activeOrg } = useGlobalContext();

  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useAlerts();

  const [createCommunityNft, { loading }] = useMutation(CREATE_COMMUNITY_NFT, {
    refetchQueries: ["getCommunityNFTsForOrg"],
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setSnackbarAlertMessage("Success!");
      setSnackbarAlertOpen(true);
      handleClose();
    },
  });
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    externalUrl: "",
    description: "",
    maxSupply: "",
    chain: null,
    mediaUpload: null,
  });

  const handleChange = (value, key) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const CONFIG = [
    {
      component: "mediaUpload",
      key: "mediaUpload",
      label: "Image or Video",
      limit: MB_LIMIT,
    },
    {
      component: "input",
      label: "Name",
      placeholder: "Enter NFT name",
      required: true,
      key: "name",
    },
    {
      component: "input",
      label: "External link",
      placeholder: "Enter external link",
      required: false,
      type: "url",
      key: "externalUrl",
    },
    {
      component: "input",
      label: "Description",
      placeholder: "Provide a description of the item.",
      required: true,
      key: "description",
      multiline: true,
    },
    {
      component: "input",
      label: "Supply",
      placeholder: "Enter supply",
      defaultValue: null,
      required: false,
      key: "maxSupply",
      onChange: (value) => {
        const isValid = validateTypes("number", value);
        if (isValid) {
          return handleChange(value, "maxSupply");
        }
      },
    },
    {
      component: "select",
      label: "Blockchain",
      placeholder: "Select blockchain",
      required: true,
      key: "chain",
      options: NFT_MINTING_CHAIN_SELECT_OPTIONS,
    },
  ];

  const handleSubmit = async () => {
    try {
      // Validate form data against the schema
      const { name, description, chain, externalUrl, maxSupply, mediaUpload } = formData;
      const body = {
        orgId: activeOrg.id,
        name,
        description,
        chain,
        externalUrl,
        maxSupply: maxSupply ? parseInt(maxSupply) : null,
        mediaUpload: mediaUpload,
      };
      await formSchema.validate(body, {
        abortEarly: false,
      });

      setErrors({}); // Clear previous errors if any
      // If it's valid, proceed with submitting form data
      const { filename, fileType } = await transformAndUploadMedia({ file: mediaUpload });
      await createCommunityNft({
        variables: {
          input: {
            ...body,
            mediaUpload: {
              uploadSlug: filename,
              name: filename.normalize,
              type: fileType,
            },
          },
        },
      });
    } catch (error) {
      console.error("Validation Error:", error);
      if (error instanceof Yup.ValidationError) {
        const errorMessages = {};
        error.inner.forEach((err) => {
          errorMessages[err.path] = err.message;
        });
        setErrors(errorMessages);
      }
    }
  };

  const ModalFooterComponent = () => {
    if (loading) return null;
    return (
      <Box width="100%" display="flex" justifyContent="center" alignItems="center" bgcolor="#2A8D5C" padding="9px">
        <SharedSecondaryButton onClick={handleSubmit} type="button">
          Create NFT
        </SharedSecondaryButton>
      </Box>
    );
  };

  return (
    <Modal
      open
      onClose={handleClose}
      title={"Create Community NFT"}
      maxWidth={640}
      modalFooterStyle={{
        padding: "0px",
      }}
      footerLeft={<ModalFooterComponent />}
    >
      {loading ? (
        <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
          <Spinner />
        </Box>
      ) : (
        <FormControl
          sx={{
            dispaly: "flex",
            flexDirection: "column",
            gap: "24px",
            width: "100%",
            bgcolor: "white",
          }}
        >
          {CONFIG.map((item, index) => {
            const key = item.key;
            return (
              <Box padding="14px" display="flex" gap="14px" flexDirection="column" key={key}>
                <Label>{item.label}</Label>
                {item.component === "input" && (
                  <TextField
                    value={formData[key]}
                    placeholder={item.placeholder}
                    error={errors[key]}
                    multiline={!!item.multiline}
                    onChange={(value) => (item?.onChange ? item?.onChange(value) : handleChange(value, key))}
                  />
                )}
                {item.component === "select" && (
                  <SelectComponent
                    value={formData[key]}
                    placeholder={item.placeholder}
                    error={errors[key]}
                    onChange={(value) => handleChange(value, key)}
                    options={item.options}
                  />
                )}
                {item.component === "mediaUpload" && (
                  <AssetUpload
                    error={errors[key]}
                    value={formData[key]}
                    onChange={(value) => handleChange(value, key)}
                    limit={item.limit}
                    setError={(value) => setErrors({ ...errors, [key]: value })}
                  />
                )}
                {index !== CONFIG.length - 1 && <Divider />}
              </Box>
            );
          })}
        </FormControl>
      )}
    </Modal>
  );
};

export default CreateNFTComponent;
