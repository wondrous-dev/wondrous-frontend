import { usePaywall, useSubscription } from "utils/hooks";
import { PricingOptionsTitle, getPlan } from "components/Pricing/PricingOptionsListItem";

import AnalyticsComponent from "components/Analytics";
import MockCharts from "components/Analytics/MockCharts";

const AnalyticsPage = () => {
  const subscription = useSubscription();

  const { setPaywall, setPaywallMessage } = usePaywall();

  const plan = getPlan(subscription?.tier);

  if (plan === PricingOptionsTitle.Basic) {
    setPaywall(true);
    setPaywallMessage("This feature is only available on the Hobby plan and above");
    return <MockCharts />;
  }
  return <AnalyticsComponent />;
};

export default AnalyticsPage;
