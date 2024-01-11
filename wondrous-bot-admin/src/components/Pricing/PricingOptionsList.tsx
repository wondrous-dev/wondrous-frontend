import { useContext } from "react";
import GlobalContext from "utils/context/GlobalContext";
import { BillingIntervalValue } from "./BillingInterval";
import PricingOptionsListItem, { PricingOptionsListItemType, PricingOptionsTitle } from "./PricingOptionsListItem";
import { PricingListOptionWrapper } from "./styles";
import { useSubscription } from "utils/hooks";
import { useMe, withAuth } from "components/Auth";
import { getPlan } from "utils/common";

const STRIPE_MANAGE_SUBSCRIPTION_LINK = import.meta.env.VITE_PRODUCTION
  ? "https://billing.stripe.com/p/login/fZefYZfFDdyk6NG8ww"
  : "https://billing.stripe.com/p/login/test_3csbKGfr73hIg2QdQQ";
const pricingOptions: PricingOptionsListItemType[] = [
  {
    colorScheme: "#F8AFDB",
    title: PricingOptionsTitle.Basic,
    description: "For new communities",
    monthlyPrice: 0,
    annualPrice: 0,
    buttonText: "Start",
    link: "/signup",
    features: [
      "50 members onboarded",
      "5 active quests",
      "50 submissions",
      "Simple rewards",
      "General support",
      "1 admin",
    ],
  },
  {
    colorScheme: "#84BCFF",
    title: PricingOptionsTitle.Hobby,
    description: "For growing communities",
    monthlyPrice: 10,
    annualPrice: 8,
    savings: 24,
    percentSavings: 20,
    buttonText: "Upgrade",
    link: import.meta.env.VITE_PRODUCTION
      ? "https://buy.stripe.com/8wM6qs7dsdXS29G6oK"
      : "https://buy.stripe.com/test_eVa5nma5d3Ej8EMbII",
    yearlyLink: import.meta.env.VITE_PRODUCTION
      ? "https://buy.stripe.com/8wMg120P4dXS5lS9AV"
      : "https://buy.stripe.com/test_00g9DC4KT8YD1ckdQV",
    features: [
      "1000 members onboarded",
      "Unlimited quests",
      "Customize levels",
      "Youtube verification",
      "Reward crypto",
      "Community analytics",
      "2 admins",
    ],
  },
  {
    colorScheme: "#2A8D5C",
    title: PricingOptionsTitle.Premium,
    description: "For large communities",
    monthlyPrice: 50,
    annualPrice: 40,
    savings: 120,
    percentSavings: 20,
    buttonText: "Upgrade",
    best: true,
    link: import.meta.env.VITE_PRODUCTION
      ? "https://buy.stripe.com/eVa8yA2Xc9HC29GaEX"
      : "https://buy.stripe.com/test_14kg206T1a2HdZ68wx",
    yearlyLink: import.meta.env.VITE_PRODUCTION
      ? "https://buy.stripe.com/aEU4ik9lA8Dy3dK00k"
      : "https://buy.stripe.com/test_dR6cPOfpxcaP5sA9AE",
    features: [
      "Unlimited members",
      "More social verifications",
      "Store for rewards",
      "Batch pay",
      "NFT minting",
      "Custom banner",
      "Premium on-chain verifications",
      "5 admins",
    ],
  },
  {
    colorScheme: "#F8642D",
    title: PricingOptionsTitle.Ecosystem,
    description: "For ecosystem projects",
    monthlyPrice: 195,
    annualPrice: 150,
    savings: 541,
    percentSavings: 23,
    buttonText: "Talk to Sales",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSfUToCTDAfOT3EU5pGvgigcMyNyWiFdRuQzrTtZ8yS7ox4Y-Q/viewform?usp=sf_link",
    features: [
      "API access",
      "Custom integrations",
      "Custom features",
      "Personalized onboarding",
      "Custom messaging",
      "Exclusive account management",
      "Priority feature requests",
      "Unlimited admins",
    ],
  },
];

const PricingOptionsList = ({
  billingInterval,
  settings,
}: {
  billingInterval: BillingIntervalValue;
  settings?: boolean;
}) => {
  const { activeOrg } = useContext(GlobalContext);
  const subscription = useSubscription();
  const plan = getPlan(subscription?.tier);
  const user = useMe()?.user;
  const userPurchasedSubscription = user?.id === subscription?.additionalData?.purchasedUserId;
  return (
    <PricingListOptionWrapper>
      {pricingOptions.map((i) => {
        if (settings && i.title === PricingOptionsTitle.Basic) {
          i.description = "For starter communities";
        }
        if (
          (i.title === PricingOptionsTitle.Hobby || i.title === PricingOptionsTitle.Premium) &&
          activeOrg?.id &&
          !i.link?.includes("usereq")
        ) {
          const splitLink = i.link.split("?");
          if (splitLink.length > 1) {
            i.link = `${splitLink[0]}?client_reference_id=${activeOrg?.id}${user?.id ? `usereq${user?.id}` : ""}`;
          } else {
            i.link = `${i.link}?client_reference_id=${activeOrg?.id}${user?.id ? `usereq${user?.id}` : ""}`;
          }
        }

        if (plan === PricingOptionsTitle.Ecosystem) {
          if (i.title !== plan) {
            i.buttonText = "Downgrade";
          }
          if (i.title === PricingOptionsTitle.Basic && userPurchasedSubscription) {
            i.link = STRIPE_MANAGE_SUBSCRIPTION_LINK;
          }
        }
        if (plan === PricingOptionsTitle.Premium) {
          if (i.title === PricingOptionsTitle.Hobby || i.title === PricingOptionsTitle.Basic) {
            i.buttonText = "Downgrade";
            if (userPurchasedSubscription) {
              i.link = STRIPE_MANAGE_SUBSCRIPTION_LINK;
            }
          }
        }
        if (plan === PricingOptionsTitle.Hobby) {
          if (i.title === PricingOptionsTitle.Basic) {
            i.buttonText = "Downgrade";
            if (userPurchasedSubscription) {
              i.link = STRIPE_MANAGE_SUBSCRIPTION_LINK;
            }
          }
        }
        return <PricingOptionsListItem {...i} settings={settings} billingInterval={billingInterval} key={i.title} />;
      })}
    </PricingListOptionWrapper>
  );
};

export default withAuth(PricingOptionsList);
