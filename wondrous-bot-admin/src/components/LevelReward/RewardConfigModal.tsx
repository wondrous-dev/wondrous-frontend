import { Box, ButtonBase, Divider, Grid, Typography } from "@mui/material";
import { ErrorText, SharedBlackOutlineButton, SharedSecondaryButton } from "components/Shared/styles";
import React, { useState } from "react";
import Modal from "components/Shared/Modal";
import { useContext } from "react";
import GlobalContext from "utils/context/GlobalContext";
import { useEffect } from "react";
import { GET_ORG_DISCORD_ROLES } from "graphql/queries/discord";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_CMTY_PAYMENT_METHOD } from "graphql/mutations/payment";
import truncateEthAddress from "truncate-eth-address";
import { GET_CMTY_PAYMENT_METHODS_FOR_ORG } from "graphql/queries/payment";
import { ADD_ORG_LEVEL_REWARD } from "graphql/mutations";
import { PAYMENT_OPTIONS, RewardFooterLeftComponent, RewardMethod } from "components/CreateTemplate/RewardUtils";

const INITIAL_TOKEN_REWARD_STATE = {
  tokenName: null,
  contractAddress: null,
  symbol: null,
  icon: null,
  type: null,
  chain: null,
  amount: null,
};
interface AddOrgLevelRewardInput {
  orgId: string;
  level: number;
  type: string;
  discordRewardData?: any;
  paymentMethodId?: string;
  paymentMethod?: any;
  amount?: number;
}

