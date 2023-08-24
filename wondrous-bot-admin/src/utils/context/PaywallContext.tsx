import PremiumFeatureDialog from "components/PremiumFeatureDialog";
import { createContext, useMemo, useState } from "react";

export const PaywallContext = createContext(null);

const PaywallContextProvider = ({ children }) => {
  const [paywall, setPaywall] = useState(false);
  const [paywallMessage, setPaywallMessage] = useState("");
  const value = useMemo(() => ({ paywall, setPaywall, setPaywallMessage }), [paywall, setPaywall, setPaywallMessage]);
  return (
    <>
      <PremiumFeatureDialog open={paywall} onClose={() => setPaywall(false)} paywallMessage={paywallMessage} />
      <PaywallContext.Provider value={value}>{children}</PaywallContext.Provider>
    </>
  );
};

export default PaywallContextProvider;
