import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';

import { MARK_ALL_NOTIFICATIONS_READ, MARK_NOTIFICATIONS_READ } from 'graphql/mutations/notification';
import { GET_NOTIFICATIONS } from 'graphql/queries';
import { useIsMobile, useCreateEntityContext } from 'utils/hooks';
import { useMe, withAuth } from '../Auth/withAuth';
import HeaderMemo from './HeaderMemo';

const HeaderComponent = () => {
  const user = useMe();
  const isMobile = useIsMobile();

  // Grab Notifications from Backend
  const { data: notifications, refetch, fetchMore: fetchMoreNotifications } = useQuery(GET_NOTIFICATIONS);
  const [markAllNotificationsRead] = useMutation(MARK_ALL_NOTIFICATIONS_READ);
  const [markNotificationRead] = useMutation(MARK_NOTIFICATIONS_READ);
  const createEntityContext = useCreateEntityContext();
  const { toggleCreateFormModal: openCreateFormModal } = createEntityContext;
  const setNotifications = async (newNotifications = null) => {
    if (newNotifications) {
      // Mark as read specific notifications
      await newNotifications.map((n) => {
        markNotificationRead(n.id);
      });
    } else {
      // Clean all Notifications
      await markAllNotificationsRead();
    }
    refetch();
  };

  const router = useRouter();
  const urlsWithCreateButton = ['/boards', '/dashboard', '/activities', '/docs', '/analytics'];
  const showCreateButton = urlsWithCreateButton.some((url) => router.pathname?.includes(url));

  return (
    <HeaderMemo
      fetchMoreNotifications={fetchMoreNotifications}
      isMobile={isMobile}
      notifications={notifications?.getNotifications || []}
      onSignInClick={() => router.push('/login')}
      openCreateFormModal={openCreateFormModal}
      setNotifications={setNotifications}
      showCreateButton={showCreateButton}
      user={user}
    />
  );
};

export default withAuth(HeaderComponent);
