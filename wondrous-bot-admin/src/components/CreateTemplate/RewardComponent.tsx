import { Box, Divider, Grid, Typography } from "@mui/material";
import TextField from "components/Shared/TextField";
import { SharedBlackOutlineButton, SharedSecondaryButton } from "components/Shared/styles";
import { CampaignOverviewTitle, Label } from "./styles";
import SelectComponent from "components/Shared/Select";
import { useMemo, useState } from "react";
import Modal from "components/Shared/Modal";
import { useDiscordRoles } from "utils/discord";
import { useContext } from "react";
import GlobalContext from "utils/context/GlobalContext";
import DeleteIcon from "components/Icons/Delete";
import { useEffect } from "react";
import { GET_ORG_DISCORD_ROLES } from "graphql/queries/discord";
import { useLazyQuery, useMutation } from "@apollo/client";
import Arbitrum from "assets/arbitrum";
import Binance from "assets/binance";
import Ethereum from "assets/ethereum";
import Avalanche from "assets/avalanche";
import Optimism from "assets/optimism";
import Polygon from "assets/polygonMaticLogo.svg";
import { CREATE_CMTY_PAYMENT_METHOD } from "graphql/mutations/payment";
import { GET_NFT_INFO, GET_TOKEN_INFO } from "graphql/queries/payment";

const PAYMENT_OPTIONS = {
  DISCORD_ROLE: "discord_role",
  NFT: "nft",
  TOKEN: "token",
};

const REWARD_TYPES = [
  { label: "ERC20", value: "erc20" },
  { label: "ERC721", value: "erc721" },
  { label: "ERC1155", value: "erc1155" },
];

const CHAIN_SELECT_OPTIONS = [
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
  {
    label: "Optimism",
    value: "optimism",
    icon: (
      <Optimism
        style={{
          width: "20px",
          marginRight: "8px",
        }}
      />
    ),
  },
  {
    label: "Arbitrum",
    value: "arbitrum",
    icon: (
      <Arbitrum
        style={{
          width: "20px",
          marginRight: "8px",
        }}
      />
    ),
  },
  {
    label: "BNB",
    value: "bsc",
    icon: (
      <Binance
        style={{
          width: "20px",
          marginRight: "8px",
        }}
      />
    ),
  },
  {
    label: "Avalanche",
    value: "avalanche",
    icon: (
      <Avalanche
        style={{
          width: "20px",
          marginRight: "8px",
        }}
      />
    ),
  },
];

const PaymentMethodRows = ({ paymentMethods, setPaymentMethods }) => {};
const ExistingDiscordRewardSelectComponent = ({ options, initialReward, setQuestSettings }) => {
  const [reward, setDiscordRoleReward] = useState(null);
  const initialRewardId = initialReward?.discordRewardData?.discordRoleId;
  useEffect(() => {
    if (initialRewardId) {
      setDiscordRoleReward(initialRewardId);
    }
  }, [initialRewardId]);
  return (
    <SelectComponent
      boxStyle={{
        flex: 1,
      }}
      options={options}
      value={reward}
      onChange={(value) => {
        setDiscordRoleReward(value);
        setQuestSettings((prev) => {
          return {
            ...prev,
            rewards: prev.rewards.map((reward) => {
              if (reward.type === "discord_role" && reward.discordRewardData.discordRoleId === initialRewardId) {
                return {
                  ...reward,
                  discordRewardData: {
                    ...reward.discordRewardData,
                    discordRoleId: value,
                  },
                };
              }
              return reward;
            }),
          };
        });
      }}
    />
  );
};

