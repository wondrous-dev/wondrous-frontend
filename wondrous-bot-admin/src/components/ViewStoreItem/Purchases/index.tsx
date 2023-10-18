import { useLazyQuery, useQuery } from "@apollo/client";
import { Box, Grid, Typography } from "@mui/material";
import EmptyState from "components/EmptyState";
import { GET_STORE_ITEM_PURCHASES } from "graphql/queries";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { EMPTY_STATE_TYPES, LIMIT } from "utils/constants";
import PurchaseCard from "./PurchaseCard";

const StoreItemPurchases = ({ data, discordRoles, nftMetadata }) => {
  const [hasMore, setHasMore] = useState(true);
  const [getStoreItemPurchases, { data: storeItemPurchases, loading, fetchMore }] = useLazyQuery(
    GET_STORE_ITEM_PURCHASES,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (!data?.id || !data?.orgId) return;
    getStoreItemPurchases({
      variables: {
        storeItemId: data?.id,
        orgId: data?.orgId,
        limit: LIMIT,
        offset: 0,
      },
    }).then(({ data }) => {
      setHasMore(data?.getStoreItemPurchases?.length <= LIMIT);
    });
  }, [data?.id, data?.orgId]);

  const handleFetchMore = () => {
    const currentLength = storeItemPurchases?.getStoreItemPurchases?.length;
    if (!hasMore || !currentLength) return;
    if (currentLength < LIMIT) {
      setHasMore(false);
      return;
    }
    fetchMore({
      variables: {
        storeItemId: data?.id,
        orgId: data?.orgId,
        offset: currentLength,
        limit: LIMIT,
      },
    }).then(({ data }) => {
      if (data?.getStoreItemPurchases?.length < LIMIT) {
        setHasMore(false);
      }
    });
  };

  const { ref, inView, entry } = useInView();
  useEffect(() => {
    if (inView && hasMore && storeItemPurchases && !loading) {
      handleFetchMore();
    }
  }, [inView, hasMore, fetchMore, storeItemPurchases, loading]);

  return (
    <Grid
      display="flex"
      gap="24px"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      width="100%"
    >
      <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
        {data?.stats?.totalPurchases} purchases
      </Typography>
      <Box width="100%" gap="14px" display="flex" alignItems="center" flexDirection="column">
        {storeItemPurchases?.getStoreItemPurchases?.length ? (
          storeItemPurchases?.getStoreItemPurchases?.map((purchase, index) => (
            <PurchaseCard
              nftMetadata={nftMetadata}
              storeItem={data}
              discordRoles={discordRoles}
              key={purchase.id}
              purchase={purchase}
            />
          ))
        ) : (
          <EmptyState type={EMPTY_STATE_TYPES.PURCHASES} />
        )}
        <div ref={ref} style={{ height: "1px" }} />
      </Box>
    </Grid>
  );
};

export default StoreItemPurchases;
