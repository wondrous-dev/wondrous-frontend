import { useMutation, useLazyQuery } from "@apollo/client";
import { useTour } from "@reactour/tour";
import { CREATE_CMTY_PAYMENT_METHOD } from "graphql/mutations/payment";
import { GET_CMTY_PAYMENT_METHODS_FOR_ORG, GET_ORG_DISCORD_ROLES } from "graphql/queries";
import { useContext, useEffect, useState } from "react";
import truncateEthAddress from "truncate-eth-address";
import GlobalContext from "utils/context/GlobalContext";
import { PAYMENT_OPTIONS } from "./constants";

export const handleNewDiscordRole = ({
  newReward,
  rewards,
  handleOnRewardAdd,
  discordRoleOptions,
  discordRoleData,
  handleToggle,
  setErrors,
  errors,
}) => {
  if (!newReward?.value) return setErrors({ ...errors, discordRole: "Please select a discord role" });
  const discordRoleSelected = discordRoleOptions.find((option) => option.value === newReward.value);
  const discordRoleAlreadyExists = rewards.some(
    (reward) =>
      reward.type === PAYMENT_OPTIONS.DISCORD_ROLE && reward.discordRewardData.discordRoleId === newReward?.value
  );

  if (!discordRoleAlreadyExists) {
    handleOnRewardAdd({
      type: newReward?.type,
      discordRewardData: {
        discordRoleId: discordRoleSelected?.value,
        discordGuildId: discordRoleData[0]?.guildId,
        discordRoleName: discordRoleSelected?.label,
      },
    });
  }
  return handleToggle();
};

export const handleAddTokenOnModal = ({
  newReward,
  handleOnRewardAdd,
  paymentMethod,
  setErrors,
  errors,
  handleToggle,
  addPaymentMethod,
  createPaymentMethod,
  activeOrg,
  setAddPaymentMethod,
  rewardType,
}) => {
  if (paymentMethod) {
    if (!newReward?.amount && rewardType !== PAYMENT_OPTIONS.COMMUNITY_BADGE) {
      setErrors({
        ...errors,
        tokenAmount: "Please enter the amount of tokens to be rewarded",
      });
      return;
    }

    const isCmtyBadge = rewardType === PAYMENT_OPTIONS.COMMUNITY_BADGE && paymentMethod?.type === "COMMUNITY_BADGE";

    handleOnRewardAdd({
      type: rewardType,
      paymentMethodId: paymentMethod?.id,
      paymentMethod,
      amount: isCmtyBadge ? 1 : Number(newReward?.amount),
    });
    handleToggle();
  } else if (addPaymentMethod) {
    // Create payment method and then add reward
    if (!newReward?.contractAddress) {
      setErrors({
        ...errors,
        contractAddress: "Please enter the contract address",
      });
      return;
    }
    if (!newReward?.chain) {
      setErrors({
        ...errors,
        chain: "Please select the appropriate chain",
      });
      return;
    }
    if (!newReward?.type) {
      setErrors({
        ...errors,
        tokenType: "Please select the token type",
      });
      return;
    }
    if (!newReward?.amount) {
      setErrors({
        ...errors,
        tokenAmount: "Please enter the amount of tokens to be rewarded",
      });
      return;
    }
    createPaymentMethod({
      variables: {
        input: {
          orgId: activeOrg?.id,
          contractAddress: newReward?.contractAddress,
          tokenName: newReward?.tokenName,
          symbol: newReward?.symbol,
          icon: newReward?.icon,
          chain: newReward?.chain,
          type: "ERC20",
        },
      },
    })
      .then((res) => {
        const paymentMethod = res?.data?.createCmtyPaymentMethod;
        handleOnRewardAdd({
          type: rewardType,
          paymentMethodId: paymentMethod?.id,
          amount: newReward?.amount,
          paymentMethod,
        });
        handleToggle();
        setAddPaymentMethod(false);
      })
      .catch((err) => {
        setErrors({
          ...errors,
          paymentMethodCreation: err?.message,
        });
      });
  }
};

export const handleAddPoap = ({ poapReward, setErrors, errors, handleOnRewardAdd, rewardType, handleToggle }) => {
  if (!poapReward?.id) {
    setErrors({
      ...errors,
      poapEventId: "Please enter the POAP event ID",
    });
    return;
  }
  if (!poapReward?.name) {
    setErrors({
      ...errors,
      poapEventId: "Please enter a valid POAP event ID",
    });
    return;
  }
  if (!poapReward?.eventSecret) {
    setErrors({
      ...errors,
      eventSecret: "Please enter a poap event secret",
    });
    return;
  }
  handleOnRewardAdd({
    type: rewardType,
    poapRewardData: poapReward,
  });
  handleToggle();
};

