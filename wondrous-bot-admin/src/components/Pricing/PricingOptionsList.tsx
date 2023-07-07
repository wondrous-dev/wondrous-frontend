import PricingOptionsListItem, { PricingOptionsListItemProps } from "./PricingOptionsListItem";
import { PricingListOptionWrapper } from "./styles";

const pricingOptions: PricingOptionsListItemProps[] = [
  {
    colorScheme: "#F8AFDB",
    title: "Basic",
    description: "For new communities",
    price: 0,
    buttonText: "Start",
    features: ["100 members", "100 quests", "Hosted quest pages", "Simple rewards", "General support", "1 admin"],
  },
  {
    colorScheme: "#2A8D5C",
    title: "Hobby",
    description: "For growing communities",
    price: 29,
    buttonText: "Upgrade",
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
    colorScheme: "#F8642D",
    title: "Premium",
    description: "For big communities",
    price: 87,
    buttonText: "Upgrade",
    best: true,
    features: [
      "Everything in Hobby",
      "Unlimited members",
      "More social verifications +++",
      "Custom onboarding session",
      "Custom banners",
      "Batch pay with Gnosis",
      "Premium on-chain verifications",
      "Customize levels",
      "10 admins",
    ],
  },
  {
    colorScheme: "#84BCFF",
    title: "Ecosystem",
    description: "For ecosystem projects",
    price: 195,
    buttonText: "Talk to Sales",
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

const PricingOptionsList = () => {
  return (
    <PricingListOptionWrapper>
      {pricingOptions.map((i) => (
        <PricingOptionsListItem {...i} />
      ))}
    </PricingListOptionWrapper>
  );
};

export default PricingOptionsList;
