import { DataTitle, StyledUsername } from "./styles";
import { Box } from "@mui/material";
import { AddressComponent, IntegrationsComponent, NameComponent, XpComponent } from "./Common";

export const GeneralInfo = ({ user }) => {
  const ITEMS = [
    {
      label: "Name",
      component: () => (
        <NameComponent name={user?.username || user?.discordUsername || user?.telegramUsername || "N/A"} />
      ),
    },

    {
      label: "Address",
      component: () => <AddressComponent address={user?.web3Address} />,
    },
    {
      label: "Level and XP",
      component: () => <XpComponent level={user?.level} xp={user?.point} />,
    },
    {
      label: "Discord",
      component: () => <IntegrationsComponent user={user} type="discord" />,
    },
    {
      label: "Twitter",
      component: () => <IntegrationsComponent user={user} type="twitter" />,
    },
    {
      label: "Telegram",
      component: () => <IntegrationsComponent user={user} type="telegram" />,
    },
  ];
  return (
    <Box display="flex" flexDirection="column" gap="8px">
      {ITEMS.map((item, idx) => {
        return (
          <Box display="flex" alignItems="center" gap="24px" padding="10px 0px" key={item.label}>
            <DataTitle>{item.label}</DataTitle>
            {item.component ? <item.component /> : null}
          </Box>
        );
      })}
    </Box>
  );
};

const MembersAnalytics = ({ value, setValue }) => {
  const username = value?.username || value?.discordUsername || value?.telegramUsername || "N/A";
  return (
    <>
      <StyledUsername fontSize="14px" lineHeight="14px" textAlign="center" width="100%" onClick={() => setValue()}>
        {username}
      </StyledUsername>
    </>
  );
};

export default MembersAnalytics;
