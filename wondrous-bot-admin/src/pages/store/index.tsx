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

const StorePage = () => {
  const [isActivateModuleModalOpen, setIsActivateModuleModalOpen] = useState(false);
  const { activeOrg } = useContext(GlobalContext);
  const [openPublishModal, setOpenPublishModal] = useState(false);
  const navigate = useNavigate();

  const [getStoreItems, { data }] = useLazyQuery(GET_STORE_ITEMS_FOR_ORG, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const {setSnackbarAlertMessage, setSnackbarAlertOpen, setSnackbarAlertAnchorOrigin} = useAlerts();
  const subscription = useSubscription();

  const { setPaywall, setPaywallMessage, setOnCancel, setCanBeClosed } = usePaywall();

  const plan = getPlan(subscription?.tier);

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

  useEffect(() => {
    if (plan === PricingOptionsTitle.Basic) {
      setPaywall(true);
      setCanBeClosed(false);
      setPaywallMessage("You discovered a paid feature! Upgrade to unlock it.");
      setOnCancel(() => {
        return () => {
          setPaywall(false);
          setPaywallMessage("");
          navigate("/");
        };
      });
    }
    if (
      (plan === PricingOptionsTitle.Premium || plan === PricingOptionsTitle.Ecosystem) &&
      !activeOrg?.modules?.cmtyStore
    ) {
      setIsActivateModuleModalOpen(true);
    }
  }, [plan, activeOrg]);

  const handleNavigationToNewProduct = () => {
    navigate("/store/items/create");
  };

  const handleSuccess = () => {
    setSnackbarAlertMessage("Community store enabled!")
    setSnackbarAlertAnchorOrigin({
      vertical: 'bottom',
      horizontal: 'right'
    })
    setSnackbarAlertOpen(true)
    setIsActivateModuleModalOpen(false)
  };
  if (!activeOrg) return null;

  return (
    <>
      {isActivateModuleModalOpen ? (
        <StoreModule onSuccess={handleSuccess} onCancel={() => navigate("/")} />
      ) : null}
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
