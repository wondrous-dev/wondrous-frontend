import { PricingOptionsTitle } from "components/Pricing/PricingOptionsListItem";
import { is } from "date-fns/locale";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPlan } from "utils/common";
import GlobalContext from "utils/context/GlobalContext";
import useAlerts, { usePaywall, useSubscription, useSubscriptionPaywall } from "utils/hooks";

export const useStorePaywall = () => {
  const { setSnackbarAlertMessage, setSnackbarAlertOpen, setSnackbarAlertAnchorOrigin } = useAlerts();
  const { activeOrg } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [isActivateModuleModalOpen, setIsActivateModuleModalOpen] = useState(false);

  const { plan, setPaywall, setCanBeClosed, setOnCancel, setPaywallMessage,  isLoading: isSubscriptionLoading } = useSubscriptionPaywall();
  useEffect(() => {
    if (isSubscriptionLoading) return;
    if (plan === PricingOptionsTitle.Basic) {
      setPaywall(true);
      setCanBeClosed(false);
      setPaywallMessage("You discovered a paid feature! Upgrade to unlock it.");
      setOnCancel(() => {
        return () => {
          setPaywall(false);
          setPaywallMessage("");
          navigate("/");
          setOnCancel(null);
          setCanBeClosed(true);
        };
      });
    }
    if (
      (plan === PricingOptionsTitle.Premium || plan === PricingOptionsTitle.Ecosystem) &&
      !activeOrg?.modules?.cmtyStore
    ) {
      setIsActivateModuleModalOpen(true);
    }
    if (
      (plan === PricingOptionsTitle.Premium || plan === PricingOptionsTitle.Ecosystem)
    ) {
      setPaywall(false);
    }
  }, [plan, activeOrg, isSubscriptionLoading]);

  const handleSuccess = () => {
    setSnackbarAlertMessage("Store enabled!");
    setSnackbarAlertAnchorOrigin({
      vertical: "bottom",
      horizontal: "right",
    });
    setSnackbarAlertOpen(true);
    setIsActivateModuleModalOpen(false);
  };
  return {
    isActivateModuleModalOpen,
    handleSuccess,
  };
};
