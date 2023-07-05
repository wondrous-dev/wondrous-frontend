import { DiscordButton } from "components/ConnectDiscord/styles";
import { getBaseUrl } from "utils/common";
import { WhiteBgDiscord } from "components/Icons/Discord";
import { useTour } from "@reactour/tour";
import { useEffect, useLayoutEffect } from "react";
import { SET_USER_COMPLETED_GUIDE } from "graphql/mutations";
import { useMutation } from "@apollo/client";
import { useMe } from "components/Auth";

const callbackURL = () => encodeURIComponent(`${getBaseUrl()}/discord/callback/org-connect`);

const DiscordClientID = import.meta.env.VITE_DISCORD_CLIENT_ID;

export const getDiscordBotOauthURL = ({ orgId }: { orgId: string }) =>
  `https://discord.com/api/oauth2/authorize?client_id=${DiscordClientID}&permissions=8&scope=bot&response_type=code&state=${encodeURIComponent(
    orgId
  )}&redirect_uri=${callbackURL()}`;

export default function ConnectDiscordButton({ orgId }: { orgId?: string }) {
  const oauthUrl = getDiscordBotOauthURL({ orgId });

  const handleClick = async () => {
    window.location.href = oauthUrl;
  };

  return (
    <DiscordButton onClick={handleClick} data-tour="connect-discord-button">
      <WhiteBgDiscord />
      Add Bot!
    </DiscordButton>
  );
}
