import ButtonImport from 'components/OnboardingDao/ButtonImport';
import { ONBOARDING_DAO_VALUE_LOCAL_STORAGE_KEY } from 'components/OnboardingDao/constants';
import ImportSuccess from 'components/OnboardingDao/ImportSuccess';
import { ButtonsWrapper, Error, ImportButtonWrapper } from 'components/OnboardingDao/styles';
import { useFormikContext } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { getDiscordUrl } from 'utils';
import { DISCORD_CONNECT_TYPES } from 'utils/constants';

const ImportDiscordButton = styled(ButtonImport)`
  background: linear-gradient(270deg, #7427ff -5.62%, #06ffa5 103.12%);
`;

const DiscordLogoIcon = styled((props) => (
  <div {...props}>
    <Image width="33px" height="26px" src="/images/discord-logo.png" alt="discord-icon" />
  </div>
))`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const DISCORD_OAUTH_URL = getDiscordUrl();

const useConnectDiscord = () => {
  const { values } = useFormikContext();
  const handleConnectDiscordClick = () => {
    localStorage.setItem(ONBOARDING_DAO_VALUE_LOCAL_STORAGE_KEY, JSON.stringify(values));
    const state = JSON.stringify({
      callbackType: DISCORD_CONNECT_TYPES.connectOnboardingDao,
    });
    window.location.href = `${DISCORD_OAUTH_URL}&state=${state}`;
  };
  return handleConnectDiscordClick;
};

enum Text {
  DescriptionSuccess = 'You have connected the Discord.',
  UserConnected = 'Discord user already connected to another account.',
  ErrorConnecting = 'Error connecting to Discord. Please try again or contact support.',
}

function InviteCommunity() {
  const router = useRouter();
  const { discordUserExists, discordError, success } = router.query;
  const handleConnectDiscordClick = useConnectDiscord();
  return (
    <ButtonsWrapper>
      <ImportButtonWrapper>
        <ImportDiscordButton Icon={DiscordLogoIcon} onClick={handleConnectDiscordClick}>
          Connect to Discord
        </ImportDiscordButton>
      </ImportButtonWrapper>
      {success && <ImportSuccess>{Text.DescriptionSuccess}</ImportSuccess>}
      {+discordError && !+discordUserExists && <Error>{Text.ErrorConnecting}</Error>}
      {+discordUserExists && <Error>{Text.UserConnected}</Error>}
    </ButtonsWrapper>
  );
}

export default InviteCommunity;