const RewardMethod = ({
  rewardType,
  componentsOptions,
  discordRoleReward,
  setDiscordRoleReward,
  tokenReward,
  setTokenReward,
}) => {
  const [getTokenInfo] = useLazyQuery(GET_TOKEN_INFO, {
    onCompleted: (data) => {
      setTokenReward({
        ...tokenReward,
        tokenName: data?.getTokenInfo?.name,
        symbol: data?.getTokenInfo?.symbol,
        icon: data?.getTokenInfo?.icon,
      });
    },
    fetchPolicy: "network-only",
  });

  const [getNFTInfo] = useLazyQuery(GET_NFT_INFO, {
    onCompleted: (data) => {
      setTokenReward({
        ...tokenReward,
        tokenName: data?.getTokenInfo?.name,
        symbol: data?.getTokenInfo?.symbol,
        icon: data?.getTokenInfo?.icon,
      });
    },
    fetchPolicy: "network-only",
  });
  const searchSelectedTokenInList = (contractAddress, chain, existingList = [], tokenId = "") => {
    if (tokenReward?.type === "ERC20") {
      getTokenInfo({
        variables: {
          contractAddress,
          chain,
        },
      });
    }
    if (tokenReward?.type === "ERC721") {
      getNFTInfo({
        variables: {
          contractAddress,
          chain,
          tokenType: "ERC721",
        },
      });
    }
    if (tokenReward?.type === "ERC1155") {
      getNFTInfo({
        variables: {
          contractAddress,
          chain,
          tokenType: "ERC1155",
          tokenId,
        },
      });
    }
  };

  if (rewardType === PAYMENT_OPTIONS.DISCORD_ROLE) {
    return (
      <>
        <Label>Select role</Label>
        <SelectComponent
          options={componentsOptions}
          value={discordRoleReward}
          onChange={(value) => setDiscordRoleReward(value)}
        />
      </>
    );
  }
  if (rewardType === PAYMENT_OPTIONS.NFT) {
    return (
      <>
        <Label>Chain</Label>
        <SelectComponent
          options={CHAIN_SELECT_OPTIONS}
          value={tokenReward?.chain}
          onChange={(value) =>
            setTokenReward({
              ...tokenReward,
              chain: value,
            })
          }
        />
        <Label>Token type</Label>
        <SelectComponent
          options={REWARD_TYPES}
          value={tokenReward?.type}
          onChange={(value) =>
            setTokenReward({
              ...tokenReward,
              type: value,
            })
          }
        />
        <Label
          style={{
            marginTop: "4px",
          }}
        >
          Token
        </Label>
        <TextField
          placeholder="Please paste in the contract address"
          value={tokenReward?.contractAddress}
          onChange={(value) => {
            console.log("tokenREward", tokenReward);

            setTokenReward({
              ...tokenReward,
              contractAddress: value,
            });
          }}
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
          value={tokenReward?.tokenName}
          onChange={(value) => {
            setTokenReward({
              ...tokenReward,
              tokenName: value,
            });
          }}
          multiline={false}
        />
        <Label
          style={{
            marginTop: "4px",
          }}
        >
          Amount
        </Label>
        <TextField
          placeholder="Please enter the amount of tokens to be rewarded"
          value={tokenReward?.amount}
          onChange={(value) =>
            setTokenReward({
              ...tokenReward,
              amount: value,
            })
          }
          multiline={false}
          type="number"
        />
      </>
    );
  }
};
const RewardComponent = ({ rewards, setQuestSettings }) => {
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [discordRoleReward, setDiscordRoleReward] = useState(null);
  const [addPaymentMethod, setAddPaymentMethod] = useState(true);
  const [tokenReward, setTokenReward] = useState({
    tokenName: null,
    contractAddress: null,
    symbol: null,
    icon: null,
    type: null,
    chain: null,
  });
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [tokenAmount, setTokenAmount] = useState(null);
  const { activeOrg } = useContext(GlobalContext);
  const [rewardType, setRewardType] = useState(PAYMENT_OPTIONS.DISCORD_ROLE);
  const [createPaymentMethod] = useMutation(CREATE_CMTY_PAYMENT_METHOD);
  const [getCmtyOrgDiscordRoles, { data: getCmtyOrgDiscordRolesData, variables }] = useLazyQuery(
    GET_ORG_DISCORD_ROLES,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  useEffect(() => {
    getCmtyOrgDiscordRoles({
      variables: {
        orgId: activeOrg?.id,
      },
    });
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
  console.log("tokenREward", tokenReward);
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
        if (r.type === "discord_role") {
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
        onRewardAdd({
          type: rewardType,
          paymentMethodId: paymentMethod?.id,
          paymentMethod,
          amount: tokenAmount,
        });
        setIsRewardModalOpen(false);
      } else if (addPaymentMethod) {
        // Create payment method and then add reward
        createPaymentMethod({
          variables: {
            input: {
              orgId: activeOrg?.id,
              contractAddress: tokenReward?.contractAddress,
              tokenName: tokenReward?.tokenName,
              symbol: tokenReward?.symbol,
              icon: tokenReward?.icon,
              chain: tokenReward?.chain,
              type: tokenReward?.type,
            },
          },
        }).then((res) => {
          const paymentMethod = res?.data?.createCmtyPaymentMethod;
          onRewardAdd({
            type: rewardType,
            paymentMethodId: paymentMethod?.id,
            amount: tokenAmount,
            paymentMethod,
          });
        });
      }
    }
  };
  return (
    <Grid container direction="column" gap="14px" justifyContent="flex-start">
      <Modal
        open={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
        title="Add reward to quest"
        maxWidth={800}
        footerLeft={<SharedSecondaryButton onClick={handleReward}>Add reward</SharedSecondaryButton>}
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
              background={PAYMENT_OPTIONS.NFT === rewardType ? "#BFB4F3" : "#FFFFF"}
              onClick={() => setRewardType(PAYMENT_OPTIONS.NFT)}
            >
              Token reward
            </SharedBlackOutlineButton>
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
          />
        </Grid>
      </Modal>

      {rewards?.map((reward, idx) => {
        if (reward.type === "points") {
          return (
            <Grid display="flex" gap="14px" alignItems="center" key={idx}>
              <Typography
                fontFamily="Poppins"
                fontStyle="normal"
                fontWeight={600}
                fontSize="13px"
                lineHeight="15px"
                color="#626262"
                whiteSpace={"nowrap"}
              >
                Points
              </Typography>
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
        } else if (reward.type === "discord_role") {
          return (
            <Grid display="flex" gap="14px" alignItems="center" key={idx}>
              <Typography
                fontFamily="Poppins"
                fontStyle="normal"
                fontWeight={600}
                fontSize="13px"
                lineHeight="15px"
                color="#626262"
                whiteSpace={"nowrap"}
              >
                Discord role
              </Typography>
              <ExistingDiscordRewardSelectComponent
                options={componentsOptions}
                initialReward={reward}
                setQuestSettings={setQuestSettings}
              />
              <DeleteIcon onClick={() => onDiscordRoleRewardRemove(reward)} />
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
