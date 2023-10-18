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
import DeleteIcon from "components/Icons/Delete";
import SelectComponent from "components/Shared/Select";
import TextField from "components/Shared/TextField";
import { SharedBlackOutlineButton, SharedSecondaryButton } from "components/Shared/styles";
import { UPDATE_CMTY_PAYMENT_METHOD } from "graphql/mutations/payment";
import { GET_PERMISSION_TO_REWARD_ROLE, GET_POAP_EVENT } from "graphql/queries";
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
import DiscordRoleDisclaimer from "components/Shared/DiscordRoleDisclaimer";
import { useCommunityBadgePaymentMethods } from "./shared";
import TokenStoreItem from "components/CreateStoreItem/components/TokenStoreItem";

export const PAYMENT_OPTIONS = {
  DISCORD_ROLE: "discord_role",
  TOKEN: "token",
  POAP: "poap",
  COMMUNITY_BADGE: "COMMUNITY_BADGE",
};

const REWARD_TYPES = [
  { label: "ERC20", value: "erc20" },
  { label: "ERC721", value: "erc721" },
  { label: "ERC1155", value: "erc1155" },
];

const isDev = !import.meta.env.VITE_PRODUCTION;

export const TokenComponent = ({
  paymentMethod = null,
  setPaymentMethod = null,
  addPaymentMethod = null,
  tokenReward,
  setTokenReward,
  paymentMethods = null,
  editPaymentMethod = null,
  setEditPaymentMethod = null,
  errors,
  options = REWARD_TYPES,
  withAmount = true,
}) => {
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
        options={options}
        value={editPaymentMethod?.id && editPaymentMethod?.type ? editPaymentMethod?.type : tokenReward?.type}
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
        error={errors?.tokenType || errors?.type}
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
      {!editPaymentMethod?.id && withAmount && (
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
};

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
  guildId,
}) => {
  const [getPoapEventInfo] = useLazyQuery(GET_POAP_EVENT);
  const [displayRoleDisclaimer, setDisplayRoleDisclaimer] = useState(false);
  const [getPermissionToRewardRole, { data, loading }] = useLazyQuery(GET_PERMISSION_TO_REWARD_ROLE, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-and-network",
  });

  const { data: cmtyBadgePaymentMethods, refetch } = useCommunityBadgePaymentMethods({
    shouldFetch: rewardType === PAYMENT_OPTIONS.COMMUNITY_BADGE,
    asOptions: true,
  });

  const handleRoleChange = async (value) => {
    const { data } = await getPermissionToRewardRole({
      variables: {
        roleId: value,
        guildId,
      },
    });
    if (data?.getPermissionToRewardRole?.success === true) {
      return setDiscordRoleReward(value);
    }
    setDisplayRoleDisclaimer(value);
  };

  if (displayRoleDisclaimer) {
    return <DiscordRoleDisclaimer onClose={() => setDisplayRoleDisclaimer(false)} />;
  }

  if (rewardType === PAYMENT_OPTIONS.COMMUNITY_BADGE) {
    const handleTokenStoreItemChange = async (value) => {
      const existingMethod = cmtyBadgePaymentMethods?.find((method) => method.nftMetadataId === value.id);
      if (!existingMethod && value.id) {
        const { data } = await refetch();
        const selectedPaymentMethod = data?.getCmtyPaymentMethodsForOrg?.find(
          (method) => method.nftMetadataId === value.id || method.id === value.id
        );
        return setPaymentMethod(selectedPaymentMethod);
      }
      setPaymentMethod(existingMethod);
    };

    return (
      <>
        <Label>Select NFT</Label>
        <TokenStoreItem onChange={handleTokenStoreItemChange} value={paymentMethod?.nftMetadataId} />
      </>
    );
  }

  if (rewardType === PAYMENT_OPTIONS.DISCORD_ROLE) {
    return (
      <>
        <Label>Select role</Label>
        <SelectComponent options={componentsOptions} value={discordRoleReward} onChange={handleRoleChange} />
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
    return (
      <TokenComponent
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        addPaymentMethod={addPaymentMethod}
        tokenReward={tokenReward}
        setTokenReward={setTokenReward}
        paymentMethods={paymentMethods}
        editPaymentMethod={editPaymentMethod}
        setEditPaymentMethod={setEditPaymentMethod}
        errors={errors}
      />
    );
    // if (paymentMethod && !editPaymentMethod?.id) {
    //   return (
    //     <AddExistingPaymentMethod
    //       paymentMethod={paymentMethod}
    //       setTokenReward={setTokenReward}
    //       tokenReward={tokenReward}
    //       errors={errors}
    //     />
    //   );
    // }
    // if (!addPaymentMethod && !editPaymentMethod?.id) {
    //   return (
    //     <>
    //       {paymentMethods?.map((paymentMethod, index) => (
    //         <PaymentMethodRow
    //           paymentMethod={paymentMethod}
    //           index={index + 1}
    //           setPaymentMethod={setPaymentMethod}
    //           setEditPaymentMethod={setEditPaymentMethod}
    //         />
    //       ))}
    //     </>
    //   );
    // }
    // return (
    //   <>
    //     <Label>Chain</Label>
    //     <SelectComponent
    //       options={CHAIN_SELECT_OPTIONS}
    //       value={editPaymentMethod?.id ? editPaymentMethod?.chain : tokenReward?.chain}
    //       onChange={(value) => {
    //         if (editPaymentMethod?.id) {
    //           setEditPaymentMethod({
    //             ...editPaymentMethod,
    //             chain: value,
    //           });
    //         } else {
    //           setTokenReward({
    //             ...tokenReward,
    //             chain: value,
    //           });
    //         }
    //       }}
    //       error={errors?.chain}
    //     />
    //     <Label>Token type</Label>
    //     <SelectComponent
    //       options={REWARD_TYPES}
    //       value={editPaymentMethod?.id ? editPaymentMethod?.type : tokenReward?.type}
    //       onChange={(value) => {
    //         if (editPaymentMethod?.id) {
    //           setEditPaymentMethod({
    //             ...editPaymentMethod,
    //             type: value,
    //           });
    //         } else {
    //           setTokenReward({
    //             ...tokenReward,
    //             type: value,
    //           });
    //         }
    //       }}
    //       error={errors?.tokenType}
    //     />
    //     <Label
    //       style={{
    //         marginTop: "4px",
    //       }}
    //     >
    //       Token
    //     </Label>
    //     <TextField
    //       placeholder="Please paste in the contract address"
    //       value={editPaymentMethod?.id ? editPaymentMethod?.contractAddress : tokenReward?.contractAddress}
    //       onChange={(value) => {
    //         if (editPaymentMethod?.id) {
    //           setEditPaymentMethod({
    //             ...editPaymentMethod,
    //             contractAddress: value,
    //           });
    //         } else {
    //           setTokenReward({
    //             ...tokenReward,
    //             contractAddress: value,
    //           });
    //         }
    //       }}
    //       error={errors?.contractAddress}
    //       multiline={false}
    //     />
    //     <Label
    //       style={{
    //         marginTop: "4px",
    //       }}
    //     >
    //       Name
    //     </Label>
    //     <TextField
    //       placeholder="Token name"
    //       value={editPaymentMethod?.id ? editPaymentMethod?.tokenName : tokenReward?.tokenName}
    //       onChange={(value) => {
    //         if (editPaymentMethod?.id) {
    //           setEditPaymentMethod({
    //             ...editPaymentMethod,
    //             tokenName: value,
    //           });
    //         } else {
    //           setTokenReward({
    //             ...tokenReward,
    //             tokenName: value,
    //           });
    //         }
    //       }}
    //       multiline={false}
    //     />
    //     {!editPaymentMethod?.id && (
    //       <>
    //         <Label
    //           style={{
    //             marginTop: "4px",
    //           }}
    //         >
    //           Amount
    //         </Label>
    //         <TextField
    //           placeholder="Please enter the amount of tokens to be rewarded"
    //           value={tokenReward?.amount}
    //           onChange={(value) =>
    //             setTokenReward({
    //               ...tokenReward,
    //               amount: value,
    //             })
    //           }
    //           multiline={false}
    //           error={errors?.tokenAmount}
    //           type="number"
    //         />
    //       </>
    //     )}
    //   </>
    // );
  }
};

