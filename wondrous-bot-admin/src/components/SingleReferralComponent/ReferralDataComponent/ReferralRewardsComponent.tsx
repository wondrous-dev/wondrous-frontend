import { Box, Grid } from "@mui/material";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { Label } from "components/CreateTemplate/styles";
import { RewardTypeSwitch } from "./Helpers";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { SharedSecondaryButton } from "components/Shared/styles";
import { InlineRewardUIComponent } from "components/AddFormEntity/components/OptionRewards";
import { REFERRAL_REWARD_SCHEME } from "utils/constants";
import { PointsIcon } from "components/Icons/Rewards";
import { RewardWrapperWithTextField } from "components/Rewards";
import RewardModal from "components/Rewards/RewardModal";
import { PAYMENT_OPTIONS } from "components/Rewards/constants";
import { useAddRewardModalState } from "components/Rewards/utils";

const POINT_REWARD_MAP = {
  [REFERRAL_REWARD_SCHEME.REFERRER]: "referrerPointReward",
  [REFERRAL_REWARD_SCHEME.REFERRED]: "referredPointReward",
};

const CampaignRewardComponent = ({
  handleAddNewReward,
  rewards,
  handleRewardDelete,
  rewardScheme,
  referredPointReward,
  referrerPointReward,
  handleOnChangePoints,
}) => {
  const pointsKey = POINT_REWARD_MAP[rewardScheme];
  const pointsValue = rewardScheme === REFERRAL_REWARD_SCHEME.REFERRER ? referrerPointReward : referredPointReward;

  return (
    <>
      <Box>
        <SharedSecondaryButton onClick={handleAddNewReward}>Add New Reward</SharedSecondaryButton>
      </Box>
      <Grid display="flex" gap="10px" flexDirection="column" width="100%">
        <RewardWrapperWithTextField
          reward={{
            value: pointsValue,
          }}
          handleOnChange={(e) => {
            handleOnChangePoints(pointsKey, e.target.value);
          }}
          text="Points"
          placeholder="How many points?"
          Icon={PointsIcon}
          handleOnClear={() => {
            handleOnChangePoints(pointsKey, null);
          }}
        />

        {rewards?.length
          ? rewards?.map((reward, idx) => {
              if (reward?.scheme !== rewardScheme) return null;
              return (
                <InlineRewardUIComponent
                  reward={reward}
                  handleRewardDelete={() => handleRewardDelete(idx)}
                  hasDeleteButton={rewards?.length > 1 || reward?.type !== null}
                  handleAddReward={handleAddNewReward}
                />
              );
            })
          : null}
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

  const handleOnChangePoints = (type, value) => {
    setReferralItemData((prev) => ({
      ...prev,
      [type]: value,
    }));
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
                referredPointReward={referralItemData?.referredPointReward}
                referrerPointReward={referralItemData?.referrerPointReward}
                handleOnChangePoints={handleOnChangePoints}
              />
            </Grid>
          </>
        );
      }}
    />
  );
};

export default ReferralRewardsComponent;
