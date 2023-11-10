import { Grid, Box } from "@mui/material";
import { CampaignOverviewHeader } from "components/CreateTemplate/CampaignOverview";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import PageWrapper from "components/Shared/PageWrapper";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BG_TYPES } from "utils/constants";
import CreateQuestContext from "utils/context/CreateQuestContext";
import GlobalContext from "utils/context/GlobalContext";
import ReferralSettingsComponent from "./ReferralSettingsComponent";
import ReferralDataComponent from "./ReferralDataComponent";

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
  title: "",
  description: "",
  endDate: null,
  referrerPointReward: null,
  referredPointReward: null,
  maxPerUser: null,
  level: null,
};

const DEFAULT_QUEST_DATA = {
  type: null,
  questIds: [null],
  storeItemId: null,
  rewardType: "advocateReward",
  rewards: [],
};

const ReferralsCreateComponent = ({ setRefValue }) => {
  const navigate = useNavigate();
  const { errors, setErrors } = useContext(CreateQuestContext);
  const [referralItemData, setReferralItemData] = useState<any>({ ...DEFAULT_QUEST_DATA });
  const [referralItemSettings, setReferralItemSettings] = useState<any>({ ...DEFAULT_QUEST_SETTINGS });

  const { activeOrg } = useContext(GlobalContext);

  const onTypeChange = (newType) => {
    setErrors({});
  };

  const handleSave = async () => {};

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
