import MembersAnalytics from "components/MembersAnalytics";

export const FAKE_DATA = [
  {
    id: "1",
    name: {
      component: "custom",
      value: {
        username: "Dwight Schrute",
        id: '1',
        web3Address: '0x1234567890',
        level: 9,
        point: '400',
        discordUsername: 'bears_beets',
        twitterInfo: {
          twitterUsername: 'SchruteFarms'
        },
        telegramUsername: 'SchruteFarms'
      },
      customComponent: (props) => <MembersAnalytics {...props} />,
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
