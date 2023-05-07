import { DiscordButton } from "components/ConnectDiscord/styles";
import { getBaseUrl } from "utils/common";
import { WhiteBgDiscord } from "components/Icons/Discord";

const callbackURL = () =>
  encodeURIComponent(`${getBaseUrl()}/discord/callback/org-connect`);

const DiscordClientID = process.env.VITE_VERCEL_DISCORD_CLIENT_ID;

const getDiscordBotOauthURL = ({ orgId }: { orgId: string }) =>
  `https://discord.com/api/oauth2/authorize?client_id=${DiscordClientID}&permissions=8&scope=bot&response_type=code&state=${encodeURIComponent(
    orgId
  )}&redirect_uri=${callbackURL()}`;

export default function ConnectDiscordButton({ orgId }: { orgId?: string }) {
  const oauthUrl = getDiscordBotOauthURL({ orgId });
  return (
    <DiscordButton onClick={() => (window.location.href = oauthUrl)}>
      <WhiteBgDiscord />
      Add Bot!
    </DiscordButton>
  );
}
