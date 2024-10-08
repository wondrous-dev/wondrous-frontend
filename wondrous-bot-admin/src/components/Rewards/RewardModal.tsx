import { Grid } from "@mui/material";
import { RewardModalFooterLeftComponent, RewardMethod, RewardMethodOptionButton } from "components/Rewards/RewardUtils";
import {
  DiscordRoleIcon,
  GatewayPDAIcon,
  NFTIcon,
  PoapIcon,
  StoreItemRewardIcon,
  TokensIcon,
} from "components/Icons/Rewards";
import { PricingOptionsTitle } from "components/Pricing/PricingOptionsListItem";
import Modal from "components/Shared/Modal";
import { useContext, useEffect, useMemo, useState } from "react";
import GlobalContext from "utils/context/GlobalContext";
import { usePaywall, useSubscription, useSubscriptionPaywall } from "utils/hooks";
import { Label } from "../CreateTemplate/styles";
import {
  handleAddCmtyStoreItem,
  handleAddPoap,
  handleAddTokenOnModal,
  handleNewDiscordRole,
  handleaddPDAItem,
  useDiscordRoleRewardData,
} from "./utils";
import { PAYMENT_OPTIONS } from "./constants";
import { getPlan } from "utils/common";
import { POKT_ORG_ID } from "utils/constants";

