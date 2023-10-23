import { useQuery } from "@apollo/client";
import AutocompleteOptionsComponent from "components/AddFormEntity/components/AutocompleteComponent";
import { ListboxComponent } from "components/Shared/FetchMoreListbox";
import { GET_STORE_ITEMS_FOR_ORG } from "graphql/queries";
import { useMemo, useState } from "react";
import { LIMIT, STORE_ITEM_STATUSES } from "utils/constants";
import { useGlobalContext } from "utils/hooks";
import AddIcon from "@mui/icons-material/Add";

const StoreItemReward = ({ onChange, storeItem }) => {
  const [hasMore, setHasMore] = useState(true);
  const { activeOrg } = useGlobalContext();
  const { data, refetch, fetchMore, startPolling, stopPolling } = useQuery(GET_STORE_ITEMS_FOR_ORG, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    variables: {
      input: {
        orgId: activeOrg?.id,
        status: STORE_ITEM_STATUSES.ACTIVE,
        limit: LIMIT,
        offset: 0,
      },
    },
  });

  const handleFetchMore = async () => {
    if (data?.getStoreItemsForOrg?.length < LIMIT) {
      setHasMore(false);
      return;
    }
    if (!data?.getStoreItemsForOrg?.length || !hasMore) return;
    const { data: fetchMoreData } = await fetchMore({
      variables: {
        input: {
          orgId: activeOrg?.id,
          limit: LIMIT,
          status: STORE_ITEM_STATUSES.ACTIVE,
          offset: data?.getStoreItemsForOrg?.length || 0,
        },
      },
    });
    setHasMore(fetchMoreData?.getStoreItemsForOrg?.length === LIMIT);
  };

  const options = useMemo(() => {
    if (!data) return [];
    const items = data?.getStoreItemsForOrg?.map((item) => ({
      label: item.name,
      value: item.id,
    }));

    return [
      {
        label: "Add Store Item",
        value: "add-store-item",
        onClick: () => {
          window.open("/store/items/create");
          startPolling(4000);
        },
        icon: (
          <AddIcon
            sx={{
              color: "black",
            }}
          />
        ),
      },
      ...items,
    ];
  }, [data]);

  const handleOnChange = (value) => {
    stopPolling();
    if (value === "add-store-item") return;
    const option = options.find((option) => option.value === value);
    const item = {
      value: option?.value,
      name: option?.label,
      id: option?.value,
    };
    onChange(item);
  };

  return (
    <AutocompleteOptionsComponent
      autocompletProps={{
        ListboxComponent: ListboxComponent,
      }}
      listBoxProps={{
        handleFetchMore,
        hasMore,
      }}
      fullWidth
      options={options}
      onChange={handleOnChange}
      value={storeItem?.value}
    />
  );
};

export default StoreItemReward;
