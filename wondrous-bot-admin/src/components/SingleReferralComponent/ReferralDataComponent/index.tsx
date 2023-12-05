import { Box, Grid } from "@mui/material";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { useContext, useEffect, useMemo, useState } from "react";
import { LIMIT, QUALIFYING_ACTION_TYPES, QUEST_STATUSES, STORE_ITEM_STATUSES } from "utils/constants";
import CreateQuestContext from "utils/context/CreateQuestContext";
import GlobalContext from "utils/context/GlobalContext";
import { Label } from "components/CreateTemplate/styles";
import AutocompleteOptionsComponent from "components/AddFormEntity/components/AutocompleteComponent";
import InfoLabel from "components/CreateTemplate/InfoLabel";
import SelectorsComponent from "./Selectors";
import { useLazyQuery } from "@apollo/client";
import { GET_QUESTS_FOR_ORG, GET_STORE_ITEMS_FOR_ORG } from "graphql/queries";
import { ListboxComponent } from "components/Shared/FetchMoreListbox";
import AddIcon from "@mui/icons-material/Add";
import ReferralRewardsComponent from "./ReferralRewardsComponent";
import ErrorField from "components/Shared/ErrorField";
import { KEYS_MAP } from "../constants";

const ReferralDataComponent = ({ referralItemData, setReferralItemData }) => {
  const { errors, setErrors } = useContext(CreateQuestContext);
  const [hasMore, setHasMore] = useState(false);

  const [
    getStoreItemsForOrg,
    {
      fetchMore: fetchMorePurchases,
      data: storeItemsData,
      startPolling: startStoreItemsPolling,
      stopPolling: stopStoreItemsPolling,
    },
  ] = useLazyQuery(GET_STORE_ITEMS_FOR_ORG, {
    notifyOnNetworkStatusChange: true,
  });

  const [
    getQuestsForOrg,
    { fetchMore: fetchMoreQuests, data: questsData, startPolling: startQuestsPolling, stopPolling: stopQuestsPolling },
  ] = useLazyQuery(GET_QUESTS_FOR_ORG, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
  });

  const { activeOrg } = useContext(GlobalContext);

  const handleFetch = async () => {
    if (!referralItemData?.type) return;

    let length = 0;
    if (referralItemData?.type === QUALIFYING_ACTION_TYPES.PURCHASE) {
      const { data } = await getStoreItemsForOrg({
        variables: {
          input: {
            orgId: activeOrg?.id,
            limit: LIMIT,
            offset: 0,
            status: STORE_ITEM_STATUSES.ACTIVE,
          },
        },
      });
      length = data?.getStoreItemsForOrg?.length;
    }
    if (
      referralItemData?.type === QUALIFYING_ACTION_TYPES.QUEST ||
      referralItemData?.type === QUALIFYING_ACTION_TYPES.ANY_QUEST
    ) {
      const { data } = await getQuestsForOrg({
        variables: {
          input: {
            orgId: activeOrg?.id,
            limit: LIMIT,
            offset: 0,
            status: QUEST_STATUSES.OPEN,
          },
        },
      });
      length = data?.getQuestsForOrg?.length;
    }
    setHasMore(length >= LIMIT);
  };

  useEffect(() => {
    handleFetch();
  }, [referralItemData?.type]);

  const QUALIIFYING_ACTION_TYPES_OPTIONS = [
    {
      value: QUALIFYING_ACTION_TYPES.QUEST,
      label: "Complete a quest",
    },
    {
      value: QUALIFYING_ACTION_TYPES.PURCHASE,
      label: "Complete a purchase",
      disabled: true,
    },
  ];

  const handleFetchMore = async (type) => {
    if (!hasMore) return;
    if (type === QUALIFYING_ACTION_TYPES.PURCHASE) {
      const { data } = await fetchMorePurchases({
        variables: {
          input: {
            orgId: activeOrg?.id,
            limit: LIMIT,
            offset: referralItemData?.storeItemId?.length || 0,
            status: STORE_ITEM_STATUSES.ACTIVE,
          },
        },
      });
      setHasMore(data?.getStoreItemsForOrg?.length === LIMIT);
    }
    if (type === QUALIFYING_ACTION_TYPES.QUEST || type === QUALIFYING_ACTION_TYPES.ANY_QUEST) {
      const { data } = await fetchMoreQuests({
        variables: {
          input: {
            orgId: activeOrg?.id,
            limit: LIMIT,
            offset: referralItemData?.questId?.length || 0,
            status: QUEST_STATUSES.OPEN,
          },
        },
      });
      setHasMore(data?.getQuestsForOrg?.length === LIMIT);
    }
  };

  const options = useMemo(() => {
    if (!storeItemsData && !questsData) return [];
    if (referralItemData?.type === QUALIFYING_ACTION_TYPES.PURCHASE) {
      let items =
        storeItemsData?.getStoreItemsForOrg?.map((item) => ({
          label: item.name,
          value: item.id,
        })) || [];
      return [
        {
          label: "All Products",
          value: "all-products",
        },
        ...items,
        {
          label: "Add Store Item",
          value: "add-store-item",
          onClick: () => {
            window.open("/store/items/create");
            startStoreItemsPolling(4000);
          },
          icon: (
            <AddIcon
              sx={{
                color: "black",
              }}
            />
          ),
        },
      ];
    }
    if (
      referralItemData?.type === QUALIFYING_ACTION_TYPES.QUEST ||
      referralItemData?.type === QUALIFYING_ACTION_TYPES.ANY_QUEST
    ) {
      const selectedValues =   referralItemData[KEYS_MAP[referralItemData.type]];

      let items =
        questsData?.getQuestsForOrg?.map((item) => ({
          label: item.title,
          value: item.id,
          disabled: selectedValues?.includes(item.id),
          isSelected: selectedValues?.includes(item.id),
        })) || [];

      return [
        {
          label: "Any Quest",
          value: QUALIFYING_ACTION_TYPES.ANY_QUEST,
        },
        ...items,
        {
          label: "Add Quest",
          value: "add-quest",
          onClick: () => {
            window.open("/quests/create");
            startQuestsPolling(4000);
          },
          icon: (
            <AddIcon
              sx={{
                color: "black",
              }}
            />
          ),
        },
      ];
    }
    return [];
  }, [
    storeItemsData,
    questsData,
    referralItemData,
    startQuestsPolling,
    stopQuestsPolling,
    startStoreItemsPolling,
    stopStoreItemsPolling,
  ]);

  const handleTypeChange = (value) => {
    setErrors((prev) => ({
      ...prev,
      type: null,
    }));
    setReferralItemData({ ...referralItemData, type: value });
  };

  const handleEntityChange = (value, idx, type) => {
    stopQuestsPolling();
    stopStoreItemsPolling();

    setErrors((prev) => {
      return {
        ...prev,
        questIds: prev?.questIds?.map((item, i) => (i === idx ? null : item)),
      }
    });

    if (value === QUALIFYING_ACTION_TYPES.ANY_QUEST) {
      return setReferralItemData((prev) => ({
        ...prev,
        type: QUALIFYING_ACTION_TYPES.ANY_QUEST,
        questIds: [QUALIFYING_ACTION_TYPES.ANY_QUEST],
      }));
    }

    setReferralItemData((prev) => {
      const currentQuestIds = prev?.questIds || [];

      return {
        ...prev,
        type: prev.type === QUALIFYING_ACTION_TYPES.ANY_QUEST ? QUALIFYING_ACTION_TYPES.QUEST : prev.type,
        questIds: currentQuestIds?.length ? currentQuestIds?.map((item, i) => (i === idx ? value : item)) : [value],
      };
    });
  };

  return (
    <Grid display="flex" flexDirection="column" justifyContent="flex-start" gap="24px" alignItems="center" width="100%">
      <PanelComponent
        renderBody={() => {
          return (
            <Grid display="flex" flexDirection="column" gap="24px" width="100%">
              <Grid display="flex" flexDirection="column" gap="12px">
                <Label fontWeight={600}>Qualifying Action</Label>

                <Box display="flex" gap="14px" alignItems="center">
                  <AutocompleteOptionsComponent
                    options={QUALIIFYING_ACTION_TYPES_OPTIONS}
                    value={
                      referralItemData.type === QUALIFYING_ACTION_TYPES.ANY_QUEST
                        ? QUALIFYING_ACTION_TYPES.QUEST
                        : referralItemData?.type
                    }
                    placeholder="Select qualifying action"
                    onChange={handleTypeChange}
                    bgColor="#E8E8E8"
                    autocompletProps={{
                      ListboxComponent: ListboxComponent,
                    }}
                    listBoxProps={{
                      handleFetchMore: async () => handleFetchMore(referralItemData?.type),
                      hasMore,
                    }}
                  />
                  <InfoLabel
                    imgStyle={{
                      marginLeft: "0",
                    }}
                    title="Select a qualifying action for your referral program."
                  />
                </Box>
                <ErrorField errorText={errors?.type} />
              </Grid>
              <SelectorsComponent
                options={options}
                referralItemData={referralItemData}
                handleEntityChange={handleEntityChange}
                setReferralItemData={setReferralItemData}
              />
            </Grid>
          );
        }}
      />
      <ReferralRewardsComponent referralItemData={referralItemData} setReferralItemData={setReferralItemData} />
    </Grid>
  );
};

export default ReferralDataComponent;
