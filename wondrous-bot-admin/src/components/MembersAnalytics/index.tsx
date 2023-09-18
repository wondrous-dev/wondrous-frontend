import { Label } from "components/QuestsList/styles";
import { StyledUsername } from "./styles";
import { useState } from "react";
import Modal from "components/Shared/Modal";
import { Box, Grid, Typography } from "@mui/material";
import Panel from "./Panel";
import { AddressComponent, IntegrationsComponent, NameComponent, XpComponent } from "./Common";

// general info
// submissions
// approval rate
// rewards
// points
// messages ?
// reactions ?

const GeneralInfo = ({ user }) => {
  console.log(user, "suer");
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
      component: () => (
        <IntegrationsComponent
          user={user}
          type="discord"
        />
      ),
    },
    {
      label: "Twitter",
      component: () => (
        <IntegrationsComponent
          user={user}
          type="twitter"
        />
      ),
    },
    {
      label: "Telegram",
      component: () => (
        <IntegrationsComponent
          user={user}
          type="telegram"
        />
      ),
    },
  ];
  return (
    <Box display="flex" flexDirection="column" gap="8px">
      {ITEMS.map((item, idx) => {
        return (
          <Box display="flex" alignItems="center" gap="24px" padding="10px">
            <Typography
              color="#626262"
              fontFamily="Poppins"
              fontSize="13px"
              fontWeight={600}
              lineHeight="15px"
              minWidth="30%"
            >
              {item.label}
            </Typography>
            {item.component ? <item.component key={idx} /> : null}
          </Box>
        );
      })}
    </Box>
  );
};

const MembersAnalytics = ({ value }) => {
  const [activeCmtyUser, setActiveCmtyUser] = useState(null);
  const username = value?.username || value?.discordUsername || value?.telegramUsername || "N/A";

  const handleUsernameClick = (cmtyUserId) => {
    return setActiveCmtyUser(cmtyUserId);
  };

  const handleClose = () => {
    return setActiveCmtyUser(null);
  };

  const CONFIG = [
    {
      id: "general-info",
      component: () => <GeneralInfo user={value} />,
    },
  ];

  return (
    <>
      <Modal open={!!activeCmtyUser} onClose={handleClose} title={`${username}`} maxWidth={640}>
        <Grid display="flex" gap="14px" flexDirection="column">
          {CONFIG.map((config, idx) => {
            return (
              <Panel>
                <config.component key={config.id} />
              </Panel>
            );
          })}
        </Grid>
      </Modal>
      <StyledUsername
        fontSize="14px"
        lineHeight="14px"
        textAlign="center"
        width="100%"
        onClick={() => handleUsernameClick(value?.id)}
      >
        {username}
      </StyledUsername>
    </>
  );
};

export default MembersAnalytics;