const RewardConfigModal = ({ isRewardModalOpen, setIsRewardModalOpen, level, refetchLevelRewards }) => {
  const [errors, setErrors] = useState(null);
  const [discordRoleReward, setDiscordRoleReward] = useState(null);
  const [addPaymentMethod, setAddPaymentMethod] = useState(true);
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

  const [tokenReward, setTokenReward] = useState(INITIAL_TOKEN_REWARD_STATE);

  const [poapReward, setPoapReward] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const { activeOrg } = useContext(GlobalContext);
  const [rewardType, setRewardType] = useState(PAYMENT_OPTIONS.DISCORD_ROLE);
  const [addOrgLevelReward] = useMutation(ADD_ORG_LEVEL_REWARD, {
    refetchQueries: ["getOrgLevelsRewards"],
  });

  const [createPaymentMethod] = useMutation(CREATE_CMTY_PAYMENT_METHOD, {
    refetchQueries: [GET_CMTY_PAYMENT_METHODS_FOR_ORG],
  });
  const [getCmtyOrgDiscordRoles, { data: getCmtyOrgDiscordRolesData, variables }] = useLazyQuery(
    GET_ORG_DISCORD_ROLES,
    {
      fetchPolicy: "cache-and-network",
    }
  );

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
      getCmtyOrgDiscordRoles({
        variables: {
          orgId: activeOrg?.id,
        },
      });
    }
  }, [activeOrg?.id]);

  useEffect(() => {
    if (activeOrg?.id) {
      getCmtyPaymentMethods({
        variables: {
          orgId: activeOrg?.id,
        },
      }).then((data) => {
        if (data?.data?.getCmtyPaymentMethodsForOrg?.length > 0) {
          setAddPaymentMethod(false);
        }
      });
    }
  }, [activeOrg?.id]);
  const discordRoleData = getCmtyOrgDiscordRolesData?.getCmtyOrgDiscordRoles || [];
  const discordRoles =
    getCmtyOrgDiscordRolesData?.getCmtyOrgDiscordRoles?.length > 0
      ? getCmtyOrgDiscordRolesData?.getCmtyOrgDiscordRoles[0]?.roles
      : [];
  const componentsOptions = discordRoles?.map((role) => ({
    label: role.name,
    value: role.id,
  }));

  const onRewardAdd = async (reward) => {
    let input: AddOrgLevelRewardInput = {
      orgId: activeOrg?.id,
      level: level,
      type: reward?.type,
    }
    if (reward?.type === PAYMENT_OPTIONS.TOKEN) {
      input.paymentMethodId = reward?.paymentMethodId;
      input.amount = reward?.amount;
    }
    if (reward?.type === PAYMENT_OPTIONS.DISCORD_ROLE) {
      input.discordRewardData = reward?.discordRewardData;
    }
    if (reward?.type === PAYMENT_OPTIONS.POAP) {
      input.discordRewardData = reward?.poapRewardData;
    }
    addOrgLevelReward({
      variables: {
        input,
      },
    }).then(() => {
      refetchLevelRewards();
    });
  };

  const handleToggle = () => {
    setDiscordRoleReward(null);
    setTokenReward(INITIAL_TOKEN_REWARD_STATE);
    setPoapReward(null);
    setRewardType(PAYMENT_OPTIONS.DISCORD_ROLE);
    setPaymentMethod(null);
    setIsRewardModalOpen((prev) => !prev);
  };

  const handleReward = () => {
    if (rewardType === PAYMENT_OPTIONS.DISCORD_ROLE) {
      const discordRoleSelected = componentsOptions.find((option) => option.value === discordRoleReward);
      onRewardAdd({
        type: rewardType,
        discordRewardData: {
          discordRoleId: discordRoleSelected?.value,
          discordGuildId: discordRoleData[0]?.guildId,
          discordRoleName: discordRoleSelected?.label,
        },
      });
      handleToggle();
    } else if (rewardType === PAYMENT_OPTIONS.TOKEN) {
      if (paymentMethod) {
        if (!tokenReward?.amount) {
          setErrors({
            ...errors,
            tokenAmount: "Please enter the amount of tokens to be rewarded",
          });
          return;
        }
        // check if an existing reward is made with the same payment method - if so just edit
        onRewardAdd({
          type: rewardType,
          paymentMethodId: paymentMethod?.id,
          paymentMethod,
          amount: Number(tokenReward?.amount),
        });

        handleToggle();
      } else if (addPaymentMethod) {
        // Create payment method and then add reward
        if (!tokenReward?.contractAddress) {
          setErrors({
            ...errors,
            contractAddress: "Please enter the contract address",
          });
          return;
        }
        if (!tokenReward?.chain) {
          setErrors({
            ...errors,
            chain: "Please select the appropriate chain",
          });
          return;
        }
        if (!tokenReward?.type) {
          setErrors({
            ...errors,
            tokenType: "Please select the token type",
          });
          return;
        }
        if (!tokenReward?.amount) {
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
              contractAddress: tokenReward?.contractAddress,
              tokenName: tokenReward?.tokenName,
              symbol: tokenReward?.symbol,
              icon: tokenReward?.icon,
              chain: tokenReward?.chain,
              type: tokenReward?.type.toUpperCase(),
            },
          },
        })
          .then((res) => {
            const paymentMethod = res?.data?.createCmtyPaymentMethod;
            onRewardAdd({
              type: rewardType,
              paymentMethodId: paymentMethod?.id,
              amount: tokenReward?.amount,
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
    } else if (rewardType === PAYMENT_OPTIONS.POAP) {
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
      handleToggle();
    }
  };

  return (
    <Grid container direction="column" gap="14px" justifyContent="flex-start">
      <Modal
        open={isRewardModalOpen}
        onClose={handleToggle}
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
            handleReward={handleReward}
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

                // if (plan === PricingOptionsTitle.Basic) {
                //   setPaywall(true);
                //   setPaywallMessage("This reward option is not available under the basic plan.");
                //   return;
                // } else {
                //   setRewardType(PAYMENT_OPTIONS.TOKEN);
                // }
              }}
            >
              Token reward
            </SharedBlackOutlineButton>
          </Box>

          <RewardMethod
            rewardType={rewardType}
            componentsOptions={componentsOptions}
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
      </Modal>
    </Grid>
  );
};

export { RewardConfigModal };
