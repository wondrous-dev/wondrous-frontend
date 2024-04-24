import { Box, Grid } from "@mui/material";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { Label } from "components/CreateTemplate/styles";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { SharedSecondaryButton } from "components/Shared/styles";
import { InlineRewardUIComponent } from "components/AddFormEntity/components/OptionRewards";
import { REFERRAL_REWARD_SCHEME } from "utils/constants";
import { PointsIcon } from "components/Icons/Rewards";
import { RewardWrapperWithTextField } from "components/Rewards";
import RewardModal from "components/Rewards/RewardModal";
import { PAYMENT_OPTIONS } from "components/Rewards/constants";
import { useAddRewardModalState } from "components/Rewards/utils";

const REWARD_OPTIONS = [
  {
    label: "Referrer",
    value: REFERRAL_REWARD_SCHEME.REFERRER,
    wrapperProps: {
      "data-tour": "tutorial-referral-referrer-reward",
    },
  },
  {
    label: "Person being referred",
    value: REFERRAL_REWARD_SCHEME.REFERRED,
    wrapperProps: {
      "data-tour": "tutorial-referral-referred-reward",
    },
  },
];

const POINT_REWARD_MAP = {
  [REFERRAL_REWARD_SCHEME.REFERRER]: "referrerPointReward",
  [REFERRAL_REWARD_SCHEME.REFERRED]: "referredPointReward",
};

const ReferralRewardUIComponent = ({
  onRewardAdd,
  option,
  referralItemData,
  handleRewardDelete,
  handleOnChangePoints,
  scheme,
  wrapperProps = {},
}) => {
  const rewardModalState = useAddRewardModalState();
  const { setIsRewardModalOpen } = rewardModalState;

  return (
    <PanelComponent
      panelProps={wrapperProps}
      renderBody={() => {
        return (
          <>
            <RewardModal
              rewardModalState={rewardModalState}
              handleRewardModalToggle={() => setIsRewardModalOpen(false)}
              handleOnRewardAdd={(reward) => onRewardAdd(scheme, reward)}
              title="Add reward to referral"
            />

            <Grid display="flex" flexDirection="column" gap="24px" width="100%">
              <Grid display="flex" flexDirection="column" gap="12px">
                <Label fontWeight={600}>{option.label}</Label>
                <Divider />
              </Grid>
              <CampaignRewardComponent
                handleAddNewReward={() => setIsRewardModalOpen(true)}
                rewardScheme={option.value}
                rewards={referralItemData?.rewards}
                handleRewardDelete={handleRewardDelete}
                pointsValue={referralItemData[POINT_REWARD_MAP[option.value]]}
                handleOnChangePoints={(value) => handleOnChangePoints(POINT_REWARD_MAP[option.value], value)}
              />
            </Grid>
          </>
        );
      }}
    />
  );
};

const CampaignRewardComponent = ({
  handleAddNewReward,
  rewards,
  handleRewardDelete,
  rewardScheme,
  handleOnChangePoints,
  pointsValue,
}) => {
  return (
    <>
      <Grid display="flex" gap="10px" flexDirection="column" width="100%">
        <RewardWrapperWithTextField
          reward={{
            value: pointsValue,
          }}
          handleOnChange={(e) => handleOnChangePoints(e.target.value)}
          text="Points"
          placeholder="How many points awarded?"
          Icon={PointsIcon}
          handleOnClear={() => handleOnChangePoints(null)}
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
        <Box marginTop="10px">
          <SharedSecondaryButton onClick={handleAddNewReward}>Add New Reward</SharedSecondaryButton>
        </Box>
      </Grid>
    </>
  );
};

const ReferralRewardsComponent = ({ referralItemData, setReferralItemData }) => {
  const onRewardAdd = (scheme, reward) => {
    setReferralItemData((prev) => {
      const filteredRewards =
        prev?.rewards?.filter((i) => {
          if (i.type === PAYMENT_OPTIONS.TOKEN && i.scheme === scheme) {
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
            scheme,
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
    <>
      {REWARD_OPTIONS.map((option, idx) => {
        return (
          <ReferralRewardUIComponent
            key={option.value}
            handleRewardDelete={handleRewardDelete}
            onRewardAdd={onRewardAdd}
            option={option}
            scheme={option.value}
            referralItemData={referralItemData}
            wrapperProps={option.wrapperProps}
            handleOnChangePoints={handleOnChangePoints}
          />
        );
      })}
    </>
  );
};

export default ReferralRewardsComponent;
