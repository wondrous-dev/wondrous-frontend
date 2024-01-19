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
import StoreModule from "components/ModulesActivation/StoreModule";
import { useStorePaywall } from "utils/storeUtils";
import StoreItemsTutorial from "components/TutorialComponent/Tutorials/StoreItemsTutorial";

const StorePage = () => {
  const { activeOrg } = useContext(GlobalContext);
  const [openPublishModal, setOpenPublishModal] = useState(false);
  const navigate = useNavigate();

  const [getStoreItems, { data }] = useLazyQuery(GET_STORE_ITEMS_FOR_ORG, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const { isActivateModuleModalOpen, handleSuccess, isSubscriptionLoading } = useStorePaywall();

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
      {!!data?.getStoreItemsForOrg && !isSubscriptionLoading && activeOrg?.modules?.cmtyStore && <StoreItemsTutorial />}
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
              <SharedSecondaryButton
                data-tour="tutorial-store-items-page-new-store-item-button"
                onClick={handleNavigationToNewProduct}
              >
                New Store Item
              </SharedSecondaryButton>
            </Box>
          </Box>
        )}
      />
      <StoreItemsList data={data?.getStoreItemsForOrg} />
    </>
  );
};

export default StorePage;