export const handleAddCmtyStoreItem = ({ setErrors, type, storeItem, handleToggle, errors, handleOnRewardAdd }) => {
  if (!storeItem) {
    setErrors({
      ...errors,
      storeItem: "Please select a store item",
    });
    return;
  }
  handleOnRewardAdd({
    type,
    storeItem,
  });
  handleToggle();
};
export const useTokenRewardData = () => {
  const { activeOrg } = useContext(GlobalContext);

  const [createPaymentMethod] = useMutation(CREATE_CMTY_PAYMENT_METHOD, {
    refetchQueries: [GET_CMTY_PAYMENT_METHODS_FOR_ORG],
  });

  const [getCmtyPaymentMethods, { data: getCmtyPaymentMethodsData }] = useLazyQuery(GET_CMTY_PAYMENT_METHODS_FOR_ORG, {
    fetchPolicy: "cache-and-network",
  });

  const paymentMethods = getCmtyPaymentMethodsData?.getCmtyPaymentMethodsForOrg || [];
  const paymentMethodOptions = paymentMethods?.map((method) => ({
    label: method?.name || truncateEthAddress(method?.contractAddress),
    value: method?.id,
  }));

  useEffect(() => {
    if (activeOrg?.id) {
      getCmtyPaymentMethods({
        variables: {
          orgId: activeOrg?.id,
          types: ["ERC20"],
        },
      });
    }
  }, [activeOrg?.id]);

  return {
    paymentMethodOptions,
    paymentMethods,
    createPaymentMethod,
  };
};

export const useDiscordRoleRewardData = () => {
  const { activeOrg } = useContext(GlobalContext);
  const [getCmtyOrgDiscordRoles, { data: getCmtyOrgDiscordRolesData, variables }] = useLazyQuery(
    GET_ORG_DISCORD_ROLES,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  useEffect(() => {
    if (activeOrg?.id) {
      getCmtyOrgDiscordRoles({
        variables: {
          orgId: activeOrg?.id,
        },
      });
    }
  }, [activeOrg?.id]);
  const discordRoleData = getCmtyOrgDiscordRolesData?.getCmtyOrgDiscordRoles || [];
  const discordRoles =
    getCmtyOrgDiscordRolesData?.getCmtyOrgDiscordRoles?.length > 0
      ? getCmtyOrgDiscordRolesData?.getCmtyOrgDiscordRoles[0]?.roles
      : [];
  const discordRoleOptions = discordRoles?.map((role) => ({
    label: role.name,
    value: role.id,
  }));

  return {
    discordRoleOptions,
    discordRoleData,
  };
};

export const useAddRewardModalState = () => {
  const tokenRewardData = useTokenRewardData();
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const { isOpen: isTourOpen, setCurrentStep, currentStep, setSteps, steps } = useTour();
  useEffect(() => {
    if (isTourOpen) {
      const newSteps = steps.map((step: any) => {
        if (step.id === "tutorial-quest-rewards") {
          return {
            ...step,
            handleNextAction: () => {
              setIsRewardModalOpen(true);
              setCurrentStep((prev) => prev + 1);
            },
          };
        }
        if (step.id === "tutorial-add-rewards") {
          return {
            ...step,
            handleNextAction: () => {
              setIsRewardModalOpen(false);
              setCurrentStep((prev) => prev + 1);
            },
            handlePrevAction: () => {
              setIsRewardModalOpen(false);
              setCurrentStep((prev) => prev - 1);
            },
          };
        }
        if (step.id === "tutorial-activate-quest") {
          return {
            ...step,
            handlePrevAction: () => {
              setIsRewardModalOpen(true);
              setCurrentStep((prev) => prev - 1);
            },
          };
        }
        return step;
      });
      setSteps(newSteps);
    }
  }, [isTourOpen]);
  const [rewardType, setRewardType] = useState(PAYMENT_OPTIONS.DISCORD_ROLE);
  const [discordRoleReward, setDiscordRoleReward] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cmtyStoreItemReward, setCmtyStoreItemReward] = useState(null);
  const [tokenReward, setTokenReward] = useState({
    tokenName: null,
    contractAddress: null,
    symbol: null,
    icon: null,
    type: "erc20",
    chain: null,
    amount: 1,
  });
  const [editPaymentMethod, setEditPaymentMethod] = useState({
    id: null,
    tokenName: null,
    contractAddress: null,
    symbol: null,
    icon: null,
    type: null,
    chain: null,
    amount: null,
  });
  const [addPaymentMethod, setAddPaymentMethod] = useState(!tokenRewardData?.paymentMethods.length);
  const [poapReward, setPoapReward] = useState(null);
  return {
    isRewardModalOpen,
    setIsRewardModalOpen,
    rewardType,
    setRewardType,
    discordRoleReward,
    setDiscordRoleReward,
    paymentMethod,
    setPaymentMethod,
    tokenReward,
    setTokenReward,
    editPaymentMethod,
    setEditPaymentMethod,
    addPaymentMethod,
    setAddPaymentMethod,
    poapReward,
    setPoapReward,
    isTourOpen,
    setCurrentStep,
    currentStep,
    cmtyStoreItemReward,
    setCmtyStoreItemReward,
    ...tokenRewardData,
  };
};