export const RewardMethodOptionButton = ({ paymentOption, rewardType, onClick, Icon, text }) => (
  <SharedBlackOutlineButton
    style={{
      flex: 1,
    }}
    background={paymentOption === rewardType ? "#BFB4F3" : "#BFB4F366"}
    borderColor={paymentOption === rewardType ? "#000" : "transparent"}
    justifyContent="flex-start"
    height="44px"
    padding="10px"
    minWidth="fit-content"
    onClick={onClick}
  >
    <Icon /> {text}
  </SharedBlackOutlineButton>
);

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
                type: "ERC20",
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

export const ExistingPaymentMethodSelectComponent = ({ options, initialReward, onRewardsChange, rewards }) => {
  const [reward, setPaymentReward] = useState(null);
  const initialRewardId = initialReward?.paymentMethodId;
  useEffect(() => {
    if (initialRewardId) {
      setPaymentReward(initialRewardId);
    }
  }, [initialRewardId]);

  const handleChange = (value) => {
    setPaymentReward(value);

    onRewardsChange(
      rewards.map((reward) => {
        if (reward.type === PAYMENT_OPTIONS.TOKEN && reward.paymentMethod?.id === initialRewardId) {
          return {
            ...reward,
            paymentMethodId: value,
          };
        }
        return reward;
      })
    );
  };
  return <SelectComponent options={options} value={reward} disabled onChange={handleChange} />;
};

