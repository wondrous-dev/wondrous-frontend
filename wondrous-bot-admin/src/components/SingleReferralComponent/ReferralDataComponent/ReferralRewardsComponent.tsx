import { Box, Grid } from "@mui/material";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { Label } from "components/CreateTemplate/styles";
import { RewardTypeSwitch } from "./Helpers";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import RewardModal, { useAddRewardModalState } from "components/CreateTemplate/RewardModal";
import { SharedSecondaryButton } from "components/Shared/styles";
import { PAYMENT_OPTIONS } from "components/CreateTemplate/RewardUtils";
import OptionRewards, { InlineRewardUIComponent } from "components/AddFormEntity/components/OptionRewards";
import TextField from "components/Shared/TextField";
import { REFERRAL_REWARD_SCHEME } from "utils/constants";
import { useMemo } from "react";

const CampaignRewardComponent = ({ handleAddNewReward, rewards, handleRewardDelete, rewardScheme }) => {
  if (!rewards?.length) return null;
  return (
    <>
      <Box>
        <SharedSecondaryButton onClick={handleAddNewReward}>Add New Reward</SharedSecondaryButton>
      </Box>
      <Grid display="flex" gap="10px" flexDirection="column" width="100%">
        {rewards?.map((reward, idx) => {
          if (reward?.scheme !== rewardScheme) return null;
          return (
            <InlineRewardUIComponent
              reward={reward}
              handleRewardDelete={() => handleRewardDelete(idx)}
              hasDeleteButton={rewards?.length > 1}
              handleAddReward={handleAddNewReward}
            />
          );
        })}
      </Grid>
    </>
  );
};

const ReferralRewardsComponent = ({ referralItemData, setReferralItemData }) => {
  const rewardModalState = useAddRewardModalState();
  const { setIsRewardModalOpen } = rewardModalState;
  const REWARD_OPTIONS = [
    {
      label: "Advocate Reward",
      value: REFERRAL_REWARD_SCHEME.REFERRER,
    },
    {
      label: "Friend Reward",
      value: REFERRAL_REWARD_SCHEME.REFERRED,
    },
  ];

  const onRewardAdd = (reward) => {
    setReferralItemData((prev) => {
      const filteredRewards =
        prev?.rewards?.filter((i) => {
          if (i.type === PAYMENT_OPTIONS.TOKEN) {
            return i.paymentMethodId !== reward.paymentMethod?.id;
          }
          return true;
        }) || [];
      return {
        ...prev,
        rewards: [
          ...filteredRewards,
          {
            ...reward,
            scheme: prev?.rewardScheme,
          },
        ],
      };
    });
  };

  const handleRewardDelete = (idx) =>
    setReferralItemData((prev) => ({ ...prev, rewards: prev?.rewards?.filter((_, i) => i !== idx) }));

  return (
    <PanelComponent
      renderBody={() => {
        return (
          <>
            <RewardModal
              rewardModalState={rewardModalState}
              handleRewardModalToggle={() => setIsRewardModalOpen(false)}
              handleOnRewardAdd={onRewardAdd}
            />

            <Grid display="flex" flexDirection="column" gap="24px" width="100%">
              <Grid display="flex" flexDirection="column" gap="12px">
                <Label fontWeight={600}>Reward Type</Label>
                <RewardTypeSwitch
                  options={REWARD_OPTIONS}
                  value={referralItemData?.rewardScheme}
                  onChange={(value) =>
                    setReferralItemData((prev) => ({
                      ...prev,
                      rewardScheme: value,
                    }))
                  }
                />
                <Divider />
              </Grid>

              <CampaignRewardComponent
                handleAddNewReward={() => setIsRewardModalOpen(true)}
                rewardScheme={referralItemData?.rewardScheme}
                rewards={referralItemData?.rewards}
                handleRewardDelete={handleRewardDelete}
              />
            </Grid>
          </>
        );
      }}
    />
  );
};

export default ReferralRewardsComponent;
