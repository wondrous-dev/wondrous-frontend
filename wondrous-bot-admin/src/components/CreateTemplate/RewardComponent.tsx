import { useLazyQuery, useMutation } from "@apollo/client";
import { Box, Grid } from "@mui/material";
import { useTour } from "@reactour/tour";
import {
  PAYMENT_OPTIONS,
  RewardFooterLeftComponent,
  RewardMethod,
  RewardWrapper,
  RewardWrapperWithTextField,
  RewardsComponent,
} from "components/CreateTemplate/RewardUtils";
import { DiscordRoleIcon, PointsIcon, TokensIcon } from "components/Icons/Rewards";
import { PricingOptionsTitle, getPlan } from "components/Pricing/PricingOptionsListItem";
import Modal from "components/Shared/Modal";
import { SharedBlackOutlineButton } from "components/Shared/styles";
import { CREATE_CMTY_PAYMENT_METHOD } from "graphql/mutations/payment";
import { GET_ORG_DISCORD_ROLES } from "graphql/queries/discord";
import { GET_CMTY_PAYMENT_METHODS_FOR_ORG } from "graphql/queries/payment";
import { useContext, useEffect, useRef, useState } from "react";
import truncateEthAddress from "truncate-eth-address";
import GlobalContext from "utils/context/GlobalContext";
import { usePaywall, useSubscription } from "utils/hooks";
import NewRewardAutocomplete from "./NewRewardAutocomplete";
import { CampaignOverviewTitle, Label, PoapImage } from "./styles";

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
  }));

  return {
    discordRoleOptions,
    discordRoleData,
  };
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

const handleDiscordRoleRewardRemove = ({ reward, setQuestSettings }) => {
  setQuestSettings((prev) => {
    const newRewards = prev.rewards.filter((r) => {
      if (r.type === PAYMENT_OPTIONS.DISCORD_ROLE) {
        return r.discordRewardData.discordRoleId !== reward.discordRewardData.discordRoleId;
      }
      return true;
    });
    return {
      ...prev,
      rewards: newRewards,
    };
  });
};

const handleNewDiscordRole = ({ newReward, rewards, onRewardAdd, discordRoleOptions, discordRoleData }) => {
  const discordRoleSelected = discordRoleOptions.find((option) => option.value === newReward.value);
  const discordRoleAlreadyExists = rewards.some(
    (reward) => reward.type === "discord_role" && reward.discordRewardData.discordRoleId === newReward?.value
  );
  if (!discordRoleAlreadyExists) {
    onRewardAdd({
      type: newReward?.type,
      discordRewardData: {
        discordRoleId: discordRoleSelected?.value,
        discordGuildId: discordRoleData[0]?.guildId,
        discordRoleName: discordRoleSelected?.label,
      },
    });
  }
};

const OnPaymentMethodRewardRemove = ({ reward, setQuestSettings }) => {
  setQuestSettings((prev) => {
    const newRewards = prev.rewards.filter((r) => {
      if (r.type === PAYMENT_OPTIONS.TOKEN) {
        return r.paymentMethodId !== reward.paymentMethodId;
      }
      return true;
    });
    return {
      ...prev,
      rewards: newRewards,
    };
  });
};

