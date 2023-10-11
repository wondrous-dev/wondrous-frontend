import { useLazyQuery } from "@apollo/client";
import { Box } from "@mui/material";
import PageHeader from "components/PageHeader";
import { SharedSecondaryButton } from "components/Shared/styles";
import StoreItemsList from "components/StoreItemsList";
import { GET_STORE_ITEMS_FOR_ORG } from "graphql/queries";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {  STORE_ITEM_STATUSES } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";

const StorePage = () => {
  const { activeOrg } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [getStoreItems, { data }] = useLazyQuery(GET_STORE_ITEMS_FOR_ORG, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (activeOrg?.id) {
      getStoreItems({
        variables: {
          input: {
            orgId: activeOrg?.id,
            limit: 100,
            status: STORE_ITEM_STATUSES.ACTIVE
          },
        },
      });
    }
  }, [activeOrg?.id]);

  const handleNavigationToNewProduct = () => {
    navigate("/store/items/create");
  };

  return (
    <>
      <PageHeader
        title={`${data?.getStoreItemsForOrg?.length || 0} Products`}
        withBackButton={false}
        renderActions={() => (
          <Box display="flex" gap="10px" width="100%">
            <Box>
              <SharedSecondaryButton onClick={handleNavigationToNewProduct}>New Product</SharedSecondaryButton>
            </Box>
          </Box>
        )}
      />
      <StoreItemsList data={data?.getStoreItemsForOrg}/>
    </>
  );
};

export default StorePage;