const RewardModal = ({
  handleRewardModalToggle,
  handleOnRewardAdd,
  rewards = [],
  rewardModalState,
  maxModalWidth = 640,
  options = [
    PAYMENT_OPTIONS.TOKEN,
    PAYMENT_OPTIONS.POAP,
    PAYMENT_OPTIONS.DISCORD_ROLE,
    PAYMENT_OPTIONS.COMMUNITY_BADGE,
    PAYMENT_OPTIONS.CMTY_STORE_ITEM,
    PAYMENT_OPTIONS.PDA,
  ],
  title = "Add reward to quest",
  handlePDARewardUpdate = null,
}) => {
  const { activeOrg } = useContext(GlobalContext);
  const { isEcosystemPlan, isPremiumPlan, plan, setPaywall, setPaywallMessage, setOnCancel, setCanBeClosed } =
    useSubscriptionPaywall();

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
    setCmtyStoreItemReward,
    cmtyStoreItemReward,
    setPdaPoints,
    setPdaSubtype,
    pdaPoints,
    pdaSubtype,
    isUpdate,
    setIsUpdate,
  } = rewardModalState;
  const handleAddRewardOnModal = () => {
    setErrors(null);
    switch (rewardType) {
      case PAYMENT_OPTIONS.DISCORD_ROLE:
        handleNewDiscordRole({
          newReward: { value: discordRoleReward, type: rewardType },
          rewards,
          errors,
          handleOnRewardAdd,
          setErrors,
          discordRoleData,
          handleToggle: handleRewardModalToggle,
          discordRoleOptions,
        });
        return;
      case PAYMENT_OPTIONS.TOKEN:
      case PAYMENT_OPTIONS.COMMUNITY_BADGE:
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
        return;

      case PAYMENT_OPTIONS.POAP:
        handleAddPoap({
          poapReward,
          setErrors,
          errors,
          handleToggle: handleRewardModalToggle,
          handleOnRewardAdd,
          rewardType,
        });
        return;

      case PAYMENT_OPTIONS.CMTY_STORE_ITEM:
        handleAddCmtyStoreItem({
          type: rewardType,
          storeItem: cmtyStoreItemReward,
          handleToggle: handleRewardModalToggle,
          setErrors,
          errors,
          handleOnRewardAdd,
        });
        break;
      case PAYMENT_OPTIONS.PDA:
        if (isUpdate) {
          if (handlePDARewardUpdate) {
            handlePDARewardUpdate({
              type: rewardType,
              pdaPoints,
              pdaSubtype,
            });
            handleRewardModalToggle();
          }
        } else {
          const hasPDARewardAlready = rewards.some((reward) => reward.type === PAYMENT_OPTIONS.PDA);
          if (hasPDARewardAlready) {
            setErrors({ ...errors, pda: "You can only add one PDA reward per quest" });
          } else {
            handleaddPDAItem({
              type: rewardType,
              handleOnRewardAdd,
              handleToggle: handleRewardModalToggle,
              pdaPoints,
              pdaSubtype,
            });
          }
        }
      default:
        console.warn("Unknown reward type:", rewardType);
        return;
    }
  };

  const modalRewardButtonsProps = useMemo(() => {
    const items = [
      {
        paymentOption: PAYMENT_OPTIONS.DISCORD_ROLE,
        rewardType,
        onClick: () => setRewardType(PAYMENT_OPTIONS.DISCORD_ROLE),
        Icon: DiscordRoleIcon,
        text: "Discord Role",
      },
      {
        paymentOption: PAYMENT_OPTIONS.POAP,
        rewardType,
        onClick: () => setRewardType(PAYMENT_OPTIONS.POAP),
        Icon: PoapIcon,
        text: "POAP",
      },
      {
        paymentOption: PAYMENT_OPTIONS.COMMUNITY_BADGE,
        rewardType,
        onClick: () => setRewardType(PAYMENT_OPTIONS.COMMUNITY_BADGE),
        Icon: NFTIcon,
        text: "Community Badge",
      },
      {
        paymentOption: PAYMENT_OPTIONS.TOKEN,
        rewardType,
        isUnavailable: plan === PricingOptionsTitle.Basic && options.length > 1,
        onClick: () => {
          // allow token rewards for all plans except basic, also allow token rewards if there's only one option
          if (plan === PricingOptionsTitle.Basic && options.length > 1) {
            setPaywall(true);
            setPaywallMessage("This reward option is not available under the basic plan.");
            return;
          } else {
            setRewardType(PAYMENT_OPTIONS.TOKEN);
          }
        },
        Icon: TokensIcon,
        text: "Token reward",
      },
      {
        paymentOption: PAYMENT_OPTIONS.CMTY_STORE_ITEM,
        rewardType,
        isUnavailable: plan !== PricingOptionsTitle.Premium && plan !== PricingOptionsTitle.Ecosystem,
        onClick: () => setRewardType(PAYMENT_OPTIONS.CMTY_STORE_ITEM),
        Icon: StoreItemRewardIcon,
        text: "Store Item",
      },
    ];
    if (activeOrg?.id === POKT_ORG_ID) {
      items.push({
        paymentOption: PAYMENT_OPTIONS.PDA,
        rewardType,
        onClick: () => setRewardType(PAYMENT_OPTIONS.PDA),
        Icon: GatewayPDAIcon,
        text: "Gateway PDA",
      });
    }
    return items;
  }, [activeOrg?.id, rewardType, plan, setRewardType, setPaywall, setPaywallMessage, isEcosystemPlan]);
  return (
    <Modal
      open={isRewardModalOpen}
      onClose={handleRewardModalToggle}
      title={title}
      modalComponentProps={{
        className: "tour-default-modal",
      }}
      dialogComponentProps={{
        className: "tutorials-quest-reward-modal",
      }}
      maxWidth={maxModalWidth}
      footerLeft={
        <RewardModalFooterLeftComponent
          rewardType={rewardType}
          paymentMethod={paymentMethod}
          errors={errors}
          setPaymentMethod={setPaymentMethod}
          addPaymentMethod={addPaymentMethod}
          handleReward={handleAddRewardOnModal}
          setAddPaymentMethod={setAddPaymentMethod}
          editPaymentMethod={editPaymentMethod}
          setEditPaymentMethod={setEditPaymentMethod}
          isUpdate={isUpdate}
        />
      }
      footerRight={undefined}
      footerCenter={undefined}
    >
      <Grid display="flex" flexDirection="column" gap="24px">
        <Grid container item gap="14px">
          <Label>Reward Type</Label>
          <Grid
            container
            item
            alignItems="center"
            gap="14px"
            width="100%"
            justifyContent="center"
            sx={{
              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >
            {modalRewardButtonsProps.map((props) =>
              options.includes(props.paymentOption) ? (
                <RewardMethodOptionButton
                  {...props}
                  onClick={() => {
                    setAddPaymentMethod(false);
                    setEditPaymentMethod(null);
                    props.onClick();
                  }}
                />
              ) : null
            )}
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
            setCmtyStoreItemReward={setCmtyStoreItemReward}
            cmtyStoreItemReward={cmtyStoreItemReward}
            poapReward={poapReward}
            setPoapReward={setPoapReward}
            guildId={discordRoleData[0]?.guildId}
            setPdaPoints={setPdaPoints}
            setPdaSubtype={setPdaSubtype}
            pdaPoints={pdaPoints}
            pdaSubtype={pdaSubtype}
          />
        </Grid>
      </Grid>
    </Modal>
  );
};

export default RewardModal;
