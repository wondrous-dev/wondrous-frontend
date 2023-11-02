import PremiumFeatureDialog from "components/PremiumFeatureDialog";
import { createContext, useMemo, useState } from "react";

export const PaywallContext = createContext(null);

const PaywallContextProvider = ({ children }) => {
  const [paywall, setPaywall] = useState(false);
  const [paywallMessage, setPaywallMessage] = useState("");
  const [onCancel, setOnCancel] = useState(null);
  const [canBeClosed, setCanBeClosed] = useState(true);
  const value = useMemo(() => ({ paywall, setPaywall, setPaywallMessage, setOnCancel, setCanBeClosed }), [paywall, setPaywall, setPaywallMessage, setOnCancel, setCanBeClosed]);
  
  return (
    <>
      <PremiumFeatureDialog
      onCancel={onCancel}
      open={paywall} onClose={() => canBeClosed && setPaywall(false)} paywallMessage={paywallMessage} />
      <PaywallContext.Provider value={value}>{children}</PaywallContext.Provider>
    </>
  );
};

export default PaywallContextProvider;
