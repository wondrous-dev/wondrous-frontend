import { usePaywall, useSubscription, useSubscriptionPaywall } from "utils/hooks";
import { PricingOptionsTitle } from "components/Pricing/PricingOptionsListItem";

import AnalyticsComponent from "components/Analytics";
import MockCharts from "components/Analytics/MockCharts";
import { getPlan } from "utils/common";
import { useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageSpinner from "components/PageSpinner";
import AnalyticsTutorial from "components/TutorialComponent/Tutorials/AnalyticsTutorial";

const AnalyticsPage = () => {
  const subscription = useSubscription();

  const { setPaywall, setPaywallMessage, setOnCancel, setCanBeClosed } = useSubscriptionPaywall();

  const plan = getPlan(subscription?.tier);

  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (plan === PricingOptionsTitle.Basic) {
      setPaywall(true);
      setCanBeClosed(false);
      setPaywallMessage("This feature is only available on the Hobby plan and above.");
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
  }, [plan]);

  if (plan === PricingOptionsTitle.Basic) return <MockCharts />;
  return (
    <>
      <AnalyticsTutorial />
      <AnalyticsComponent />
    </>
  );
};

export default AnalyticsPage;
