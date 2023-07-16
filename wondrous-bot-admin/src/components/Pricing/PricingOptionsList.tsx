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
    features: ["100 members", "100 quests", "Hosted quest pages", "Simple rewards", "General support", "1 admin"],
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
    link: import.meta.env.VITE_PRODUCTION ? "" : "https://buy.stripe.com/test_eVa5nma5d3Ej8EMbII",
    yearlyLink: import.meta.env.VITE_PRODUCTION ? "" : "https://buy.stripe.com/test_00g9DC4KT8YD1ckdQV",
    features: [
      "Everything in Basic",
      "1,000 members",
      "Unlimited quests",
      "Customize levels names",
      "Hosted quest pages",
      "Reward crypto",
      "Premium support in Discord",
      "Cohort onboarding",
      "2 admins",
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
    link: import.meta.env.VITE_PRODUCTION ? "" : "https://buy.stripe.com/test_14kg206T1a2HdZ68wx",
    yearlyLink: import.meta.env.VITE_PRODUCTION ? "" : "https://buy.stripe.com/test_dR6cPOfpxcaP5sA9AE",
    features: [
      "Everything in Hobby",
      "Unlimited members",
      "YouTube integration",
      "Custom onboarding session",
      "Custom banners",
      "Batch pay with Gnosis",
      "Premium on-chain verifications",
      "Customize levels",
      "10 admins",
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
  return (
    <PricingListOptionWrapper>
      {pricingOptions.map((i) => {
        if (settings && i.title === PricingOptionsTitle.Basic) {
          i.description = "For starter communities";
        }
        if (
          (i.title === PricingOptionsTitle.Hobby || i.title === PricingOptionsTitle.Premium) &&
          activeOrg?.id &&
          !i.link?.includes("client_reference_id")
        ) {
          i.link = `${i.link}?client_reference_id=${activeOrg?.id}`;
        }

        if (plan === PricingOptionsTitle.Ecosystem) {
          if (i.title !== plan) {
            i.buttonText = "Downgrade";
          }
          if (i.title === PricingOptionsTitle.Basic) {
            i.link = STRIPE_MANAGE_SUBSCRIPTION_LINK;
          }
        }
        if (plan === PricingOptionsTitle.Premium) {
          if (i.title === PricingOptionsTitle.Hobby || i.title === PricingOptionsTitle.Basic) {
            i.buttonText = "Downgrade";
          }
          if (i.title === PricingOptionsTitle.Basic) {
            i.link = STRIPE_MANAGE_SUBSCRIPTION_LINK;
          }
        }
        if (plan === PricingOptionsTitle.Hobby) {
          if (i.title === PricingOptionsTitle.Basic) {
            i.buttonText = "Downgrade";
            i.link = STRIPE_MANAGE_SUBSCRIPTION_LINK;
          }
        }
        return <PricingOptionsListItem {...i} settings={settings} billingInterval={billingInterval} key={i.title} />;
      })}
    </PricingListOptionWrapper>
  );
};

export default PricingOptionsList;
