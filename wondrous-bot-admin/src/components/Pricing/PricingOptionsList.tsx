import { useContext } from "react";
import GlobalContext from "utils/context/GlobalContext";
import { BillingIntervalValue } from "./BillingInterval";
import PricingOptionsListItem, {
  PricingOptionsListItemType,
  PricingOptionsTitle,
  getPlan,
} from "./PricingOptionsListItem";
import { PricingListOptionWrapper } from "./styles";
import { useSubscription } from "utils/hooks";
import { useMe, withAuth } from "components/Auth";

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
      "Up to 100 members",
      "5 active quests",
      "Hosted quest pages",
      "Simple rewards",
      "General support",
      "1 seat",
    ],
  },
  {
    colorScheme: "#84BCFF",
    title: PricingOptionsTitle.Hobby,
    description: "For growing communities",
    monthlyPrice: 29,
    annualPrice: 299,
    savings: 99,
    percentSavings: 14,
    buttonText: "Upgrade",
    link: import.meta.env.VITE_PRODUCTION
      ? "https://buy.stripe.com/dR66qs0P4g608y4bII"
      : "https://buy.stripe.com/test_eVa5nma5d3Ej8EMbII",
    yearlyLink: import.meta.env.VITE_PRODUCTION
      ? "https://buy.stripe.com/3csdSUdBQ9HC15CdQR"
      : "https://buy.stripe.com/test_00g9DC4KT8YD1ckdQV",
    features: [
      "Everything in Basic",
      "Up to 1,000 members",
      "Unlimited quests",
      "Customize levels names",
      "Reward crypto",
      "Cohort onboarding",
      "Community analytics",
      "2 seats",
    ],
  },
  {
    colorScheme: "#2A8D5C",
    title: PricingOptionsTitle.Premium,
    description: "For large communities",
    monthlyPrice: 87,
    annualPrice: 799,
    savings: 245,
    percentSavings: 23,
    buttonText: "Upgrade",
    best: true,
    link: import.meta.env.VITE_PRODUCTION
      ? "https://buy.stripe.com/7sI024fJY8DybKg28a"
      : "https://buy.stripe.com/test_14kg206T1a2HdZ68wx",
    yearlyLink: import.meta.env.VITE_PRODUCTION
      ? "https://buy.stripe.com/14kdSU69o8Dy3dKfZ1"
      : "https://buy.stripe.com/test_dR6cPOfpxcaP5sA9AE",
    features: [
      "Everything in Hobby",
      "Unlimited members",
      "More social integrations",
      "More rewards (Discord nitro, gift cards, merch, etc)",
      "Custom banners",
      "Premium support in Discord",
      "Batch pay with Gnosis",
      "Premium on-chain verifications",
      "10 seats",
    ],
  },
  {
    colorScheme: "#F8642D",
    title: PricingOptionsTitle.Ecosystem,
    description: "For ecosystem projects",
    monthlyPrice: 195,
    annualPrice: 1799,
    savings: 541,
    percentSavings: 23,
    buttonText: "Talk to Sales",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSfUToCTDAfOT3EU5pGvgigcMyNyWiFdRuQzrTtZ8yS7ox4Y-Q/viewform?usp=sf_link",
    features: [
      "Everything in Premium",
      "API access",
      "Custom bot avatar",
      "Custom quest page",
      "Community consulting",
      "Custom bot messaging",
      "NFT minting",
      "Custom integrations",
      "Merch and Shopify store",
      "Unlimited seats",
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
