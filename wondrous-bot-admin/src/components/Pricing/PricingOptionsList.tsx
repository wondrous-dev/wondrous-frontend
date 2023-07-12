import { useContext } from "react";
import GlobalContext from "utils/context/GlobalContext";
import PricingOptionsListItem, { PricingOptionsListItemProps } from "./PricingOptionsListItem";
import { PricingListOptionWrapper } from "./styles";

const pricingOptions: PricingOptionsListItemProps[] = [
  {
    colorScheme: "#F8AFDB",
    title: "Basic",
    description: "For new communities",
    price: 0,
    buttonText: "Start",
    link: "/signup",
    features: ["100 members", "100 quests", "Hosted quest pages", "Simple rewards", "General support", "1 admin"],
  },
  {
    colorScheme: "#84BCFF",
    title: "Hobby",
    description: "For growing communities",
    price: 29,
    buttonText: "Upgrade",
    link: import.meta.env.VITE_PRODUCTION ? "" : "https://buy.stripe.com/test_eVa5nma5d3Ej8EMbII",
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
    title: "Premium",
    description: "For big communities",
    price: 87,
    buttonText: "Upgrade",
    best: true,
    link: import.meta.env.VITE_PRODUCTION ? "" : "https://buy.stripe.com/test_14kg206T1a2HdZ68wx",
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
    title: "Ecosystem",
    description: "For ecosystem projects",
    price: 195,
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

const PricingOptionsList = () => {
  const { activeOrg } = useContext(GlobalContext);
  return (
    <PricingListOptionWrapper>
      {pricingOptions.map((i) => {
        if (
          (i.title === "Hobby" || i.title === "Premium") && // TODO: make constant
          activeOrg?.id &&
          !i.link?.includes("client_reference_id")
        ) {
          i.link = `${i.link}?client_reference_id=${activeOrg?.id}`;
        }
        return <PricingOptionsListItem {...i} />;
      })}
    </PricingListOptionWrapper>
  );
};

export default PricingOptionsList;
