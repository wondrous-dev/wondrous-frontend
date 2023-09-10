import { useLazyQuery, useMutation } from "@apollo/client";
import WestIcon from "@mui/icons-material/West";
import { Box, ButtonBase, Divider, Grid, InputAdornment, TextField as MUITextField, Typography } from "@mui/material";
import Arbitrum from "assets/arbitrum";
import Avalanche from "assets/avalanche";
import Base from "assets/base.svg";
import Binance from "assets/binance";
import Ethereum from "assets/ethereum";
import Optimism from "assets/optimism";
import Polygon from "assets/polygonMaticLogo.svg";
import CloseModalIcon from "components/Icons/CloseModal";
import SelectComponent from "components/Shared/Select";
import TextField from "components/Shared/TextField";
import { SharedSecondaryButton } from "components/Shared/styles";
import { UPDATE_CMTY_PAYMENT_METHOD } from "graphql/mutations/payment";
import { GET_POAP_EVENT } from "graphql/queries";
import { useEffect, useState } from "react";
import {
  Label,
  PaymentMethodRowContainer,
  PaymentMethodRowHeader,
  PaymentMethodSecondRowHeader,
  PaymentRowContentBox,
  PaymentRowContentText,
  PoapImage,
} from "./styles";

export const PAYMENT_OPTIONS = {
  DISCORD_ROLE: "discord_role",
  TOKEN: "token",
  POAP: "poap",
};

const REWARD_TYPES = [
  { label: "ERC20", value: "erc20" },
  { label: "ERC721", value: "erc721" },
  { label: "ERC1155", value: "erc1155" },
];

const isDev = !import.meta.env.VITE_PRODUCTION;

export const CHAIN_SELECT_OPTIONS = [
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
  isDev
    ? {
        label: "Goerli",
        value: "goerli",
        icon: (
          <Ethereum
            style={{
              width: "20px",
              marginRight: "8px",
            }}
          />
        ),
      }
    : {},
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
  {
    label: "Base",
    value: "base",
    icon: (
      <img
        style={{
          width: "20px",
          marginRight: "8px",
        }}
        src={Base}
      />
    ),
  },
];

