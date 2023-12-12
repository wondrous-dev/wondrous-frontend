import { Grid, Box } from "@mui/material";
import { CampaignOverviewHeader } from "components/CreateTemplate/CampaignOverview";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import PageWrapper from "components/Shared/PageWrapper";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BG_TYPES, LIMIT, QUALIFYING_ACTION_TYPES, REFERRAL_REWARD_SCHEME, REFERRAL_STATUSES } from "utils/constants";
import CreateQuestContext from "utils/context/CreateQuestContext";
import GlobalContext from "utils/context/GlobalContext";
import ReferralSettingsComponent from "./ReferralSettingsComponent";
import ReferralDataComponent from "./ReferralDataComponent";
import { useMutation } from "@apollo/client";
import { CREATE_REFERRAL, UPDATE_REFERRAL } from "graphql/mutations/referral";
import useAlerts from "utils/hooks";
import { updateReferralCampaignCache } from "utils/apolloHelpers";
import { ValidationError, referralValidator } from "services/validators";
import { convertPath, getPathArray } from "utils/common";
import { set } from "lodash";
import { PAYMENT_OPTIONS } from "components/Rewards/constants";

const DEFAULT_REFERRAL_SETTINGS = {
  name: "",
  description: "",
  endDate: null,
  maxPerUser: null,
  level: null,
  status: REFERRAL_STATUSES.ACTIVE,
};

const DEFAULT_REFERRAL_DATA = {
  type: null,
  questIds: [null],
  storeItemId: null,
  rewards: [],
  referrerPointReward: null,
  referredPointReward: null,
  rewardScheme: REFERRAL_REWARD_SCHEME.REFERRER,
  media: [],
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
  const { setSnackbarAlertMessage, setSnackbarAlertOpen, setSnackbarAlertAutoHideDuration } = useAlerts();
  const { setErrors } = useContext(CreateQuestContext);
  const [referralItemData, setReferralItemData] = useState<any>(referralItemDataDefaultState);
  const [referralItemSettings, setReferralItemSettings] = useState<any>(referralItemSettingsDefaultState);

  const [createReferral] = useMutation(CREATE_REFERRAL, {
    onCompleted: (data) => {
      setSnackbarAlertMessage("Referral created successfully");
      setSnackbarAlertOpen(true);
      navigate(`/referrals`);
    },
    update: (cache, { data }) => {
      return updateReferralCampaignCache(
        cache,
        data,
        "createReferralCampaign",
        {
          orgId: activeOrg?.id,
          limit: LIMIT,
          statuses: [REFERRAL_STATUSES.ACTIVE, REFERRAL_STATUSES.INACTIVE],
          offset: 0,
        },
        "create",
        ["status", "name", "referrerPointReward", "referredPointReward", "rewards"]
      );
    },

    onError: (err) => {
      console.log(err);
    },
  });

  const [updateReferralCampaign] = useMutation(UPDATE_REFERRAL, {
    // refetchQueries: ["getReferralCampaignById"],
    onCompleted: () => {
      setSnackbarAlertMessage("Referral updated successfully");
      setSnackbarAlertOpen(true);
      navigate(`/referrals`);
    },
    update: (cache, { data }) => {
      return updateReferralCampaignCache(
        cache,
        data,
        "updateReferralCampaign",
        {
          orgId: activeOrg?.id,
          limit: LIMIT,
          statuses: [REFERRAL_STATUSES.ACTIVE, REFERRAL_STATUSES.INACTIVE],
          offset: 0,
        },
        "update",
        ["status", "name", "referrerPointReward", "referredPointReward", "rewards"]
      );
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
    const hasAllQuests = referralItemData?.questIds?.includes(QUALIFYING_ACTION_TYPES.ANY_QUEST);
    const body = {
      orgId: activeOrg?.id,
      name: referralItemSettings?.name,
      description: referralItemSettings?.description,
      type: hasAllQuests ? QUALIFYING_ACTION_TYPES.ANY_QUEST : referralItemData?.type,
      endDate: referralItemSettings?.endDate
        ? referralItemSettings?.endDate?.utcOffset(0)?.endOf("day")?.toISOString()
        : null,
      referrerPointReward: referralItemData?.referrerPointReward
        ? parseInt(referralItemData?.referrerPointReward, 10)
        : null,
      referredPointReward: referralItemData?.referredPointReward
        ? parseInt(referralItemData?.referredPointReward, 10)
        : null,
      maxPerUser: referralItemSettings?.maxPerUser ? parseInt(referralItemSettings?.maxPerUser, 10) : null,
      level: referralItemSettings?.level ? parseInt(referralItemSettings?.level, 10) : null,
      questIds: hasAllQuests ? null : referralItemData?.questIds,
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

    try {
      await referralValidator(body);
      await handleMutation(body);
      const referralDataMediaUploads = Array.isArray(referralItemData?.media) ? referralItemData?.media : [];
      const defaultReferralDataMediaUploads = Array.isArray(existingReferralItemData?.media)
        ? existingReferralItemData?.mediaUploads
        : [];

      const hasMediaToUpload = referralDataMediaUploads.some((media) => media instanceof File);

      const storeItemSlugs = referralDataMediaUploads.filter((media) => media?.slug).map((media) => media.slug); // Ensures that you are working with the slug strings directly.

      const mediaSlugsToRemove = defaultReferralDataMediaUploads
        .filter((media) => !storeItemSlugs.includes(media?.slug))
        .map((media) => media?.slug); // Map to get the slugs to remove.

      if (hasMediaToUpload) {
        setSnackbarAlertMessage("Wrapping up with your media. Please keep this window open");
        setSnackbarAlertAutoHideDuration(2000);
        setSnackbarAlertOpen(true);
      }
      if (mediaSlugsToRemove?.length > 0) {
        // await removeStoreItemMedia({
        //   variables: {
        //     storeItemId: storeItemSettings?.id,
        //     // until we support more media
        //     slug: mediaSlugsToRemove[0],
        //   },
        // });
      }

    } catch (err) {
      let errors = {};
      if (err instanceof ValidationError) {
        err.inner.forEach((error) => {
          let arrAdjustedPath = error.path.includes("questIds") ? error.path.replace(/\["(\d+)"\]/g, (match, index) => `[${index}]`) : error.path
          const path = getPathArray(arrAdjustedPath);
          set(errors, path, error.message);
        });
        
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        setErrors(errors);
      }
    }
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
