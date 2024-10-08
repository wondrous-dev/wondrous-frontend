import { useRouter } from 'next/router';

import { useIsMobile, useGlobalContext } from 'utils/hooks';
import { useMe, withAuth } from 'components/Auth/withAuth';
import HeaderMemo from 'components/Header/HeaderMemoized';
import { useContext, useEffect } from 'react';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { ConnectDiscordLink } from './styles';

const DISCORD_SNACKBAR_DURATION = 1000 * 60 * 2;

const HeaderComponent = () => {
  const user = useMe();
  const isMobile = useIsMobile();
  const {orgsList} = useGlobalContext();
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAutoHideDuration } =
    useContext(SnackbarAlertContext);
  const router = useRouter();
  const urlsWithCreateButton = [
    '/boards',
    '/dashboard',
    '/activities',
    '/docs',
    '/analytics',
    '/explore',
    '/profile',
    '/settings',
    '/mission-control',
    '/grants',
    '/home',
  ];
  const showCreateButton = urlsWithCreateButton.some((url) => router.pathname?.includes(url));

  const urlsWithDiscord = ['/mission-control', '/dashboard'];
  useEffect(() => {
    const randomNum = Math.random();
    // either we land on dashboard or mission control, or there's 10% chance of showing the snackbar
    if (
      user &&
      !user?.userInfo?.discordUsername &&
      (urlsWithDiscord.indexOf(router.pathname) > -1 || (randomNum < 0.1 && router.pathname !== '/profile/settings'))
    ) {
      setSnackbarAlertOpen(true);
      setSnackbarAlertAutoHideDuration(DISCORD_SNACKBAR_DURATION);
      setSnackbarAlertMessage(
        <>
          <ConnectDiscordLink href="/profile/settings" target="_blank" rel="noreferrer">
            Connect your Discord
          </ConnectDiscordLink>{' '}
          <span>for notifications for upcoming tasks, comments and more!</span>
        </>
      );
    }
  }, [user]);

  return (
    <HeaderMemo
      isMobile={isMobile}
      onSignInClick={() => router.push('/login')}
      showCreateButton={showCreateButton}
      user={user}
      orgsList={orgsList}
    />
  );
};

export default withAuth(HeaderComponent);
