import { useLazyQuery } from "@apollo/client";
import { Box, ButtonBase, Grid, Typography } from "@mui/material";
import { TokenComponent } from "components/Rewards/RewardUtils";
import { PoapImage } from "components/CreateTemplate/styles";
import SelectComponent from "components/Shared/Select";
import { GET_COMMUNITY_NFTS_FOR_ORG, GET_CMTY_PAYMENT_METHODS_FOR_ORG } from "graphql/queries";
import { useContext, useEffect, useMemo, useState } from "react";
import { useGlobalContext } from "utils/hooks";
import AddIcon from "@mui/icons-material/Add";
import Modal from "components/Shared/Modal";
import { SharedSecondaryButton } from "components/Shared/styles";
import { Label } from "components/QuestsList/styles";
import ImportComponent from "components/NFT/ImportComponent";
import { NFT_TYPES, NFT_TYPE_LABELS } from "utils/constants";
import TextField from "components/Shared/TextField";
import { validateTypes, verifyIsImportedToken } from "utils/common";
import { Link } from "react-router-dom";


const TokenStoreItem = ({
  onChange,
  value,
  postInitialFetch = null,
  key = null,
  errors = null,
  setErrors = null,
  amount = null,
  onAmountChange = null,
}) => {
  const { activeOrg } = useGlobalContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [getCmtyPaymentMethodsForOrg, { data, loading }] = useLazyQuery(GET_CMTY_PAYMENT_METHODS_FOR_ORG, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });
  const [newToken, setNewToken] = useState(null);
  useEffect(() => {
    if (activeOrg?.id && !data && !loading) {
      getCmtyPaymentMethodsForOrg({
        variables: {
          orgId: activeOrg?.id,
          types: ["ERC20"],
        },
      }).then(({ data }) => {
        postInitialFetch?.(data);
      });
    }
  }, [activeOrg?.id, data, loading]);

  const toggleCreateModal = () => setIsAddModalOpen((prev) => !prev);

  const items = useMemo(() => {
    if (!data?.getCmtyPaymentMethodsForOrg)
      return {
        options: [],
      };
    const erc20Tokens = data?.getCmtyPaymentMethodsForOrg.map((item, idx) => ({
      label: `${item.name}: ${item.chain}`,
      value: item.id,
      chain: item.chain,
      contractAddress: item.contractAddress,
      icon: (
        <Box display="flex" marginRight="8px">
          <PoapImage src={item?.icon} />
        </Box>
      ),
    }));
    const options = [
      {
        label: "Add ERC20 Token",
        value: "add-nft",
        onClick: () => toggleCreateModal(),
        icon: (
          <AddIcon
            sx={{
              color: "black",
            }}
          />
        ),
      },
      ...erc20Tokens,
    ];

    return {
      options,
    };
  }, [data?.getCmtyPaymentMethodsForOrg, toggleCreateModal]);
  console.log(items, "items");
  console.log(data?.getCmtyPaymentMethodsForOrg, "getCmtyPaymentMethodsForOrg");
  const handleChange = (value) => {
    if (value === "add-nft") return;
    const option = data?.getCommunityNFTsForOrg?.find((item) => item.id === value);

    setErrors?.((prev) => ({
      ...prev,
      [key]: null,
    }));

    onChange(option);
  };

  return (
    <>
      <AddERC20PaymentMethodModal
        isOpen={isAddModalOpen}
        onClose={toggleCreateModal}
        newToken={newToken}
        setNewToken={setNewToken}
        errors={errors}
      />
      <SelectComponent error={errors?.[key]} options={items.options} value={value} onChange={handleChange} />

      <>
        <Label fontSize="14px" color="#626262">
          Enter amount
        </Label>

        <TextField
          multiline={false}
          value={amount}
          onChange={(value) => {
            const isValid = validateTypes("number", value);
            if (isValid) {
              return onAmountChange(value);
            }
          }}
        />
      </>
    </>
  );
};
import { CHAIN_SELECT_OPTIONS } from "utils/web3Constants";

const AddERC20PaymentMethodModal = ({ isOpen, onClose, newToken, setNewToken, errors }) => {
  return (
    <Modal open={isOpen} onClose={onClose} title="Add ERC20 Token">
      <Label>Chain</Label>
      <SelectComponent
        options={CHAIN_SELECT_OPTIONS}
        value={newToken?.chain}
        onChange={(value) => setNewToken({ ...newToken, chain: value })}
        error={errors?.chain}
      />
      <Label style={{ marginTop: "4px" }}>Token</Label>
      <TextField
        placeholder="Please paste in the contract address"
        value={newToken?.contractAddress}
        onChange={(value) => setNewToken({ ...newToken, contractAddress: value })}
        error={errors?.contractAddress}
        multiline={false}
      />
      <Label
        style={{
          marginTop: "4px",
        }}
      >
        Name
      </Label>
      <TextField
        placeholder="Token name"
        value={newToken?.tokenName}
        onChange={(value) => setNewToken({ ...newToken, tokenName: value })}
        multiline={false}
      />
    </Modal>
  );
};
export default TokenStoreItem;
