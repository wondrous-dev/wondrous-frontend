import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';

import { MARK_ALL_NOTIFICATIONS_READ, MARK_NOTIFICATIONS_READ } from 'graphql/mutations/notification';
import { useIsMobile, useGlobalContext } from 'utils/hooks';
import { useMe, withAuth } from '../Auth/withAuth';
import HeaderMemo from './HeaderMemo';

const HeaderComponent = () => {
  const user = useMe();
  const isMobile = useIsMobile();

  const globalContext = useGlobalContext();
  const { toggleCreateFormModal: openCreateFormModal } = globalContext;
  const router = useRouter();
  const urlsWithCreateButton = ['/boards', '/dashboard', '/activities', '/docs', '/analytics'];
  const showCreateButton = urlsWithCreateButton.some((url) => router.pathname?.includes(url));

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
