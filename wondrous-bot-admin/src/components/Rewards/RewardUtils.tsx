import { useLazyQuery, useMutation } from "@apollo/client";
import WestIcon from "@mui/icons-material/West";
import { Box, ButtonBase, Divider, Grid, InputAdornment, TextField as MUITextField, Typography } from "@mui/material";
import { CHAIN_SELECT_OPTIONS } from "utils/web3Constants";
import DeleteIcon from "components/Icons/Delete";
import SelectComponent from "components/Shared/Select";
import TextField from "components/Shared/TextField";
import { ErrorText, SharedBlackOutlineButton, SharedSecondaryButton } from "components/Shared/styles";
import { DEACTIVATE_CMTY_PAYMENT, UPDATE_CMTY_PAYMENT_METHOD } from "graphql/mutations/payment";
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
  RewardText,
} from "../CreateTemplate/styles";
import DiscordRoleDisclaimer from "components/Shared/DiscordRoleDisclaimer";
import { useCommunityBadgePaymentMethods } from "../CreateTemplate/shared";
import NFTStoreItem from "components/CreateStoreItem/components/NFTStoreItem";
import StoreItemReward from "./StoreItemRewards";
import AutocompleteOptionsComponent from "components/AddFormEntity/components/AutocompleteComponent";
import { getRewardMethodOptionButtonStyle } from "./helpers";
import { REWARD_TYPES, PAYMENT_OPTIONS } from "./constants";
import ErrorField from "components/Shared/ErrorField";
import useAlerts from "utils/hooks";
import ContextMenu from "components/ContextMenu";
import { ContextMenuButtonStyle } from "components/ContextMenu/styles";
import ConfirmActionModal from "components/ConfirmActionModal";
import { useAddRewardModalState } from "./utils";

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
  const isEditingPaymentMethod = !!editPaymentMethod?.id;
  const currentTokenReward = isEditingPaymentMethod ? editPaymentMethod : tokenReward;

  const handleChainChange = (value) => {
    const updateMethod = isEditingPaymentMethod ? setEditPaymentMethod : setTokenReward;
    updateMethod((prev) => ({ ...prev, chain: value }));
  };

  const handleTokenTypeChange = (value) => {
    const updateMethod = isEditingPaymentMethod ? setEditPaymentMethod : setTokenReward;
    updateMethod({ ...currentTokenReward, type: value });
  };

  const handleContractAddressChange = (value) => {
    const updateMethod = isEditingPaymentMethod ? setEditPaymentMethod : setTokenReward;
    updateMethod({ ...currentTokenReward, contractAddress: value });
  };

  const handleTokenNameChange = (value) => {
    const updateMethod = isEditingPaymentMethod ? setEditPaymentMethod : setTokenReward;
    updateMethod({ ...currentTokenReward, tokenName: value });
  };

  const handleAmountChange = (value) => {
    setTokenReward({ ...tokenReward, amount: value });
  };

  if (paymentMethod && !isEditingPaymentMethod) {
    return (
      <AddExistingPaymentMethod
        paymentMethod={paymentMethod}
        setTokenReward={setTokenReward}
        tokenReward={tokenReward}
        errors={errors}
      />
    );
  }
  if (!addPaymentMethod && !isEditingPaymentMethod) {
    return (
      <>
        {paymentMethods?.map((paymentMethod, index) => (
          <PaymentMethodRow
            paymentMethod={paymentMethod}
            index={index + 1}
            key={paymentMethod.id || index}
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
        value={currentTokenReward?.chain}
        onChange={handleChainChange}
        error={errors?.chain}
      />
      <Label>Token type</Label>

      <SelectComponent
        options={options}
        disabled
        value={currentTokenReward?.type}
        onChange={handleTokenTypeChange}
        error={errors?.tokenType || errors?.type}
      />
      <Label style={{ marginTop: "4px" }}>Token</Label>
      <TextField
        placeholder="Please paste in the contract address"
        value={currentTokenReward?.contractAddress}
        onChange={handleContractAddressChange}
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
        value={currentTokenReward?.tokenName}
        onChange={handleTokenNameChange}
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
            onChange={handleAmountChange}
            multiline={false}
            error={errors?.tokenAmount}
            type="number"
          />
        </>
      )}
    </>
  );
};

export const PaymentMethodRow = ({ paymentMethod, setPaymentMethod, setEditPaymentMethod, index }) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  const [deactivateCmtyPayment] = useMutation(DEACTIVATE_CMTY_PAYMENT, {
    refetchQueries: ["getCmtyPaymentMethodsForOrg"],
    onCompleted: () => {
      setSnackbarAlertMessage("Payment method deleted successfully");
      setSnackbarAlertOpen(true);
    },
    onError: () => {
      setSnackbarAlertMessage("Error deleting payment method");
      setSnackbarAlertOpen(true);
    },
  });

  const handleDeactivate = () =>
    deactivateCmtyPayment({
      variables: {
        paymentMethodId: paymentMethod?.id,
      },
    });

  const CONTEXT_MENU_ACTIONS = [
    {
      label: "Edit payment method",
      onClick: () => {
        setEditPaymentMethod({
          ...paymentMethod,
          tokenName: paymentMethod?.name,
          type: paymentMethod?.type?.toLowerCase(),
        });
      },
    },
    {
      label: "Delete payment method",
      onClick: ({ setAnchorEl }) => {
        setAnchorEl(null);
        setIsConfirmationModalOpen(true);
      },
      typographyProps: {
        color: "#ee4852",
      },
    },
  ];
  return (
    <>
      <ConfirmActionModal
        isOpen={isConfirmationModalOpen}
        title="Delete Payment Method"
        body="Are you sure you want to delete this payment method?"
        onConfirm={handleDeactivate}
        onClose={() => {
          setIsConfirmationModalOpen(false);
        }}
        onCancel={() => {
          setIsConfirmationModalOpen(false);
        }}
        cancelButtonTitle="Cancel"
        confirmButtonTitle="Delete"
      />

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
        <Box justifyContent="flex-end" display="flex" marginTop="16px" alignItems="center" gap="8px">
          <SharedSecondaryButton onClick={() => setPaymentMethod(paymentMethod)}>Add Reward</SharedSecondaryButton>
          <ContextMenu
            renderButtons={({ setAnchorEl }) => (
              <>
                {CONTEXT_MENU_ACTIONS.map((button, idx) => {
                  return (
                    <ContextMenuButtonStyle
                      onClick={() => {
                        button?.onClick({ setAnchorEl });
                      }}
                    >
                      <Typography
                        fontFamily="Poppins"
                        fontSize="14px"
                        fontWeight={500}
                        color="black"
                        sx={{
                          textWrap: "nowrap",
                        }}
                        {...button.typographyProps}
                      >
                        {button.label}
                      </Typography>
                    </ContextMenuButtonStyle>
                  );
                })}
              </>
            )}
          />
        </Box>
      </PaymentMethodRowContainer>
    </>
  );
};
export const AddExistingPaymentMethod = ({ paymentMethod, tokenReward, setTokenReward, errors }) => (
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

// export const AddExistingPaymentMethod = ({ paymentMethod, tokenReward, setTokenReward, errors }) => (
//   <>
//     <PaymentMethodRowHeader>
//       Payment Method:{" "}
//       <span
//         style={{
//           color: "black",
//         }}
//       >
//         {paymentMethod?.name || paymentMethod?.contractAddress}
//       </span>
//     </PaymentMethodRowHeader>
//     <Label
//       style={{
//         marginTop: "4px",
//       }}
//     >
//       Amount
//     </Label>
//     <TextField
//       placeholder="Please enter the amount of tokens to be rewarded"
//       value={tokenReward?.amount}
//       onChange={(value) =>
//         setTokenReward({
//           ...tokenReward,
//           amount: value,
//         })
//       }
//       multiline={false}
//       type="number"
//       error={errors?.tokenAmount}
//     />
//   </>
// );

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
  setCmtyStoreItemReward,
  cmtyStoreItemReward,
  setPdaPoints,
  setPdaSubtype,
  pdaPoints,
  pdaSubtype,
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
    setErrors(null);
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

  if (rewardType === PAYMENT_OPTIONS.CMTY_STORE_ITEM) {
    const handleStoreItemChange = (value) => {
      if (!value) return;
      setCmtyStoreItemReward(value);
      setErrors(null);
    };

    return (
      <>
        <Label>Select Store Item</Label>
        <Box display="flex" gap="4px" flexDirection="column">
          <StoreItemReward onChange={handleStoreItemChange} storeItem={cmtyStoreItemReward} />
          <ErrorField errorText={errors?.cmtyStoreItem} />
        </Box>
      </>
    );
  }
  if (rewardType === PAYMENT_OPTIONS.PDA) {
    const pdaTypeOptions = [
      {
        label: "Citizen",
        value: "citizen",
      },
    ];
    return (
      <>
        <Label>PDA Type</Label>
        <SelectComponent options={pdaTypeOptions} value={pdaTypeOptions[0].value} disabled onChange={() => {}} />
        <Label>PDA Subtype</Label>
        <TextField
          placeholder="Please enter the PDA subtype for this reward"
          value={pdaSubtype}
          error={errors?.pdaSubtype}
          onChange={(value) => setPdaSubtype(value)}
          multiline={false}
        />
        <Label>PDA points</Label>
        <TextField
          placeholder="Please input the PDA points awarded for this reward"
          value={pdaPoints}
          error={errors?.pdaPoints}
          onChange={(value) => setPdaPoints(value)}
          multiline={false}
          type="number"
        />
      </>
    );
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
        <NFTStoreItem
          amount={tokenReward.amount}
          onAmountChange={(value) => {
            setTokenReward({
              ...tokenReward,
              amount: value,
            });
          }}
          onChange={handleTokenStoreItemChange}
          value={paymentMethod?.nftMetadataId}
        />
      </>
    );
  }

  if (rewardType === PAYMENT_OPTIONS.DISCORD_ROLE) {
    return (
      <>
        <Label>Select role</Label>
        <Box display="flex" gap="4px" flexDirection="column">
          <AutocompleteOptionsComponent
            options={componentsOptions}
            value={discordRoleReward}
            onChange={handleRoleChange}
            fullWidth
            bgColor="#e8e8e8"
          />
          <ErrorField errorText={errors?.discordRole} />
        </Box>
      </>
    );
  }
  if (rewardType === PAYMENT_OPTIONS.POAP) {
    return (
      <>
        <Label>POAP event ID * </Label>
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
        <Label>POAP event secret * (check your emails for this) </Label>
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
        <Label>POAP name</Label>
        <TextField
          onChange={() => {}}
          placeholder="POAP name"
          value={poapReward?.name}
          multiline={false}
          disabled={true}
        />
        <Label>POAP description</Label>
        <TextField
          onChange={() => {}}
          placeholder="POAP description"
          value={poapReward?.description}
          multiline={false}
          disabled={true}
        />
        {poapReward?.imageUrl && (
          <>
            <Label>POAP badge</Label>
            <PoapImage src={poapReward?.imageUrl} />
          </>
        )}
        {poapReward?.eventUrl && (
          <>
            <Label>POAP event url</Label>
            <TextField
              onChange={() => {}}
              placeholder="POAP event url"
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
  }
};

export const RewardMethodOptionButton = ({ paymentOption, rewardType, onClick, Icon, text, isUnavailable = false }) => {
  const isActive = paymentOption === rewardType;
  const buttonStyle = getRewardMethodOptionButtonStyle(isActive, isUnavailable);

  return (
    <SharedBlackOutlineButton {...buttonStyle} onClick={onClick}>
      <Icon /> {text}
    </SharedBlackOutlineButton>
  );
};

export const RewardModalFooterLeftComponent = ({
  rewardType,
  paymentMethod,
  setPaymentMethod,
  addPaymentMethod,
  handleReward,
  setAddPaymentMethod,
  editPaymentMethod,
  setEditPaymentMethod,
  errors,
  isUpdate = null,
}) => {
  const [updateCmtyPaymentMethod] = useMutation(UPDATE_CMTY_PAYMENT_METHOD, {
    refetchQueries: ["getCmtyPaymentMethodsForOrg"],
  });
  const handleEditPaymentMethod = () => {
    updateCmtyPaymentMethod({
      variables: {
        paymentMethodId: editPaymentMethod?.id,
        input: {
          contractAddress: editPaymentMethod?.contractAddress,
          tokenName: editPaymentMethod?.tokenName,
          chain: editPaymentMethod?.chain,
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
  };

  const handleBackClick = () => {
    paymentMethod ? setPaymentMethod(null) : setAddPaymentMethod(false);
  };

  const renderEditPaymentButton = () => (
    <>
      <ButtonBase onClick={() => setEditPaymentMethod(null)}>
        <Box
          height="40px"
          width="40px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="#2A8D5C"
          borderRadius="35px"
        >
          <WestIcon sx={{ color: "white" }} />
        </Box>
      </ButtonBase>
      <SharedSecondaryButton onClick={handleEditPaymentMethod}>Edit payment method</SharedSecondaryButton>
    </>
  );

  const isRewardTypeSelectable =
    rewardType !== PAYMENT_OPTIONS.POAP &&
    rewardType !== PAYMENT_OPTIONS.DISCORD_ROLE &&
    rewardType !== PAYMENT_OPTIONS.CMTY_STORE_ITEM &&
    rewardType !== PAYMENT_OPTIONS.COMMUNITY_BADGE;
  const rewardText = isUpdate ? "Update Reward" : "Add Reward";
  const renderAddRewardButtons = () => (
    <>
      {isRewardTypeSelectable ? (
        <ButtonBase onClick={handleBackClick}>
          <Box
            height="40px"
            width="40px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="#2A8D5C"
            borderRadius="35px"
          >
            <WestIcon sx={{ color: "white" }} />
          </Box>
        </ButtonBase>
      ) : null}
      <SharedSecondaryButton onClick={handleReward}>
        {addPaymentMethod && rewardType === PAYMENT_OPTIONS.TOKEN ? "Add New Payment Method" : rewardText}
      </SharedSecondaryButton>
      {errors &&
        Object.keys(errors)?.map((key) => {
          return (
            <ErrorText
              style={{
                marginTop: "12px",
              }}
            >
              {errors[key]}
            </ErrorText>
          );
        })}
    </>
  );

  const renderNewPaymentMethodButton = () => (
    <SharedSecondaryButton onClick={() => setAddPaymentMethod(true)}>New payment method</SharedSecondaryButton>
  );

  if (editPaymentMethod?.id) {
    return renderEditPaymentButton();
  }

  if (
    addPaymentMethod ||
    paymentMethod ||
    rewardType === PAYMENT_OPTIONS.POAP ||
    rewardType === PAYMENT_OPTIONS.DISCORD_ROLE ||
    rewardType === PAYMENT_OPTIONS.COMMUNITY_BADGE ||
    rewardType === PAYMENT_OPTIONS.CMTY_STORE_ITEM ||
    rewardType === PAYMENT_OPTIONS.PDA
  ) {
    return renderAddRewardButtons();
  }

  return renderNewPaymentMethodButton();
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

export const RewardWrapper = ({ Icon, text, ...props }) => (
  <Grid container item gap="8px" bgcolor="#E8E8E8" padding="8px" borderRadius="6px" alignItems="center" {...props}>
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
              onClick={() => handleOnRemove(reward)}
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
              <DeleteIcon />
            </Grid>
          </Grid>
        );
      })}
    </>
  );
};
