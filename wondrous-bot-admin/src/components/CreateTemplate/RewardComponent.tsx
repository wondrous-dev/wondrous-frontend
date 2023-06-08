import { Box, ButtonBase, Divider, Grid, Typography } from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import TextField from "components/Shared/TextField";
import { ErrorText, SharedBlackOutlineButton, SharedSecondaryButton } from "components/Shared/styles";
import { CampaignOverviewTitle, RewardHeaderText } from "./styles";
import React, { useState } from "react";
import Modal from "components/Shared/Modal";
import { useContext } from "react";
import GlobalContext from "utils/context/GlobalContext";
import DeleteIcon from "components/Icons/Delete";
import { useEffect } from "react";
import { GET_ORG_DISCORD_ROLES } from "graphql/queries/discord";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_CMTY_PAYMENT_METHOD } from "graphql/mutations/payment";
import truncateEthAddress from "truncate-eth-address";
import { GET_CMTY_PAYMENT_METHODS_FOR_ORG, GET_NFT_INFO, GET_TOKEN_INFO } from "graphql/queries/payment";
import {
  PAYMENT_OPTIONS,
  ExistingDiscordRewardSelectComponent,
  RewardFooterLeftComponent,
  RewardMethod,
  ExistingPaymentMethodSelectComponent,
} from "components/CreateTemplate/RewardUtils";

const RewardComponent = ({ rewards, setQuestSettings }) => {
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
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
  const [tokenReward, setTokenReward] = useState({
    tokenName: null,
    contractAddress: null,
    symbol: null,
    icon: null,
    type: null,
    chain: null,
    amount: null,
  });

  const [poapEventId, setPoapEventId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const { activeOrg } = useContext(GlobalContext);
  const [rewardType, setRewardType] = useState(PAYMENT_OPTIONS.DISCORD_ROLE);
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
  const handleChange = (key, value) => {
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

  const onRewardAdd = (reward) => {
    setQuestSettings((prev) => {
      return {
        ...prev,
        rewards: [...prev.rewards, reward],
      };
    });
  };

  const onDiscordRoleRewardRemove = (reward) => {
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

  const OnPaymentMethodRewardRemove = (reward) => {
    setQuestSettings((prev) => {
      const newRewards = prev.rewards.filter((r) => {
        if (r.type === PAYMENT_OPTIONS.NFT || r.type === PAYMENT_OPTIONS.TOKEN) {
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
  const handleReward = () => {
    if (rewardType === PAYMENT_OPTIONS.DISCORD_ROLE) {
      const discordRoleSelected = componentsOptions.find((option) => option.value === discordRoleReward);
      const discordRoleAlreadyExists = rewards.some(
        (reward) =>
          reward.type === "discord_role" && reward.discordRewardData.discordRoleId === discordRoleSelected?.value
      );
      if (!discordRoleAlreadyExists) {
        onRewardAdd({
          type: rewardType,
          discordRewardData: {
            discordRoleId: discordRoleSelected?.value,
            discordGuildId: discordRoleData[0]?.guildId,
            discordRoleName: discordRoleSelected?.label,
          },
        });
      }
      setIsRewardModalOpen(false);
    } else if (rewardType === PAYMENT_OPTIONS.NFT || rewardType === PAYMENT_OPTIONS.TOKEN) {
      if (paymentMethod) {
        if (!tokenReward?.amount) {
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
              amount: Number(tokenReward?.amount) + Number(reward?.amount),
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
            amount: Number(tokenReward?.amount),
          });
        }
        setIsRewardModalOpen(false);
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
            setIsRewardModalOpen(false);
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
      if (!poapEventId) {
        setErrors({
          ...errors,
          poapEventId: "Please enter the POAP event ID",
        });
        return;
      }
      onRewardAdd({
        type: rewardType,
        poapEventId,
      });
      setIsRewardModalOpen(false);
    }
  };

  return (
    <Grid container direction="column" gap="14px" justifyContent="flex-start">
      <Modal
        open={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
        title="Add reward to quest"
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
            {/* <SharedBlackOutlineButton
              style={{
                flex: 1,
              }}
              background={PAYMENT_OPTIONS.NFT === rewardType ? "#BFB4F3" : "#FFFFF"}
              onClick={() => setRewardType(PAYMENT_OPTIONS.NFT)}
            >
              Token reward
            </SharedBlackOutlineButton> */}
            {/* <SharedBlackOutlineButton
              style={{
                flex: 1,
              }}
              background={PAYMENT_OPTIONS.TOKEN === rewardType ? "#BFB4F3" : "#FFFFF"}
              onClick={() => setRewardType(PAYMENT_OPTIONS.TOKEN)}
            >
              ERC20 tokens
            </SharedBlackOutlineButton> */}
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
            poapEventId={poapEventId}
            setPoapEventId={setPoapEventId}
          />
        </Grid>
      </Modal>

      {rewards?.map((reward, idx) => {
        if (reward?.type === "points") {
          return (
            <Grid display="flex" gap="14px" alignItems="center" key={idx}>
              <RewardHeaderText>Points</RewardHeaderText>
              <TextField
                value={reward.value}
                type="number"
                multiline={false}
                onChange={(value) => {
                  handleChange(reward.type, value);
                }}
              />
            </Grid>
          );
        } else if (reward.type === PAYMENT_OPTIONS.DISCORD_ROLE) {
          return (
            <Grid display="flex" gap="14px" alignItems="center" key={idx}>
              <RewardHeaderText>Discord role</RewardHeaderText>
              <ExistingDiscordRewardSelectComponent
                options={componentsOptions}
                initialReward={reward}
                setQuestSettings={setQuestSettings}
              />
              <DeleteIcon
                style={{
                  cursor: "pointer",
                }}
                onClick={() => onDiscordRoleRewardRemove(reward)}
              />
            </Grid>
          );
        } else if (reward.type === PAYMENT_OPTIONS.NFT) {
          return (
            <Grid display="flex" gap="14px" alignItems="center" key={idx} maxWidth="100%">
              <RewardHeaderText>Token</RewardHeaderText>
              <TextField
                boxStyles={{
                  width: "auto",
                }}
                style={{
                  maxWidth: "150px",
                }}
                Box
                value={reward.amount}
                type="number"
                multiline={false}
                onChange={(value) => {
                  setQuestSettings((prev) => {
                    return {
                      ...prev,
                      rewards: prev.rewards.map((compareReward) => {
                        if (
                          compareReward.type === PAYMENT_OPTIONS.NFT &&
                          compareReward.paymentMethod?.id === reward?.paymentMethod?.id
                        ) {
                          return {
                            ...reward,
                            amount: value,
                          };
                        }
                        return compareReward;
                      }),
                    };
                  });
                }}
              />
              <ExistingPaymentMethodSelectComponent
                options={paymentMethodOptions?.length > 0 ? paymentMethodOptions : []}
                initialReward={reward}
                setQuestSettings={setQuestSettings}
              />
              <div
                style={{
                  flex: 1,
                }}
              />
              <DeleteIcon
                style={{
                  width: "40px",
                  cursor: "pointer",
                }}
                onClick={() => OnPaymentMethodRewardRemove(reward)}
              />
            </Grid>
          );
        }
        return null;
      })}

      <Divider color="#767676" />
      <Box>
        <SharedSecondaryButton onClick={() => setIsRewardModalOpen(true)}>Add more</SharedSecondaryButton>
      </Box>
    </Grid>
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
