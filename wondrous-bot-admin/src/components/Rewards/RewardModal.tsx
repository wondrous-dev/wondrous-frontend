import { Grid } from "@mui/material";
import { RewardModalFooterLeftComponent, RewardMethod, RewardMethodOptionButton } from "components/Rewards/RewardUtils";
import { DiscordRoleIcon, NFTIcon, PoapIcon, StoreItemRewardIcon, TokensIcon } from "components/Icons/Rewards";
import { PricingOptionsTitle } from "components/Pricing/PricingOptionsListItem";
import Modal from "components/Shared/Modal";
import { useContext, useMemo, useState } from "react";
import GlobalContext from "utils/context/GlobalContext";
import { usePaywall, useSubscription } from "utils/hooks";
import { Label } from "../CreateTemplate/styles";
import { handleAddPoap, handleAddTokenOnModal, handleNewDiscordRole, useDiscordRoleRewardData } from "./utils";
import { PAYMENT_OPTIONS } from "./constants";
import { getPlan } from "utils/common";

const isStoreAdded = false;

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
  ],
}) => {
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
    setCmtyStoreItemReward,
    cmtyStoreItemReward,
  } = rewardModalState;

  const handleAddRewardOnModal = () => {
    switch (rewardType) {
      case PAYMENT_OPTIONS.DISCORD_ROLE:
        handleNewDiscordRole({
          newReward: { value: discordRoleReward, type: rewardType },
          rewards,
          handleOnRewardAdd,
          discordRoleData,
          discordRoleOptions,
        });
        break;

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
          handleOnRewardAdd,
          rewardType,
        });
        break;

      case PAYMENT_OPTIONS.CMTY_STORE_ITEM:
        handleOnRewardAdd({
          type: rewardType,
          storeItem: cmtyStoreItemReward,
        });
        break;

      default:
        console.warn("Unknown reward type:", rewardType);
        return;
    }
    handleRewardModalToggle();
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
        isUnavailable: plan === PricingOptionsTitle.Basic,
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
    ];
    if (
      !isStoreAdded &&
      ((import.meta.env.VITE_PRODUCTION &&
        (activeOrg?.id === "98989259425317451" ||
          activeOrg?.id === "45956686890926082" ||
          activeOrg?.id === "100884993427899088")) ||
        (import.meta.env.VITE_STAGING && activeOrg?.id === "89444950095167649") ||
        (!import.meta.env.VITE_STAGING && !import.meta.env.VITE_PRODUCTION))
    ) {
      items.push({
        paymentOption: PAYMENT_OPTIONS.CMTY_STORE_ITEM,
        rewardType,
        onClick: () => setRewardType(PAYMENT_OPTIONS.CMTY_STORE_ITEM),
        Icon: StoreItemRewardIcon,
        text: "Store Item",
      });
    }
    return items;
  }, [isStoreAdded, activeOrg?.id, rewardType, plan, setRewardType, setPaywall, setPaywallMessage]);

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
      maxWidth={maxModalWidth}
      footerLeft={
        <RewardModalFooterLeftComponent
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
              options.includes(props.paymentOption) ? <RewardMethodOptionButton {...props} /> : null
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
          />
        </Grid>
      </Grid>
    </Modal>
  );
};

export default RewardModal;
