import { Box, Grid } from "@mui/material";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { Label } from "components/CreateTemplate/styles";
import { RewardTypeSwitch } from "./Helpers";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import RewardModal, { useAddRewardModalState } from "components/CreateTemplate/RewardModal";
import { SharedSecondaryButton } from "components/Shared/styles";
import { PAYMENT_OPTIONS } from "components/CreateTemplate/RewardUtils";
import OptionRewards from "components/AddFormEntity/components/OptionRewards";
import TextField from "components/Shared/TextField";

const AdvocateRewardComponent = ({ handleAddNewReward, rewards, handleRewardDelete }) => (
  <>
    <Box>
      <SharedSecondaryButton onClick={handleAddNewReward}>Add New Reward</SharedSecondaryButton>
    </Box>
    <OptionRewards
      wrapperStyle={{
        paddingLeft: "0",
      }}
      rewards={rewards}
      handleRewardDelete={handleRewardDelete}
      handleAddReward={handleAddNewReward}
    />
  </>
);

const FriendRewardComponent = ({}) => (
  <Box display="flex" flexDirection="column" gap="24px">
    <Box display="flex" flexDirection="column" gap="14px">
      <Label fontWeight={600}>Discount</Label>
      <TextField
        placeholder="Enter discount"
        value={""}
        onChange={() => {}}
        type="number"
        multiline={false}
      />
    </Box>
    <Label fontWeight={600}>Minimum Order (USD)</Label>
  </Box>
);

const ReferralRewardsComponent = ({ referralItemData, setReferralItemData }) => {
  const rewardModalState = useAddRewardModalState();
  const { setIsRewardModalOpen } = rewardModalState;
  const REWARD_OPTIONS = [
    {
      label: "Advocate Reward",
      value: "advocateReward",
    },
    {
      label: "Friend Reward",
      value: "friendReward",
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
        rewards: [...filteredRewards, reward],
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
                  value={referralItemData?.rewardType}
                  onChange={(value) =>
                    setReferralItemData((prev) => ({
                      ...prev,
                      rewardType: value,
                    }))
                  }
                />
                <Divider />
              </Grid>

              {referralItemData?.rewardType === "advocateReward" && (
                <AdvocateRewardComponent
                  handleAddNewReward={() => setIsRewardModalOpen(true)}
                  rewards={referralItemData?.rewards}
                  handleRewardDelete={handleRewardDelete}
                />
              )}
              {referralItemData?.rewardType === "friendReward" && <FriendRewardComponent />}
            </Grid>
          </>
        );
      }}
    />
  );
};

export default ReferralRewardsComponent;