const handleAddTokenOnModal = ({
  newReward,
  rewards,
  onRewardAdd,
  paymentMethod,
  setErrors,
  errors,
  setQuestSettings,
  handleToggle,
  addPaymentMethod,
  createPaymentMethod,
  activeOrg,
  setAddPaymentMethod,
  rewardType,
}) => {
  if (paymentMethod) {
    if (!newReward?.amount) {
      setErrors({
        ...errors,
        tokenAmount: "Please enter the amount of tokens to be rewarded",
      });
      return;
    }
    // check if an existing reward is made with the same payment method - if so just edit
    let existingReward = false;
    const newRewards = rewards.map((reward) => {
      if (reward.paymentMethodId === paymentMethod?.id) {
        existingReward = true;
        return {
          ...reward,
          amount: Number(newReward?.amount),
        };
      }
      return reward;
    });
    if (existingReward) {
      setQuestSettings((prev) => {
        return {
          ...prev,
          rewards: newRewards,
        };
      });
    } else {
      onRewardAdd({
        type: rewardType,
        paymentMethodId: paymentMethod?.id,
        paymentMethod,
        amount: Number(newReward?.amount),
      });
    }
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
          type: newReward?.type.toUpperCase(),
        },
      },
    })
      .then((res) => {
        const paymentMethod = res?.data?.createCmtyPaymentMethod;
        onRewardAdd({
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

const handleAddTokenOnAutocomplete = ({ rewards, newReward, paymentMethods, onRewardAdd }) => {
  const existingReward = rewards.some(
    (reward) => newReward.type === "token" && reward.paymentMethodId === newReward?.value
  );
  if (!existingReward) {
    const selectedPaymentMethod = paymentMethods.find(({ id }) => id === newReward.value);
    onRewardAdd({
      type: newReward?.type,
      paymentMethodId: selectedPaymentMethod?.id,
      paymentMethod: selectedPaymentMethod,
      amount: null,
    });
  }
};

const handleAddPoap = ({ poapReward, setErrors, errors, onRewardAdd, rewardType }) => {
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
  onRewardAdd({
    type: rewardType,
    poapRewardData: poapReward,
  });
};

const useAddRewardModalState = ({ paymentMethods }) => {
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
    type: null,
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
  const [addPaymentMethod, setAddPaymentMethod] = useState(!paymentMethods.length);
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
  };
};

const useInputRef = () => {
  const inputRef = useRef(null);

  useEffect(() => inputRef.current.focus());
  return inputRef;
};

const RewardComponent = ({
  rewards,
  setQuestSettings,
}: {
  rewards: { [key: string]: any }[];
  setQuestSettings: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
}) => {
  const { activeOrg } = useContext(GlobalContext);
  const { plan, setPaywall, setPaywallMessage } = useSubscriptionPaywall();
  const { discordRoleOptions, discordRoleData } = useDiscordRoleRewardData();
  const { createPaymentMethod, paymentMethodOptions, paymentMethods } = useTokenRewardData();
  const [errors, setErrors] = useState(null);
  const onRewardAdd = (reward) => {
    setQuestSettings((prev) => {
      return {
        ...prev,
        rewards: [...prev.rewards, reward],
      };
    });
  };
  const {
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
  } = useAddRewardModalState({ paymentMethods });

  const handleToggleModal = () => {
    setIsRewardModalOpen((prev) => !prev);
    if (isTourOpen) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleAddRewardOnModal = () => {
    if (rewardType === PAYMENT_OPTIONS.DISCORD_ROLE) {
      handleNewDiscordRole({
        newReward: { value: discordRoleReward, type: rewardType },
        rewards,
        onRewardAdd,
        discordRoleData,
        discordRoleOptions,
      });
      handleToggleModal();
    } else if (rewardType === PAYMENT_OPTIONS.TOKEN) {
      handleAddTokenOnModal({
        newReward: tokenReward,
        rewards,
        onRewardAdd,
        paymentMethod,
        setErrors,
        errors,
        setQuestSettings,
        handleToggle: handleToggleModal,
        addPaymentMethod,
        createPaymentMethod,
        activeOrg,
        setAddPaymentMethod,
        rewardType,
      });
    } else if (rewardType === PAYMENT_OPTIONS.POAP) {
      handleAddPoap({ poapReward, setErrors, errors, onRewardAdd, rewardType });
      handleToggleModal();
    }
  };

  const handleOnChangePoints = (key, value) => {
    setQuestSettings((prev) => {
      return {
        ...prev,
        rewards: prev.rewards.map((reward) => {
          const defaultValue = value ? Number(value) : null;
          return {
            ...reward,
            value: reward.type === key ? defaultValue : reward.value,
          };
        }),
      };
    });
  };

  const OnPoapRewardRemove = (reward) => {
    setQuestSettings((prev) => {
      const newRewards = prev.rewards.filter((r) => {
        if (r.type === PAYMENT_OPTIONS.POAP) {
          return r.id !== reward.id;
        }
        return true;
      });
      return {
        ...prev,
        rewards: newRewards,
      };
    });
  };

  const [showNewRewardAutocomplete, setShowNewRewardAutocomplete] = useState(false);

  const inputRef = useInputRef();

  const rewardComponents = {
    points: ({ idx, reward }) => (
      <RewardWrapperWithTextField
        showNewRewardAutocomplete={showNewRewardAutocomplete}
        rewards={rewards}
        idx={idx}
        reward={reward}
        handleOnChange={(e) => {
          handleOnChangePoints(reward.type, e.target.value);
        }}
        text="Points"
        Icon={PointsIcon}
        inputRef={inputRef}
      />
    ),
    [PAYMENT_OPTIONS.DISCORD_ROLE]: ({ idx, reward }) => (
      <RewardWrapper
        idx={idx}
        rewards={rewards}
        showNewRewardAutocomplete={showNewRewardAutocomplete}
        Icon={DiscordRoleIcon}
        text={reward.discordRewardData.discordRoleName}
        handleOnRemove={() => handleDiscordRoleRewardRemove({ reward, setQuestSettings })}
      />
    ),
    [PAYMENT_OPTIONS.TOKEN]: ({ idx, reward }) => (
      <RewardWrapperWithTextField
        showNewRewardAutocomplete={showNewRewardAutocomplete}
        rewards={rewards}
        idx={idx}
        reward={reward}
        handleOnChange={(e) => {
          setQuestSettings((prev) => {
            return {
              ...prev,
              rewards: prev.rewards.map((compareReward) => {
                if (
                  compareReward.type === PAYMENT_OPTIONS.TOKEN &&
                  compareReward.paymentMethod?.id === reward?.paymentMethod?.id
                ) {
                  return {
                    ...reward,
                    amount: e.target.value && Number(e.target.value),
                  };
                }
                return compareReward;
              }),
            };
          });
        }}
        handleOnRemove={() => OnPaymentMethodRewardRemove({ reward, setQuestSettings })}
        text={String(reward?.paymentMethod.name)}
        Icon={TokensIcon}
        inputRef={inputRef}
      />
    ),
    [PAYMENT_OPTIONS.POAP]: ({ idx, reward }) => (
      <RewardWrapper
        showNewRewardAutocomplete={showNewRewardAutocomplete}
        rewards={rewards}
        idx={idx}
        handleOnRemove={OnPoapRewardRemove}
        Icon={() => <PoapImage src={reward?.poapRewardData?.imageUrl} />}
        text={reward?.poapRewardData?.name}
      />
    ),
  };

  return (
    <>
      <Modal
        open={isRewardModalOpen}
        onClose={handleToggleModal}
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
        <Grid display="flex" flexDirection="column" gap="14px">
          <Box display="flex" alignItems="center" gap="6px" width={"100%"} justifyContent={"center"}>
            <SharedBlackOutlineButton
              style={{
                flex: 1,
              }}
              background={PAYMENT_OPTIONS.DISCORD_ROLE === rewardType ? "#BFB4F3" : "#FFFFF"}
              onClick={() => setRewardType(PAYMENT_OPTIONS.DISCORD_ROLE)}
            >
              Discord Role
            </SharedBlackOutlineButton>
            <SharedBlackOutlineButton
              style={{
                flex: 1,
              }}
              background={PAYMENT_OPTIONS.POAP === rewardType ? "#BFB4F3" : "#FFFFF"}
              onClick={() => setRewardType(PAYMENT_OPTIONS.POAP)}
            >
              POAP
            </SharedBlackOutlineButton>
            <SharedBlackOutlineButton
              style={{
                flex: 1,
              }}
              background={PAYMENT_OPTIONS.TOKEN === rewardType ? "#BFB4F3" : "#FFFFF"}
              onClick={() => {
                setRewardType(PAYMENT_OPTIONS.TOKEN);
                if (plan === PricingOptionsTitle.Basic) {
                  setPaywall(true);
                  setPaywallMessage("This reward option is not available under the basic plan.");
                  setRewardType(PAYMENT_OPTIONS.DISCORD_ROLE);
                  return;
                } else {
                  setRewardType(PAYMENT_OPTIONS.TOKEN);
                }
              }}
            >
              Token reward
            </SharedBlackOutlineButton>
          </Box>

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
          />
        </Grid>
      </Modal>

      <Grid container>
        <Label>Rewards</Label>
        <Grid container item gap="14px" alignItems="center" flex="1">
          <RewardsComponent rewards={rewards} rewardComponents={rewardComponents} />
          <NewRewardAutocomplete
            discordRoleOptions={discordRoleOptions}
            handleNewDiscordRole={({ newReward, rewards, onRewardAdd }) =>
              handleNewDiscordRole({ newReward, rewards, onRewardAdd, discordRoleOptions, discordRoleData })
            }
            handleNewToken={({ newReward, rewards, onRewardAdd }) =>
              handleAddTokenOnAutocomplete({ rewards, newReward, paymentMethods, onRewardAdd })
            }
            onRewardAdd={onRewardAdd}
            paymentMethodOptions={paymentMethodOptions}
            rewards={rewards}
            setIsRewardModalOpen={setIsRewardModalOpen}
            show={showNewRewardAutocomplete}
            setShow={setShowNewRewardAutocomplete}
          />
        </Grid>
      </Grid>
    </>
  );
};

const RewardOverviewHeader = () => (
  <Grid
    padding="14px"
    bgcolor="#2A8D5C"
    sx={{
      borderTopLeftRadius: "16px",
      borderTopRightRadius: "16px",
    }}
  >
    <CampaignOverviewTitle>Reward</CampaignOverviewTitle>
  </Grid>
);

export { RewardComponent, RewardOverviewHeader };
