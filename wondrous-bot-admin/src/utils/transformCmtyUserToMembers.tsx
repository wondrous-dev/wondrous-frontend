import MembersAnalytics from "components/MembersAnalytics";

export const transformUser = (user) => {
  const userDiscordDiscriminator = `${user?.discordUsername}#${user?.discordDiscriminator}`;
  return {
    id: user.id,
    name: {
      component: "custom",
      value: user,
      customComponent: (props) => <MembersAnalytics {...props} />,
    },
    level: {
      component: "hexagon",
      value: user?.level,
    },
    discord: {
      component: "discord",
      value: userDiscordDiscriminator || "N/A",
    },
    twitter: {
      component: "twitter",
      value: `https://twitter.com/${user?.twitterInfo?.twitterUsername}` || "N/A",
    },
    pointsBalance: {
      component: "xp_balance",
      value: user.pointBalance,
      componentProps: {
        fontWeight: 500,
        cmtyUser: user,
      },
    },
    points: {
      component: "xp",
      value: user.point,
      componentProps: {
        fontWeight: 500,
        cmtyUser: user,
      },
    },
  };
};
