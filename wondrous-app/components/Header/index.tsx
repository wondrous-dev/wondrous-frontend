import { useRouter } from 'next/router';

import { useIsMobile, useGlobalContext } from 'utils/hooks';
import { useMe, withAuth } from 'components/Auth/withAuth';
import HeaderMemo from 'components/Header/HeaderMemo';
import { useContext, useEffect } from 'react';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { ConnectDiscordLink } from './styles';

const DISCORD_SNACKBAR_DURATION = 1000 * 60 * 10;

const HeaderComponent = () => {
  const user = useMe();
  const isMobile = useIsMobile();
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAutoHideDuration } =
    useContext(SnackbarAlertContext);
  const globalContext = useGlobalContext();
  const { toggleCreateFormModal: openCreateFormModal } = globalContext;
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
  ];
  const showCreateButton = urlsWithCreateButton.some((url) => router.pathname?.includes(url));

  useEffect(() => {
    if (user && !user?.userInfo?.discordUsername && router.pathname !== '/profile/settings') {
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
      openCreateFormModal={openCreateFormModal}
      showCreateButton={showCreateButton}
      user={user}
    />
  );
};

export default withAuth(HeaderComponent);
