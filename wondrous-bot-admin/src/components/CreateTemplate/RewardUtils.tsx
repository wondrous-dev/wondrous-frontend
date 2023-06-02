import { Box, ButtonBase, Divider, Grid, Typography } from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import TextField from "components/Shared/TextField";
import { SharedSecondaryButton } from "components/Shared/styles";
import {
  Label,
  PaymentMethodRowContainer,
  PaymentMethodRowHeader,
  PaymentMethodSecondRowHeader,
  PaymentRowContentBox,
  PaymentRowContentText,
} from "./styles";
import SelectComponent from "components/Shared/Select";
import { useState } from "react";
import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import Arbitrum from "assets/arbitrum";
import Binance from "assets/binance";
import Ethereum from "assets/ethereum";
import Avalanche from "assets/avalanche";
import Optimism from "assets/optimism";
import Polygon from "assets/polygonMaticLogo.svg";
import { GET_NFT_INFO, GET_TOKEN_INFO } from "graphql/queries/payment";

export const PAYMENT_OPTIONS = {
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

export const PaymentMethodRow = ({ paymentMethod, setPaymentMethod, index }) => {
  return (
    <PaymentMethodRowContainer>
      <PaymentMethodRowHeader>
        Payment Method {index}:{" "}
        <span
          style={{
            color: "black",
          }}
        >
          {paymentMethod?.name || paymentMethod?.contractAddress}
        </span>
      </PaymentMethodRowHeader>
      <Box alignItems="center" display="flex" marginBottom="12px">
        <PaymentMethodSecondRowHeader>Chain</PaymentMethodSecondRowHeader>
        <PaymentRowContentBox>
          {CHAIN_SELECT_OPTIONS.find((option) => option.value === paymentMethod?.chain)?.icon}
          <PaymentRowContentText>{paymentMethod?.chain}</PaymentRowContentText>
        </PaymentRowContentBox>
        <PaymentMethodSecondRowHeader
          style={{
            marginLeft: "24px",
          }}
        >
          Token type
        </PaymentMethodSecondRowHeader>
        <PaymentRowContentBox>
          <PaymentRowContentText
            style={{
              textTransform: "uppercase",
            }}
          >
            {paymentMethod?.type}
          </PaymentRowContentText>
        </PaymentRowContentBox>
      </Box>
      <Box alignItems="center" display="flex" marginBottom="16px">
        <PaymentMethodSecondRowHeader
          style={{
            fontWeight: 600,
          }}
        >
          Token address
        </PaymentMethodSecondRowHeader>
        <PaymentRowContentBox>
          <PaymentRowContentText
            style={{
              textTransform: "uppercase",
            }}
          >
            {paymentMethod?.contractAddress}
          </PaymentRowContentText>
        </PaymentRowContentBox>
      </Box>
      <Divider color="#E8E8E8" />
      <Box justifyContent="flex-end" display="flex" marginTop="16px">
        <SharedSecondaryButton onClick={() => setPaymentMethod(paymentMethod)}>Add Reward</SharedSecondaryButton>
      </Box>
    </PaymentMethodRowContainer>
  );
};

export const AddExistingPaymentMethod = ({ paymentMethod, tokenReward, setTokenReward, errors }) => {
  return (
    <>
      <PaymentMethodRowHeader>
        Payment Method:{" "}
        <span
          style={{
            color: "black",
          }}
        >
          {paymentMethod?.name || paymentMethod?.contractAddress}
        </span>
      </PaymentMethodRowHeader>
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
        error={errors?.tokenAmount}
      />
    </>
  );
};

export const RewardMethod = ({
  rewardType,
  componentsOptions,
  discordRoleReward,
  setDiscordRoleReward,
  tokenReward,
  setTokenReward,
  paymentMethod,
  paymentMethods,
  addPaymentMethod,
  setPaymentMethod,
  errors,
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
    if (paymentMethod) {
      return (
        <AddExistingPaymentMethod
          paymentMethod={paymentMethod}
          setTokenReward={setTokenReward}
          tokenReward={tokenReward}
          errors={errors}
        />
      );
    }
    if (!addPaymentMethod) {
      return (
        <>
          {paymentMethods?.map((paymentMethod, index) => (
            <PaymentMethodRow paymentMethod={paymentMethod} index={index + 1} setPaymentMethod={setPaymentMethod} />
          ))}
        </>
      );
    }
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
          error={errors?.chain}
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
          error={errors?.tokenType}
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
            setTokenReward({
              ...tokenReward,
              contractAddress: value,
            });
          }}
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
          error={errors?.tokenAmount}
          type="number"
        />
      </>
    );
  }
};

export const RewardFooterLeftComponent = ({
  paymentMethod,
  setPaymentMethod,
  addPaymentMethod,
  handleReward,
  setAddPaymentMethod,
}) => {
  if (addPaymentMethod || paymentMethod) {
    return (
      <>
        <ButtonBase onClick={() => (paymentMethod ? setPaymentMethod(null) : setAddPaymentMethod(false))}>
          <Box
            height="40px"
            width="40px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="#2A8D5C"
            borderRadius="35px"
          >
            <WestIcon
              sx={{
                color: "white",
              }}
            />
          </Box>
        </ButtonBase>
        <SharedSecondaryButton onClick={handleReward}>Add Reward</SharedSecondaryButton>
      </>
    );
  } else {
    return <SharedSecondaryButton onClick={() => setAddPaymentMethod(true)}>New payment method</SharedSecondaryButton>;
  }
};

export const ExistingPaymentMethodSelectComponent = ({ options, initialReward, setQuestSettings }) => {
  const [reward, setPaymentReward] = useState(null);
  const initialRewardId = initialReward?.paymentMethod?.id;
  useEffect(() => {
    if (initialRewardId) {
      setPaymentReward(initialRewardId);
    }
  }, [initialRewardId]);
  return (
    <SelectComponent
      options={options}
      value={reward}
      onChange={(value) => {
        setPaymentReward(value);
        setQuestSettings((prev) => {
          return {
            ...prev,
            rewards: prev.rewards.map((reward) => {
              if (reward.type === PAYMENT_OPTIONS.NFT && reward.paymentMethod?.id === initialRewardId) {
                return {
                  ...reward,
                  paymentMethodId: value,
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

export const ExistingDiscordRewardSelectComponent = ({ options, initialReward, setQuestSettings }) => {
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