export const PaymentMethodRow = ({ paymentMethod, setPaymentMethod, setEditPaymentMethod, index }) => {
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
        <SharedSecondaryButton
          style={{
            background: "white",
            border: "1px solid black",
            marginRight: "8px",
          }}
          onClick={() => {
            setEditPaymentMethod({
              ...paymentMethod,
              tokenName: paymentMethod?.name,
              type: paymentMethod?.type?.toLowerCase(),
            });
          }}
        >
          Edit
        </SharedSecondaryButton>
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
  editPaymentMethod,
  setEditPaymentMethod,
  setErrors,
  errors,
  poapReward,
  setPoapReward,
}) => {
  const [getPoapEventInfo] = useLazyQuery(GET_POAP_EVENT);

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
  if (rewardType === PAYMENT_OPTIONS.POAP) {
    return (
      <>
        <Label>Poap event ID * </Label>
        <TextField
          placeholder="Please enter your POAP event ID"
          value={poapReward?.id}
          onChange={(value) => {
            setPoapReward({
              ...poapReward,
              id: value,
            });
          }}
          multiline={false}
          error={errors?.poapEventId}
          onBlur={() => {
            if (poapReward?.id) {
              getPoapEventInfo({
                variables: {
                  eventId: poapReward?.id,
                },
              })
                .then((res) => {
                  const poapEvent = res?.data?.getQuestRewardPoapEvent;
                  if (poapEvent) {
                    setPoapReward({
                      id: poapEvent?.id,
                      name: poapEvent?.name,
                      description: poapEvent?.description,
                      startDate: poapEvent?.startDate,
                      endDate: poapEvent?.endDate,
                      eventUrl: poapEvent?.eventUrl,
                      imageUrl: poapEvent?.imageUrl,
                      expiryDate: poapEvent?.expiryDate,
                    });
                  } else {
                    setErrors({
                      ...errors,
                      poapEventId: "Invalid poap event - please use the right event ID",
                    });
                  }
                })
                .catch((err) => {
                  setErrors({
                    ...errors,
                    poapEventId: "Invalid poap event - please use the right event ID",
                  });
                });
            }
          }}
        />
        <Label>Poap event secret * (check your emails for this) </Label>
        <TextField
          placeholder="Please enter your 6 digit POAP event secret"
          value={poapReward?.eventSecret}
          onChange={(value) => {
            setPoapReward({
              ...poapReward,
              eventSecret: value,
            });
          }}
          multiline={false}
          error={errors?.eventSecret}
        />
        <Label>Poap name</Label>
        <TextField
          onChange={() => {}}
          placeholder="Poap name"
          value={poapReward?.name}
          multiline={false}
          disabled={true}
        />
        <Label>Poap description</Label>
        <TextField
          onChange={() => {}}
          placeholder="Poap description"
          value={poapReward?.description}
          multiline={false}
          disabled={true}
        />
        {poapReward?.imageUrl && (
          <>
            <Label>Poap badge</Label>
            <PoapImage src={poapReward?.imageUrl} />
          </>
        )}
        {poapReward?.eventUrl && (
          <>
            <Label>Poap event url</Label>
            <TextField
              onChange={() => {}}
              placeholder="Poap event url"
              value={poapReward?.eventUrl}
              disabled={true}
              multiline={false}
            />
          </>
        )}
      </>
    );
  }
  if (rewardType === PAYMENT_OPTIONS.TOKEN) {
    if (paymentMethod && !editPaymentMethod?.id) {
      return (
        <AddExistingPaymentMethod
          paymentMethod={paymentMethod}
          setTokenReward={setTokenReward}
          tokenReward={tokenReward}
          errors={errors}
        />
      );
    }
    if (!addPaymentMethod && !editPaymentMethod?.id) {
      return (
        <>
          {paymentMethods?.map((paymentMethod, index) => (
            <PaymentMethodRow
              paymentMethod={paymentMethod}
              index={index + 1}
              setPaymentMethod={setPaymentMethod}
              setEditPaymentMethod={setEditPaymentMethod}
            />
          ))}
        </>
      );
    }
    return (
      <>
        <Label>Chain</Label>
        <SelectComponent
          options={CHAIN_SELECT_OPTIONS}
          value={editPaymentMethod?.id ? editPaymentMethod?.chain : tokenReward?.chain}
          onChange={(value) => {
            if (editPaymentMethod?.id) {
              setEditPaymentMethod({
                ...editPaymentMethod,
                chain: value,
              });
            } else {
              setTokenReward({
                ...tokenReward,
                chain: value,
              });
            }
          }}
          error={errors?.chain}
        />
        <Label>Token type</Label>
        <SelectComponent
          options={REWARD_TYPES}
          value={editPaymentMethod?.id ? editPaymentMethod?.type : tokenReward?.type}
          onChange={(value) => {
            if (editPaymentMethod?.id) {
              setEditPaymentMethod({
                ...editPaymentMethod,
                type: value,
              });
            } else {
              setTokenReward({
                ...tokenReward,
                type: value,
              });
            }
          }}
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
          value={editPaymentMethod?.id ? editPaymentMethod?.contractAddress : tokenReward?.contractAddress}
          onChange={(value) => {
            if (editPaymentMethod?.id) {
              setEditPaymentMethod({
                ...editPaymentMethod,
                contractAddress: value,
              });
            } else {
              setTokenReward({
                ...tokenReward,
                contractAddress: value,
              });
            }
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
          value={editPaymentMethod?.id ? editPaymentMethod?.tokenName : tokenReward?.tokenName}
          onChange={(value) => {
            if (editPaymentMethod?.id) {
              setEditPaymentMethod({
                ...editPaymentMethod,
                tokenName: value,
              });
            } else {
              setTokenReward({
                ...tokenReward,
                tokenName: value,
              });
            }
          }}
          multiline={false}
        />
        {!editPaymentMethod?.id && (
          <>
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
        )}
      </>
    );
  }
};

export const RewardFooterLeftComponent = ({
  rewardType,
  paymentMethod,
  setPaymentMethod,
  addPaymentMethod,
  handleReward,
  setAddPaymentMethod,
  editPaymentMethod,
  setEditPaymentMethod,
}) => {
  const [updateCmtyPaymentMethod] = useMutation(UPDATE_CMTY_PAYMENT_METHOD, {
    refetchQueries: ["getCmtyPaymentMethodsForOrg"],
  });
  if (editPaymentMethod?.id) {
    return (
      <SharedSecondaryButton
        onClick={() => {
          updateCmtyPaymentMethod({
            variables: {
              paymentMethodId: editPaymentMethod?.id,
              input: {
                contractAddress: editPaymentMethod?.contractAddress,
                tokenName: editPaymentMethod?.tokenName,
                chain: editPaymentMethod?.chain,
                type: editPaymentMethod?.type.toUpperCase(),
              },
            },
          }).then(() => {
            setEditPaymentMethod({
              id: null,
              tokenName: null,
              contractAddress: null,
              symbol: null,
              icon: null,
              type: null,
              chain: null,
              amount: null,
            });
          });
        }}
      >
        Edit payment method
      </SharedSecondaryButton>
    );
  }
  if (
    addPaymentMethod ||
    paymentMethod ||
    rewardType === PAYMENT_OPTIONS.POAP ||
    rewardType === PAYMENT_OPTIONS.DISCORD_ROLE
  ) {
    return (
      <>
        {rewardType !== PAYMENT_OPTIONS.POAP && rewardType !== PAYMENT_OPTIONS.DISCORD_ROLE && (
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
        )}
        <SharedSecondaryButton onClick={handleReward}>Add Reward</SharedSecondaryButton>
      </>
    );
  } else {
    return <SharedSecondaryButton onClick={() => setAddPaymentMethod(true)}>New payment method</SharedSecondaryButton>;
  }
};

export const ExistingPaymentMethodSelectComponent = ({ options, initialReward, setQuestSettings }) => {
  const [reward, setPaymentReward] = useState(null);
  const initialRewardId = initialReward?.paymentMethodId;
  useEffect(() => {
    if (initialRewardId) {
      setPaymentReward(initialRewardId);
    }
  }, [initialRewardId]);
  return (
    <SelectComponent
      options={options}
      value={reward}
      disabled
      onChange={(value) => {
        setPaymentReward(value);
        setQuestSettings((prev) => {
          return {
            ...prev,
            rewards: prev.rewards.map((reward) => {
              if (reward.type === PAYMENT_OPTIONS.TOKEN && reward.paymentMethod?.id === initialRewardId) {
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

const RemoveRewardComponent = ({ onClick }) => {
  return (
    <Grid
      container
      item
      alignItems="center"
      justifyContent="center"
      width="24px"
      height="24px"
      onClick={onClick}
      sx={{
        cursor: "pointer",
      }}
    >
      <CloseModalIcon strokeColor="#4D4D4D" />
    </Grid>
  );
};

export const RewardWrapper = ({ idx, showNewRewardAutocomplete, rewards, handleOnRemove, Icon, text }) => (
  <Grid
    container
    item
    alignItems="center"
    justifyContent="space-between"
    sx={{
      width: "100%",
      ...(!showNewRewardAutocomplete && rewards.length === idx + 1 ? { flex: 1 } : { flex: "0 1 auto" }),
    }}
    bgcolor="#E8E8E8"
    padding="8px"
    borderRadius="6px"
    gap="8px"
  >
    <Grid container item gap="8px" flex="1">
      <Icon />
      <Typography color="#000000" fontWeight="500" fontFamily="Poppins">
        {text}
      </Typography>
    </Grid>
    <RemoveRewardComponent onClick={handleOnRemove} />
  </Grid>
);

export const RewardWrapperWithTextField = ({
  showNewRewardAutocomplete,
  rewards,
  idx,
  handleOnChange,
  reward,
  text,
  Icon,
  handleOnRemove = null,
  placeholder,
}) => {
  const rewardValue = reward?.value ?? reward?.amount ? Number(reward?.value ?? reward?.amount) : "";
  return (
    <Grid
      container
      item
      sx={{
        width: "100%",

        flex: "0 1 auto",
        ...(!showNewRewardAutocomplete && rewards.length === idx + 1
          ? { flex: 1, maxWidth: "calc(100% - 50px)" }
          : { flex: "0 1 auto" }),
      }}
    >
      <MUITextField
        placeholder={placeholder}
        variant="standard"
        value={rewardValue}
        onChange={handleOnChange}
        type="number"
        InputProps={{
          disableUnderline: true,
          inputMode: "numeric",
          sx: {
            padding: "8px 10px",
            background: "#E8E8E8",
            "& input": {
              width: rewardValue ? `${String(rewardValue).length + 1}ch` : "100%",
              fontFamily: "Poppins",
              fontWeight: 500,
              padding: 0,
            },
            "& input[type=number]": {
              "-moz-appearance": "textfield",
            },
            "& input[type=number]::-webkit-outer-spin-button": {
              "-webkit-appearance": "none",
              margin: 0,
            },
            "& input[type=number]::-webkit-inner-spin-button": {
              "-webkit-appearance": "none",
              margin: 0,
            },
          },
          startAdornment: (
            <InputAdornment position="start">
              <Icon />
            </InputAdornment>
          ),
          endAdornment: (
            <>
              <Grid container item flex="1" justifyContent="space-between" flexWrap="nowrap">
                {rewardValue ? (
                  <Typography fontFamily="Poppins" fontWeight="500">
                    {typeof rewardValue === "number" ? text : null}
                  </Typography>
                ) : null}
                {handleOnRemove && <RemoveRewardComponent onClick={handleOnRemove} />}
              </Grid>
            </>
          ),
        }}
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: "6px",
          "&:focus-within": {
            outline: "1px solid #000",
            "& p": {
              color: "#949494",
            },
          },
        }}
      />
    </Grid>
  );
};

export const RewardsComponent = ({ rewards, rewardComponents }) => {
  return (
    <>
      {rewards?.map((reward, idx) => {
        const Component = rewardComponents[reward?.type];
        if (Component) {
          return <>{Component({ idx, reward })}</>;
        }
        return null;
      })}
    </>
  );
};
