import { ButtonBase } from '@mui/material';
import { getDiscordUrl } from 'utils/discord';
import DiscordIcon from 'components/Icons/Login/discord.svg';

const discordUrlWithoutState = getDiscordUrl();

const DiscordConnect = ({ state }) => {
  const discordUrl = `${discordUrlWithoutState}&state=${state}`;
  return (
    <ButtonBase onClick={() => (window.location.href = discordUrl)}>
      <img src={DiscordIcon} />
    </ButtonBase>
  );
};

export default DiscordConnect;
