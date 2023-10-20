import { useLazyQuery, useMutation } from "@apollo/client";
import { Grid } from "@mui/material";
import { useTour } from "@reactour/tour";
import {
  PAYMENT_OPTIONS,
  RewardFooterLeftComponent,
  RewardMethod,
  RewardMethodOptionButton,
} from "components/CreateTemplate/RewardUtils";
import { DiscordRoleIcon, NFTIcon, PoapIcon, TokensIcon } from "components/Icons/Rewards";
import { PricingOptionsTitle, getPlan } from "components/Pricing/PricingOptionsListItem";
import Modal from "components/Shared/Modal";
import { CREATE_CMTY_PAYMENT_METHOD } from "graphql/mutations/payment";
import { GET_ORG_DISCORD_ROLES } from "graphql/queries/discord";
import { GET_CMTY_PAYMENT_METHODS_FOR_ORG } from "graphql/queries/payment";
import { useContext, useEffect, useState } from "react";
import truncateEthAddress from "truncate-eth-address";
import GlobalContext from "utils/context/GlobalContext";
import { usePaywall, useSubscription } from "utils/hooks";
import { Label } from "./styles";

const useSubscriptionPaywall = () => {
  const subscription = useSubscription();
  const plan = getPlan(subscription?.tier);
  const { setPaywall, setPaywallMessage } = usePaywall();
  return {
    plan,
    setPaywall,
    setPaywallMessage,
  };
};

const handleNewDiscordRole = ({ newReward, rewards, handleOnRewardAdd, discordRoleOptions, discordRoleData }) => {
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
};

const handleAddTokenOnModal = ({
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

    handleOnRewardAdd({
      type: rewardType,
      paymentMethodId: paymentMethod?.id,
      paymentMethod,
      amount: rewardType === PAYMENT_OPTIONS.COMMUNITY_BADGE ? 1 : Number(newReward?.amount),
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
          type: 'ERC20'
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

const handleAddPoap = ({ poapReward, setErrors, errors, handleOnRewardAdd, rewardType }) => {
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
};

const useTokenRewardData = () => {
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
          types: ['ERC20']
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

const useDiscordRoleRewardData = () => {
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
  }))

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
  const [tokenReward, setTokenReward] = useState({
    tokenName: null,
    contractAddress: null,
    symbol: null,
    icon: null,
    type: 'erc20',
    chain: null,
    amount: null,
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
    ...tokenRewardData,
  };
};

const RewardModal = ({ handleRewardModalToggle, handleOnRewardAdd, rewards = [], rewardModalState }) => {
  const { activeOrg } = useContext(GlobalContext);
  const { plan, setPaywall, setPaywallMessage } = useSubscriptionPaywall();
  const { discordRoleOptions, discordRoleData } = useDiscordRoleRewardData();
  const [errors, setErrors] = useState(null);
  const {
    isRewardModalOpen,
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
    paymentMethods,
    createPaymentMethod,
  } = rewardModalState;

  const handleAddRewardOnModal = () => {
    if (rewardType === PAYMENT_OPTIONS.DISCORD_ROLE) {
      handleNewDiscordRole({
        newReward: { value: discordRoleReward, type: rewardType },
        rewards,
        handleOnRewardAdd,
        discordRoleData,
        discordRoleOptions,
      });
      handleRewardModalToggle();
    } else if (rewardType === PAYMENT_OPTIONS.TOKEN || rewardType === PAYMENT_OPTIONS.COMMUNITY_BADGE) {
      handleAddTokenOnModal({
        newReward: tokenReward,
        handleOnRewardAdd,
        paymentMethod,
        setErrors,
        errors,
        handleToggle: handleRewardModalToggle,
        addPaymentMethod,
        createPaymentMethod,
        activeOrg,
        setAddPaymentMethod,
        rewardType,
      });
    } else if (rewardType === PAYMENT_OPTIONS.POAP) {
      handleAddPoap({ poapReward, setErrors, errors, handleOnRewardAdd, rewardType });
      handleRewardModalToggle();
    }
  };

  const modalRewardButtonsProps = [
    {
      paymentOption: PAYMENT_OPTIONS.DISCORD_ROLE,
      rewardType: rewardType,
      onClick: () => setRewardType(PAYMENT_OPTIONS.DISCORD_ROLE),
      Icon: DiscordRoleIcon,
      text: "Discord Role",
    },
    {
      paymentOption: PAYMENT_OPTIONS.POAP,
      rewardType: rewardType,
      onClick: () => setRewardType(PAYMENT_OPTIONS.POAP),
      Icon: PoapIcon,
      text: "POAP",
    },
    {
      paymentOption: PAYMENT_OPTIONS.TOKEN,
      rewardType: rewardType,
      onClick: () => {
        setRewardType(PAYMENT_OPTIONS.TOKEN);
        if (plan === PricingOptionsTitle.Basic) {
          setPaywall(true);
          setPaywallMessage("This reward option is not available under the basic plan.");
          setRewardType(PAYMENT_OPTIONS.DISCORD_ROLE);
          return;
        } else {
          setRewardType(PAYMENT_OPTIONS.TOKEN);
        }
      },
      Icon: TokensIcon,
      text: "Token reward",
    },
    {
      paymentOption: PAYMENT_OPTIONS.COMMUNITY_BADGE,
      rewardType: rewardType,
      onClick: () => setRewardType(PAYMENT_OPTIONS.COMMUNITY_BADGE),
      Icon: NFTIcon,
      text: 'Community Badge',
    }
  ];

  return (
    <Modal
      open={isRewardModalOpen}
      onClose={handleRewardModalToggle}
      title="Add reward to quest"
      modalComponentProps={{
        className: "tour-default-modal",
      }}
      dialogComponentProps={{
        className: "tutorials-quest-reward-modal",
      }}
      maxWidth={800}
      footerLeft={
        <RewardFooterLeftComponent
          rewardType={rewardType}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          addPaymentMethod={addPaymentMethod}
          handleReward={handleAddRewardOnModal}
          setAddPaymentMethod={setAddPaymentMethod}
          editPaymentMethod={editPaymentMethod}
          setEditPaymentMethod={setEditPaymentMethod}
        />
      }
      footerRight={undefined}
      footerCenter={undefined}
    >
      <Grid display="flex" flexDirection="column" gap="24px">
        <Grid container item gap="14px">
          <Label>Reward Type</Label>
          <Grid container item alignItems="center" gap="14px" width="100%" justifyContent="center">
            {modalRewardButtonsProps.map((props) => (
              <RewardMethodOptionButton {...props} />
            ))}
          </Grid>
        </Grid>
        <Grid container item flexDirection="column" gap="14px">
          <RewardMethod
            rewardType={rewardType}
            componentsOptions={discordRoleOptions}
            discordRoleReward={discordRoleReward}
            setDiscordRoleReward={setDiscordRoleReward}
            tokenReward={tokenReward}
            setTokenReward={setTokenReward}
            paymentMethod={paymentMethod}
            paymentMethods={paymentMethods}
            addPaymentMethod={addPaymentMethod}
            setPaymentMethod={setPaymentMethod}
            editPaymentMethod={editPaymentMethod}
            setEditPaymentMethod={setEditPaymentMethod}
            errors={errors}
            setErrors={setErrors}
            poapReward={poapReward}
            setPoapReward={setPoapReward}
            guildId={discordRoleData[0]?.guildId}

          />
        </Grid>
      </Grid>
    </Modal>
  );
};

export default RewardModal;
