import { useContext } from "react";
import GlobalContext from "utils/context/GlobalContext";
import { BillingIntervalValue } from "./BillingInterval";
import PricingOptionsListItem, { PricingOptionsListItemType, PricingOptionsTitle } from "./PricingOptionsListItem";
import { PricingListOptionWrapper } from "./styles";

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
    annualPrice: 300,
    savings: 98,
    percentSavings: 14,
    buttonText: "Upgrade",
    link: import.meta.env.VITE_PRODUCTION ? "" : "https://buy.stripe.com/test_eVa5nma5d3Ej8EMbII",
    yearlyLink: import.meta.env.VITE_PRODUCTION ? "" : "https://buy.stripe.com/test_6oE7vu4KT2AfaMU7su",
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
    annualPrice: 800,
    savings: 244,
    percentSavings: 23,
    buttonText: "Upgrade",
    best: true,
    link: import.meta.env.VITE_PRODUCTION ? "" : "https://buy.stripe.com/test_14kg206T1a2HdZ68wx",
    yearlyLink: import.meta.env.VITE_PRODUCTION ? "" : "https://buy.stripe.com/test_cN22ba919gr5f3afZ1",
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
    annualPrice: 1800,
    savings: 540,
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

        if (
          billingInterval === BillingIntervalValue.annual &&
          (i.title === PricingOptionsTitle.Hobby || i.title === PricingOptionsTitle.Premium)
        ) {
          i.link = i.yearlyLink;
        }
        return <PricingOptionsListItem {...i} settings={settings} billingInterval={billingInterval} key={i.title} />;
      })}
    </PricingListOptionWrapper>
  );
};

export default PricingOptionsList;
