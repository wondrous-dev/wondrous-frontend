import { DataTitle, StyledUsername } from "./styles";
import { useState } from "react";
import Modal from "components/Shared/Modal";
import { Box, Grid } from "@mui/material";
import { AddressComponent, IntegrationsComponent, NameComponent, XpComponent } from "./Common";
import DiscordAnalytics from "./DiscordAnalytics";
import Submissions from "./Submissions";
import OnboardingSubmissions from "./OnboardingSubmissions";

const GeneralInfo = ({ user }) => {
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

const MembersAnalytics = ({ value, onClose = null }) => {
  const [activeCmtyUser, setActiveCmtyUser] = useState(null);
  const username = value?.username || value?.discordUsername || value?.telegramUsername || "N/A";

  const handleUsernameClick = (cmtyUserId) => {
    return setActiveCmtyUser(cmtyUserId);
  };

  const handleClose = () => {
    onClose?.();
    return setActiveCmtyUser(null);
  };

  const CONFIG = [
    {
      id: "general-info",
      component: () => <GeneralInfo user={value} />,
    },
    {
      id: "messages-reactions",

      component: () => <DiscordAnalytics user={value} />,
    },
    {
      id: "onboarding",
      component: () => <OnboardingSubmissions user={value} />,
    },
    {
      id: "submissions",
      component: () => <Submissions user={value} />,
    },
  ];

  return (
    <>
      <Modal
        modalComponentProps={{
          className: "tour-default-modal",
        }}
        dialogComponentProps={{
          className: "tutorials-onboarding-modal",
        }}
        open={!!activeCmtyUser}
        onClose={handleClose}
        title={`${username}`}
        maxWidth={740}
      >
        <Grid display="flex" gap="32px" flexDirection="column">
          {activeCmtyUser
            ? CONFIG.map((config, idx) => {
                return <config.component key={config.id} />;
              })
            : null}
        </Grid>
      </Modal>
      <StyledUsername
        fontSize="14px"
        lineHeight="14px"
        textAlign="center"
        data-tour="tutorial-members-username"
        width="100%"
        onClick={() => handleUsernameClick(value?.id)}
      >
        {username}
      </StyledUsername>
    </>
  );
};

export default MembersAnalytics;
