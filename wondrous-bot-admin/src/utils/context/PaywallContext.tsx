import PremiumFeatureDialog from "components/PremiumFeatureDialog";
import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { matchRoute } from "utils/common";
import { LOCKED_PATHS } from "utils/constants";

export const PaywallContext = createContext(null);

const PaywallContextProvider = ({ children }) => {
  const [paywall, setPaywall] = useState(false);
  const [paywallMessage, setPaywallMessage] = useState("");
  const [onCancel, setOnCancel] = useState(null);
  const [canBeClosed, setCanBeClosed] = useState(true);

  const handleStateReset = () => {
    setPaywall(false);
    setPaywallMessage("");
    setCanBeClosed(true);
    setOnCancel(null);
  };

  const isLockedPath = (currentPath) => matchRoute(currentPath, LOCKED_PATHS);

  useEffect(() => {
    const handlePopState = () => {
      if (paywall && !isLockedPath(window.location.pathname)) {
        handleStateReset();
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [paywall]);

  
  const handleOnCancel = () => {
    if (onCancel) return onCancel();
    return handleStateReset();
  };

  const value = useMemo(
    () => ({ paywall, setPaywall, setPaywallMessage, setOnCancel, setCanBeClosed }),
    [paywall, setPaywall, setPaywallMessage, setOnCancel, setCanBeClosed]
  );

  return (
    <>
      <PremiumFeatureDialog
        onCancel={handleOnCancel}
        open={paywall}
        onClose={() => canBeClosed && setPaywall(false)}
        paywallMessage={paywallMessage}
      />
      <PaywallContext.Provider value={value}>{children}</PaywallContext.Provider>
    </>
  );
};

export default PaywallContextProvider;
