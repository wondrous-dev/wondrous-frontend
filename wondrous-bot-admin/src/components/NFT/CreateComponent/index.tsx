import { Box, FormControl } from "@mui/material";
import { Label } from "components/AddFormEntity/components/styles";
import SelectComponent from "components/Shared/Select";
import TextField from "components/Shared/TextField";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { useState } from "react";
import useAlerts, { useGlobalContext } from "utils/hooks";
import AssetUpload from "../AssetUpload";
import { validateTypes } from "utils/common";
import { SharedSecondaryButton } from "components/Shared/styles";
import * as Yup from "yup";
import { transformAndUploadMedia } from "utils/media";
import { useMutation } from "@apollo/client";
import { CREATE_COMMUNITY_NFT } from "graphql/mutations/payment";
import Modal from "components/Shared/Modal";
import PageSpinner from "components/PageSpinner";
import Spinner from "components/Shared/Spinner";
import { COMMUNITY_BADGE_CHAIN_SELECT_OPTIONS, MB_LIMIT, ModalFooterComponent } from "../utils";
import { StyledFormControl } from "../styles";
import { FormBody } from "../Shared";

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
      helper: 'How many of the items can be minted. Either enter a number or it is infinite',
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
      options: COMMUNITY_BADGE_CHAIN_SELECT_OPTIONS,
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

  return (
    <Modal
      open
      onClose={handleClose}
      title={"Create Community NFT"}
      maxWidth={640}
      modalFooterStyle={{
        padding: "0px",
      }}
      footerLeft={<ModalFooterComponent loading={loading} handleSubmit={handleSubmit} />}
    >
      {loading ? (
        <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
          <Spinner />
        </Box>
      ) : (
        <StyledFormControl>
          <FormBody
            config={CONFIG}
            handleChange={handleChange}
            formData={formData}
            errors={errors}
            setErrors={setErrors}
          />
        </StyledFormControl>
      )}
    </Modal>
  );
};

export default CreateNFTComponent;