export const ExistingDiscordRewardSelectComponent = ({ options, initialReward, onRewardsChange, rewards }) => {
  const [reward, setDiscordRoleReward] = useState(null);
  const initialRewardId = initialReward?.discordRewardData?.discordRoleId;
  useEffect(() => {
    if (initialRewardId) {
      setDiscordRoleReward(initialRewardId);
    }
  }, [initialRewardId]);

  const handleChange = (value) => {
    setDiscordRoleReward(value);
    onRewardsChange(
      rewards.map((reward) => {
        if (
          reward.type === PAYMENT_OPTIONS.DISCORD_ROLE &&
          reward.discordRewardData.discordRoleId === initialRewardId
        ) {
          return {
            ...reward,
            discordRewardData: {
              ...reward.discordRewardData,
              discordRoleId: value,
            },
          };
        }
        return reward;
      })
    );
  };

  return (
    <SelectComponent
      boxStyle={{
        flex: 1,
      }}
      options={options}
      value={reward}
      onChange={handleChange}
    />
  );
};

const ClearRewardValue = ({ onClick }) => {
  return (
    <Grid
      container
      item
      alignItems="center"
      justifyContent="center"
      width="18px"
      height="24px"
      onClick={onClick}
      borderRadius="6px"
      sx={{
        cursor: "pointer",
        "&:hover": {
          background: "rgba(40, 40, 40, 0.2)",
        },
      }}
    >
      <CloseModalIcon strokeColor="#4D4D4D" />
    </Grid>
  );
};

export const RewardWrapper = ({ Icon, text }) => (
  <Grid container item gap="8px" bgcolor="#E8E8E8" padding="8px" borderRadius="6px" alignItems="center">
    <Icon />
    <Typography color="#000000" fontWeight="500" fontFamily="Poppins">
      {text}
    </Typography>
  </Grid>
);

export const RewardWrapperWithTextField = ({ handleOnChange, reward, text, Icon, handleOnClear, placeholder }) => {
  const rewardValue = reward?.value ?? reward?.amount ? Number(reward?.value ?? reward?.amount) : "";
  return (
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
            {rewardValue ? (
              <Grid
                container
                item
                flex="1"
                justifyContent="space-between"
                flexWrap="nowrap"
                style={{
                  pointerEvents: "none",
                }}
              >
                <Typography fontFamily="Poppins" fontWeight="500">
                  {typeof rewardValue === "number" ? text : null}
                </Typography>
                {/* <ClearRewardValue onClick={handleOnClear} /> */}
              </Grid>
            ) : null}
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
  );
};

export const RewardsComponent = ({ rewards, rewardComponents }) => {
  return (
    <>
      {rewards?.map((reward, idx) => {
        const { Component, handleOnRemove } =
          reward?.paymentMethod?.type === PAYMENT_OPTIONS.COMMUNITY_BADGE
            ? rewardComponents[PAYMENT_OPTIONS.COMMUNITY_BADGE]
            : rewardComponents[reward?.type];
        return (
          <Grid container alignItems="center" justifyContent="space-between" gap="14px">
            <Grid item container flex="1">
              {Component({ idx, reward })}
            </Grid>
            <Grid
              item
              container
              bgcolor="#C1B6F6"
              width="30px"
              height="30px"
              borderRadius="6px"
              alignItems="center"
              justifyContent="center"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  background: "#AF9EFF",
                  outline: "1px solid #000",
                },
              }}
            >
              <DeleteIcon onClick={() => handleOnRemove(reward)} />
            </Grid>
          </Grid>
        );
      })}
    </>
  );
};
