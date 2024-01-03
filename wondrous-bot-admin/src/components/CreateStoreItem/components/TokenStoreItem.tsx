import { useLazyQuery } from "@apollo/client";
import { Box } from "@mui/material";
import { PoapImage } from "components/CreateTemplate/styles";
import SelectComponent from "components/Shared/Select";
import { GET_CMTY_PAYMENT_METHODS_FOR_ORG } from "graphql/queries";
import { useEffect, useMemo, useState } from "react";
import { useGlobalContext } from "utils/hooks";
import AddIcon from "@mui/icons-material/Add";
import { Label } from "components/QuestsList/styles";
import TextField from "components/Shared/TextField";
import { validateTypes } from "utils/common";
import RewardModal from "components/Rewards/RewardModal";
import { useAddRewardModalState } from "components/Rewards/utils";
import { PAYMENT_OPTIONS } from "components/Rewards/constants";

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
  const rewardModalState = useAddRewardModalState(PAYMENT_OPTIONS.TOKEN);

  const { activeOrg } = useGlobalContext();
  const { setIsRewardModalOpen, resetStates } = rewardModalState;
  const [getCmtyPaymentMethodsForOrg, { data, loading }] = useLazyQuery(GET_CMTY_PAYMENT_METHODS_FOR_ORG, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

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

  const toggleCreateModal = () => setIsRewardModalOpen((prev) => !prev);

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
        value: "add-token",
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

  const handleChange = (value) => {
    if (value === "add-token") return;
    const option = data?.getCmtyPaymentMethodsForOrg?.find((item) => item.id === value);
    setErrors?.((prev) => ({
      ...prev,
      [key]: null,
    }));

    onChange(option);
  };

  const handleOnRewardAdd = (reward) => {
    const { amount, paymentMethod, paymentMethodId, type } = reward;
    const option = data?.getCmtyPaymentMethodsForOrg?.find((item) => item.id === paymentMethodId);
    if (amount) {
      onAmountChange(amount);
    }
    setErrors?.((prev) => ({
      ...prev,
      [key]: null,
    }));
    if (!option) return onChange(paymentMethod);
    onChange(option);
  };

  const handleRewardModalClose = () => {
    resetStates();
  };

  return (
    <>
      <RewardModal
        options={[PAYMENT_OPTIONS.TOKEN]}
        rewardModalState={rewardModalState}
        handleRewardModalToggle={handleRewardModalClose}
        handleOnRewardAdd={handleOnRewardAdd}
        title="Add ERC20 Token"
      />
      <SelectComponent
        selectProps={{
          renderValue: () => {
            const selectedOption = items.options?.find((option) => option.value === value);
            return selectedOption ? selectedOption.label : "Select";
          },
        }}
        error={errors?.[key]}
        options={items.options}
        value={value}
        onChange={handleChange}
      />

      <>
        <Label fontSize="14px" color="#626262">
          Token amount per purchase
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

export default TokenStoreItem;
