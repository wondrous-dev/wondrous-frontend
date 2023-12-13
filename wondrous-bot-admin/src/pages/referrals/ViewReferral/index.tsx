import { useQuery } from "@apollo/client";
import PageHeader from "components/PageHeader";
import PageSpinner from "components/PageSpinner";
import { SharedSecondaryButton } from "components/Shared/styles";
import SingleReferralComponent from "components/SingleReferralComponent";
import { GET_REFERRAL_CAMPAIGN_BY_ID } from "graphql/queries/referral";
import moment from "moment";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { QUALIFYING_ACTION_TYPES, REFERRAL_REWARD_SCHEME } from "utils/constants";
import CreateQuestContext from "utils/context/CreateQuestContext";


const ViewReferralPage = () => {
  let { id, ...rest } = useParams();
  const { data, loading, refetch } = useQuery(GET_REFERRAL_CAMPAIGN_BY_ID, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    variables: {
      referralCampaignId: id,
    },
  });
  const [errors, setErrors] = useState({});

  const referralItem = data?.getReferralCampaignById;
  const headerActionsRef = useRef(null);

  const setRefValue = (value) => (headerActionsRef.current = value);

  const referralItemData = {
    type: referralItem?.type,
    questIds:
      referralItem?.type === QUALIFYING_ACTION_TYPES.ANY_QUEST
        ? [QUALIFYING_ACTION_TYPES.ANY_QUEST]
        : referralItem?.quests?.map((item) => item.id),
    storeItemId: referralItem?.storeItem?.id || null,
    rewards: referralItem?.rewards || [],
    rewardScheme: REFERRAL_REWARD_SCHEME.REFERRER,
    referrerPointReward: referralItem?.referrerPointReward,
    referredPointReward: referralItem?.referredPointReward,
    media: referralItem?.media?.map((item) => ({
      slug: item.slug,
      type: item.type,
      name: item.name,
    })),
  };

  const referralItemSettings = {
    name: referralItem?.name,
    description: referralItem?.description,
    endDate: referralItem?.endDate ? moment(referralItem?.endDate) : null,
    maxPerUser: referralItem?.maxPerUser,
    level: referralItem?.level,
    status: referralItem?.status,
  };

  return (
    <>
      <CreateQuestContext.Provider
        value={{
          errors,
          setErrors,
        }}
      >
        <PageHeader
          withBackButton
          title="Create Referral"
          renderActions={() => (
            <SharedSecondaryButton onClick={() => headerActionsRef.current?.handleSave()}>
              Save Referral
            </SharedSecondaryButton>
          )}
        />
        {!loading && referralItem ? (
          <SingleReferralComponent
            existingReferralItemData={referralItemData}
            existingReferralItemSettings={referralItemSettings}
            setRefValue={setRefValue}
            referralCampaignId={referralItem?.id}
          />
        ) : (
          <PageSpinner />
        )}
      </CreateQuestContext.Provider>
    </>
  );
};

export default ViewReferralPage;
