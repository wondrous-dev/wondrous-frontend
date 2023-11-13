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
import { CREATE_REFERRAL } from "graphql/mutations/referral";
import { PAYMENT_OPTIONS } from "components/CreateTemplate/RewardUtils";

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
const DEFAULT_QUEST_SETTINGS = {
  name: "",
  description: "",
  endDate: null,
  referrerPointReward: null,
  referredPointReward: null,
  maxPerUser: null,
  level: null,
  status: REFERRAL_STATUSES.ACTIVE
};

const DEFAULT_QUEST_DATA = {
  type: null,
  questIds: [null],
  storeItemId: null,
  rewardType: REFERRAL_REWARD_SCHEME.REFERRER,
  rewards: [],
};

const ReferralsCreateComponent = ({ setRefValue }) => {
  const navigate = useNavigate();
  const { errors, setErrors } = useContext(CreateQuestContext);
  const [referralItemData, setReferralItemData] = useState<any>({ ...DEFAULT_QUEST_DATA });
  const [referralItemSettings, setReferralItemSettings] = useState<any>({ ...DEFAULT_QUEST_SETTINGS });

  const [createReferral] = useMutation(CREATE_REFERRAL, {
    onCompleted: (data) => {
      navigate(`/referrals/${data?.createReferralCampaign?.id}`);
    },
    onError: (err) => {
      console.log(err);
    },
  })

  const { activeOrg } = useContext(GlobalContext);

  const onTypeChange = (newType) => {
    setErrors({});
  };

  const handleSave = async () => {
    const body = {
      orgId: activeOrg?.id,
      name: referralItemSettings?.name,
      description: referralItemSettings?.description,
      type: referralItemData?.type,
      // endDate: referralItemSettings?.endDate,
      referrerPointReward: referralItemSettings?.referrerPointReward ? parseInt(referralItemSettings?.referrerPointReward, 10) : null,
      referredPointReward: referralItemSettings?.referredPointReward ? parseInt(referralItemSettings?.referredPointReward, 10): null,
      maxPerUser: referralItemSettings?.maxPerUser ? parseInt(referralItemSettings?.maxPerUser, 10) : null,
      level: referralItemSettings?.level ? parseInt(referralItemSettings?.level, 10) : null,
      questIds: referralItemData?.questIds,
      status: referralItemSettings?.status,
      rewards: referralItemData?.rewards?.map((reward) => {
        let rewardBody:any = {
          type: reward?.type,
          scheme: referralItemData?.rewardType,
        };
        if (reward?.type === PAYMENT_OPTIONS.DISCORD_ROLE) {
          rewardBody = {
            ...rewardBody,
            discordRewardData: {
              discordRoleId: reward?.discordRewardData?.discordRoleId,
              discordRoleName: reward?.discordRewardData?.discordRoleName,
              discordGuildId: reward?.discordRewardData?.discordGuildId,
            },
          }
        } else if (reward?.type === PAYMENT_OPTIONS.TOKEN || reward?.type === PAYMENT_OPTIONS.COMMUNITY_BADGE) {
          rewardBody = {
            ...rewardBody,
            paymentMethodId: reward?.paymentMethodId,
            amount: reward?.amount,
            type: PAYMENT_OPTIONS.TOKEN,
          }
        } else if (reward?.type === PAYMENT_OPTIONS.POAP) {
          const { __typename, ...rewardData } = reward?.poapRewardData;
          rewardBody = {
            ...rewardBody,
            poapRewardData: rewardData,
          }
        } else if (reward?.type === PAYMENT_OPTIONS.CMTY_STORE_ITEM) {
          rewardBody = {
            ...rewardBody,
            storeItemId: reward?.storeItemId,
          } 
        }
        return rewardBody;
      })
    }
    await createReferral({
      variables: {
        input: body,
      }
    });
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
              renderBody={
                () => (
                  <ReferralSettingsComponent
                    referralItemSettings={referralItemSettings}
                    setReferralItemSettings={setReferralItemSettings}
                  />
                )
                // <StoreItemSettingsComponent
                //   storeItemSettings={storeItemSettings}
                //   setStoreItemSettings={setStoreItemSettings}
                // />
              }
            />
          </Box>
          <ReferralDataComponent referralItemData={referralItemData} setReferralItemData={setReferralItemData} />
        </Grid>
      </PageWrapper>
    </>
  );
};

export default ReferralsCreateComponent;
