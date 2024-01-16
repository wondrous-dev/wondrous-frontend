import { useTour } from "@reactour/tour";
import MembersAnalytics from "components/MembersAnalytics";

export const withTourProps = (Component) => {
  return (props) => {
    const { setCurrentStep, meta } = useTour();
    const parsedMeta = meta ? JSON.parse(meta) : {};
    if (parsedMeta?.hideModal === true) {
      return null;
    }
    const onClose = () => setCurrentStep((prev) => prev + 1);
    return <Component {...props} onClose={onClose} onClick={() => setCurrentStep(1)} />;
  };
};

export const getFakeData = () => {
  return [
    {
      id: "1",
      name: {
        component: "custom",
        value: {
          username: "Dwight Schrute",
          id: "1",
          web3Address: "0x1234567890",
          level: 9,
          point: "400",
          discordUsername: "bears_beets",
          twitterInfo: {
            twitterUsername: "SchruteFarms",
          },
          telegramUsername: "SchruteFarms",
        },
        customComponent: withTourProps(MembersAnalytics),
      },
      level: {
        component: "hexagon",
        value: 9,
      },
      discord: {
        component: "discord",
        value: "bears_beets",
      },
      twitter: {
        component: "twitter",
        value: `https://twitter.com/${"@SchruteFarms"}` || "N/A",
      },
      pointsBalance: {
        component: "xp_balance",
        value: 80,
        componentProps: {
          fontWeight: 500,
          //   cmtyUser: user,
        },
      },
      points: {
        component: "xp",
        value: 400,
        componentProps: {
          fontWeight: 500,
          //   cmtyUser: user,
        },
      },
    },
  ];
};
