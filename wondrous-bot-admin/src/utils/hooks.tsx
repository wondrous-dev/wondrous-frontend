import { SnackbarAlertContext } from "utils/context";
import { useContext, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { IS_ORG_USERNAME_TAKEN } from "graphql/queries";
import SubscriptionContext from "./context/SubscriptionContext";
import TakeQuestContext from "./context/TakeQuestContext";
import { PaywallContext } from "./context/PaywallContext";
import GlobalContext from "./context/GlobalContext";
import { getPlan } from "./common";
import { PricingOptionsTitle } from "components/Pricing/PricingOptionsListItem";
import { useMe } from "components/Auth";

const useAlerts = () => {
  const {
    setSnackbarAlertMessage,
    setSnackbarAlertAnchorOrigin,
    setSnackbarAlertOpen,
    setSnackbarAlertSeverity,
    setSnackbarAlertAutoHideDuration,
  } = useContext(SnackbarAlertContext);

  const showError = (errorMsg, isSeverityError = false) => {
    setSnackbarAlertMessage(errorMsg);
    setSnackbarAlertSeverity(isSeverityError ? "error" : "warning");
    setSnackbarAlertOpen(true);
  };

  return {
    showError,
    setSnackbarAlertMessage,
    setSnackbarAlertAnchorOrigin,
    setSnackbarAlertOpen,
    setSnackbarAlertSeverity,
    setSnackbarAlertAutoHideDuration,
  };
};

export const useIsOrgUsernameTaken = () => {
  const [isOrgUsernameTaken] = useLazyQuery(IS_ORG_USERNAME_TAKEN, {
    fetchPolicy: "network-only",
  });
  const [prevUsername, setPrevUsername] = useState("");
  const [prevResult, setPrevResult] = useState(false);
  const handleIsOrgUsernameTaken = async (username) => {
    if (username && username !== prevUsername) {
      // check the previous parameter first to prevent unnecessary queries during form validation; refer to https://github.com/jaredpalmer/formik/issues/512#issuecomment-666549238
      const { data } = await isOrgUsernameTaken({ variables: { username } });
      const result = !data?.isOrgUsernameTaken?.exist;
      setPrevUsername(username);
      setPrevResult(result);
      return result;
    }
    return prevResult;
  };
  return handleIsOrgUsernameTaken;
};

export default useAlerts;

export const useSubscription = () => useContext(SubscriptionContext);

export const usePaywall = () => useContext(PaywallContext);

export const useTakeQuest = () => useContext(TakeQuestContext);

export const useGlobalContext = () => useContext(GlobalContext);

export const useSubscriptionPaywall = () => {
  const subscription = useSubscription();
  const plan = getPlan(subscription?.tier);
  const { setPaywall, setPaywallMessage, setOnCancel, setCanBeClosed } = usePaywall();
  const isBasicPLan = plan === PricingOptionsTitle.Basic;
  const isHobbyPlan = plan === PricingOptionsTitle.Hobby;
  const isPremiumPlan = plan === PricingOptionsTitle.Premium;
  const isEcosystemPlan = plan === PricingOptionsTitle.Ecosystem;
  return { plan, setPaywall, setPaywallMessage,isBasicPLan, isHobbyPlan, isPremiumPlan, isEcosystemPlan, setOnCancel, setCanBeClosed };
};

export const useUserCompletedGuides = () => {
  const { user } = useMe() || {};
  const completedQuestGuides = user?.completedQuestGuides;
  return completedQuestGuides;
};
