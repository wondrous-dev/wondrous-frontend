import { useState } from "react";
import useAlerts, { useGlobalContext } from "utils/hooks";
import { COMMUNITY_BADGE_CHAIN_SELECT_OPTIONS, CONTRACT_LABELS, MB_LIMIT, ModalFooterComponent } from "../utils";
import Modal from "components/Shared/Modal";
import { Box, FormControl } from "@mui/material";
import Spinner from "components/Shared/Spinner";
import * as yup from "yup";
import { StyledFormControl } from "../styles";
import { FormBody } from "../Shared";
import { CREATE_COMMUNITY_NFT, IMPORT_COMMUNITY_NFT } from "graphql/mutations/payment";
import { useMutation } from "@apollo/client";
import { transformAndUploadMedia } from "utils/media";
import { validateTypes } from "utils/common";

const validationSchema = yup.object().shape({
  contractAddress: yup
    .string()
    .matches(/^0x[a-fA-F0-9]{40}$/, "Must be a valid address")
    .required("Contract Address is required"),
  tokenId: yup.number().test("tokenId", "Token ID is required for ERC1155 contracts", function (value) {
    return this.parent.nftType !== CONTRACT_LABELS.ERC1155 || (value != null && !isNaN(value));
  }).nullable(),

  externalUrl: yup.string().url("Invalid URL format").notRequired(),
  chain: yup
    .mixed()
    .oneOf(Object.values(["ethereum", "polygon"]), "Must select a valid chain")
    .required("Blockchain is required"),
  mediaUpload: yup.mixed().required("Media upload is required"),
  nftType: yup
    .string()
    .oneOf([CONTRACT_LABELS.ERC721, CONTRACT_LABELS.ERC1155], "Invalid contract type")
    .required("Contract type is required"),
  name: yup.string().required("Please enter an NFT name"),
  description: yup.string()
});

const ImportComponent = ({ handleClose, onSuccess = null }) => {
  const { activeOrg } = useGlobalContext();

  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useAlerts();
  const [errors, setErrors] = useState({});

  const [importCommunityNFT, { loading }] = useMutation(IMPORT_COMMUNITY_NFT, {
    refetchQueries: ["getCommunityNFTsForOrg"],
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setSnackbarAlertMessage("Success!");
      setSnackbarAlertOpen(true);
      onSuccess?.(data?.importCommunityNFT)
      handleClose();
    },
  });

  const [formData, setFormData] = useState({
    contractAddress: "",
    tokenId: null,
    externalUrl: "",
    chain: null,
    mediaUpload: null,
    nftType: null,
    name: "",
    description: "",
  });

  const handleChange = (value, key) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const CONFIG = [
    {
      component: "input",
      label: "Contract Address",
      placeholder: "Enter contract address",
      required: true,
      key: "contractAddress",
      divider: true,
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
      label: "Description",
      placeholder: "Provide a description of the item.",
      key: "description",
      multiline: true,
    },
    {
      component: "select",
      label: "Contract Type",
      placeholder: "Select contract type",
      required: true,
      key: "nftType",
      options: [
        {
          label: CONTRACT_LABELS.ERC721,
          value: CONTRACT_LABELS.ERC721,
        },
        {
          label: CONTRACT_LABELS.ERC1155,
          value: CONTRACT_LABELS.ERC1155,
        },
      ],
    },
    {
      component: "input",
      label: "Token ID",
      placeholder: "Enter Token ID",
      onChange: (value) => {
        const isValid = validateTypes("number", value);
        if (isValid) {
          return handleChange(value, "tokenId");
        }
      },
      required: formData?.nftType === CONTRACT_LABELS.ERC1155,
      key: "tokenId",
      hide: formData?.nftType !== CONTRACT_LABELS.ERC1155,
    },
    {
      component: "input",
      label: "URL",
      placeholder: "Enter URL",
      key: "externalUrl",
      type: "url",
    },
    {
      component: "select",
      label: "Blockchain",
      placeholder: "Select blockchain",
      required: true,
      key: "chain",
      options: COMMUNITY_BADGE_CHAIN_SELECT_OPTIONS,
      divider: true,
    },
    {
      component: "mediaUpload",
      key: "mediaUpload",
      label: "Image or Video",
      limit: MB_LIMIT,
    },
  ];

  const handleSubmit = async () => {
    try {
      const { name, description, chain, externalUrl, mediaUpload, nftType, tokenId, contractAddress } = formData;

      const body = {
        orgId: activeOrg.id,
        name,
        description,
        chain,
        externalUrl,
        mediaUpload,
        nftType,
        tokenId: tokenId ? parseInt(tokenId) : null,
        contractAddress,
      };

      await validationSchema.validate(body, {
        abortEarly: false,
      });
      setErrors({});
      const { filename, fileType } = await transformAndUploadMedia({ file: mediaUpload });

      await importCommunityNFT({
        variables: {
          input: {
            ...body,
            tokenId,
            mediaUpload: {
              uploadSlug: filename,
              name: filename.normalize,
              type: fileType,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
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
      title={"Import NFT"}
      maxWidth={640}
      modalFooterStyle={{
        padding: "0px",
      }}
      footerLeft={<ModalFooterComponent loading={loading} handleSubmit={handleSubmit} buttonText="Import" />}
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
            withDivider={false}
          />
        </StyledFormControl>
      )}
    </Modal>
  );
};

export default ImportComponent;
