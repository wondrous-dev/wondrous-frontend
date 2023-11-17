import { useLazyQuery } from "@apollo/client";
import { Box } from "@mui/material";
import PageHeader from "components/PageHeader";
import { SharedBlackOutlineButton, SharedSecondaryButton } from "components/Shared/styles";
import StoreItemsList from "components/StoreItemsList";
import { GET_STORE_ITEMS_FOR_ORG } from "graphql/queries";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { STORE_ITEM_STATUSES } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";
import PublishDirectoryModal from "./PublishDirectoryModal";
import { PricingOptionsTitle, getPlan } from "components/Pricing/PricingOptionsListItem";
import useAlerts, { usePaywall, useSubscription } from "utils/hooks";
import PageSpinner from "components/PageSpinner";
import StoreModule from "components/ModulesActivation/StoreModule";
import { useStorePaywall } from "utils/storeUtils";

const StorePage = () => {
  const { activeOrg } = useContext(GlobalContext);
  const [openPublishModal, setOpenPublishModal] = useState(false);
  const navigate = useNavigate();

  const [getStoreItems, { data }] = useLazyQuery(GET_STORE_ITEMS_FOR_ORG, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const { isActivateModuleModalOpen, handleSuccess } = useStorePaywall();

  useEffect(() => {
    if (activeOrg?.id) {
      getStoreItems({
        variables: {
          input: {
            orgId: activeOrg?.id,
            limit: 100,
            status: STORE_ITEM_STATUSES.ACTIVE,
          },
        },
      });
    }
  }, [activeOrg?.id]);

  const handleNavigationToNewProduct = () => {
    navigate("/store/items/create");
  };

  if (!activeOrg) return null;

  return (
    <>
      {isActivateModuleModalOpen ? <StoreModule onSuccess={handleSuccess} onCancel={() => navigate("/")} /> : null}
      <PublishDirectoryModal openPublishModal={openPublishModal} setOpenPublishModal={setOpenPublishModal} />
      <PageHeader
        title={`${data?.getStoreItemsForOrg?.length || 0} Products`}
        withBackButton={false}
        renderActions={() => (
          <Box display="flex" gap="10px" width="100%" alignItems="center">
            <Box>
              <SharedBlackOutlineButton
                onClick={() => {
                  setOpenPublishModal(true);
                }}
              >
                Publish Directory
              </SharedBlackOutlineButton>
            </Box>
            <Box>
              <SharedSecondaryButton onClick={handleNavigationToNewProduct}>New Product</SharedSecondaryButton>
            </Box>
          </Box>
        )}
      />
      <StoreItemsList data={data?.getStoreItemsForOrg} />
    </>
  );
};

export default StorePage;
