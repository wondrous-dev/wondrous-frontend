import { Grid, Box } from "@mui/material";
import { CampaignOverviewHeader } from "components/CreateTemplate/CampaignOverview";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import PageWrapper from "components/Shared/PageWrapper";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BG_TYPES, REFERRAL_REWARD_SCHEME, REFERRAL_STATUSES } from "utils/constants";
import CreateQuestContext from "utils/context/CreateQuestContext";
import GlobalContext from "utils/context/GlobalContext";
import ReferralSettingsComponent from "./ReferralSettingsComponent";
import ReferralDataComponent from "./ReferralDataComponent";
import { useMutation } from "@apollo/client";
import { CREATE_REFERRAL, UPDATE_REFERRAL } from "graphql/mutations/referral";
import { PAYMENT_OPTIONS } from "components/CreateTemplate/RewardUtils";
import useAlerts from "utils/hooks";

/*

FIELDS:

title
description
level
requireReview
status = ACTIVE / INACTIVE
quest_id
store_item_id
referrer_point_reward
referred_point_reward
max_per_user

REFERRAL_TYPES = {
  type: COMPLETE_PURCHASE
  label: Complete a purchase
  type: Complete a quest
  label: Complete a quest
}

INPUT: {
  orgId - DONE
  name - DONE
  description - DONE
  type - DONE
  questId - DONE
  storeItemId - DONE
  endDate
  referrerPointReward
  referredPointReward
  maxPerUser
  level - DONE
  rewards: [ - DONE
    {
      type
      scheme
      discordRewardData
      paymentMethodId
      amount
      storeItemId
    }
  ]
}

*/
const DEFAULT_REFERRAL_SETTINGS = {
  name: "",
  description: "",
  endDate: null,
  referrerPointReward: null,
  referredPointReward: null,
  maxPerUser: null,
  level: null,
  status: REFERRAL_STATUSES.ACTIVE,
};

const DEFAULT_REFERRAL_DATA = {
  type: null,
  questIds: [null],
  storeItemId: null,
  rewards: [],
  rewardScheme: REFERRAL_REWARD_SCHEME.REFERRER,
};

const SingleReferralComponent = ({
  setRefValue,
  existingReferralItemData = null,
  existingReferralItemSettings = null,
  referralCampaignId = null,
}) => {
  const referralItemDataDefaultState = existingReferralItemData || { ...DEFAULT_REFERRAL_DATA };
  const referralItemSettingsDefaultState = existingReferralItemSettings || { ...DEFAULT_REFERRAL_SETTINGS };
  const navigate = useNavigate();
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  const { errors, setErrors } = useContext(CreateQuestContext);
  const [referralItemData, setReferralItemData] = useState<any>(referralItemDataDefaultState);
  const [referralItemSettings, setReferralItemSettings] = useState<any>(referralItemSettingsDefaultState);

  const [createReferral] = useMutation(CREATE_REFERRAL, {
    // refetchQueries: ["getReferralCampaignForOrg"],
    onCompleted: (data) => {
      setSnackbarAlertMessage("Referral campaign created successfully");
      setSnackbarAlertOpen(true);
      navigate(`/referrals`);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const [updateReferralCampaign] = useMutation(UPDATE_REFERRAL, {
    refetchQueries: ["getReferralCampaignById"],
    onCompleted: () => {
      setSnackbarAlertMessage("Referral campaign updated successfully");
      setSnackbarAlertOpen(true);
      navigate(`/referrals`);
    },
  });

  const { activeOrg } = useContext(GlobalContext);

  const onTypeChange = (newType) => {
    setErrors({});
  };

  const handleMutation = async (body) => {
    if (referralCampaignId) {
      return await updateReferralCampaign({
        variables: {
          referralCampaignId,
          input: body,
        },
      });
    }
    return await createReferral({
      variables: {
        input: body,
      },
    });
  };
  const handleSave = async () => {
    const body = {
      orgId: activeOrg?.id,
      name: referralItemSettings?.name,
      description: referralItemSettings?.description,
      type: referralItemData?.type,
      // endDate: referralItemSettings?.endDate,
      referrerPointReward: referralItemSettings?.referrerPointReward
        ? parseInt(referralItemSettings?.referrerPointReward, 10)
        : null,
      referredPointReward: referralItemSettings?.referredPointReward
        ? parseInt(referralItemSettings?.referredPointReward, 10)
        : null,
      maxPerUser: referralItemSettings?.maxPerUser ? parseInt(referralItemSettings?.maxPerUser, 10) : null,
      level: referralItemSettings?.level ? parseInt(referralItemSettings?.level, 10) : null,
      questIds: referralItemData?.questIds,
      status: referralItemSettings?.status,
      rewards: referralItemData?.rewards?.map((reward) => {
        let rewardBody: any = {
          type: reward?.type,
          scheme: reward?.scheme,
        };
        if (reward?.type === PAYMENT_OPTIONS.DISCORD_ROLE) {
          rewardBody = {
            ...rewardBody,
            discordRewardData: {
              discordRoleId: reward?.discordRewardData?.discordRoleId,
              discordRoleName: reward?.discordRewardData?.discordRoleName,
              discordGuildId: reward?.discordRewardData?.discordGuildId,
            },
          };
        } else if (reward?.type === PAYMENT_OPTIONS.TOKEN || reward?.type === PAYMENT_OPTIONS.COMMUNITY_BADGE) {
          rewardBody = {
            ...rewardBody,
            paymentMethodId: reward?.paymentMethodId,
            amount: Number(reward?.amount),
            type: PAYMENT_OPTIONS.TOKEN,
          };
        } else if (reward?.type === PAYMENT_OPTIONS.POAP) {
          const { __typename, ...rewardData } = reward?.poapRewardData;
          rewardBody = {
            ...rewardBody,
            poapRewardData: rewardData,
          };
        } else if (reward?.type === PAYMENT_OPTIONS.CMTY_STORE_ITEM) {
          rewardBody = {
            ...rewardBody,
            storeItemId: reward?.storeItem?.id,
          };
        }
        return rewardBody;
      }),
    };

    return await handleMutation(body);
  };

  useMemo(() => setRefValue({ handleSave }), [setRefValue, handleSave]);

  return (
    <>
      <PageWrapper
        containerProps={{
          direction: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          minHeight: "100vh",
          padding: {
            xs: "14px 14px 120px 14px",
            sm: "24px 56px 150px 24px",
          },
        }}
        bgType={BG_TYPES.QUESTS}
      >
        <Grid
          display="flex"
          justifyContent="space-between"
          width="100%"
          gap="24px"
          flexDirection={{
            xs: "column",
            lg: "row",
          }}
        >
          <Box flexBasis="40%" display="flex" flexDirection="column" gap="24px">
            <PanelComponent
              renderHeader={() => <CampaignOverviewHeader title="Referral Settings" />}
              renderBody={() => (
                <ReferralSettingsComponent
                  referralItemSettings={referralItemSettings}
                  setReferralItemSettings={setReferralItemSettings}
                />
              )}
            />
          </Box>
          <ReferralDataComponent referralItemData={referralItemData} setReferralItemData={setReferralItemData} />
        </Grid>
      </PageWrapper>
    </>
  );
};

export default SingleReferralComponent;
