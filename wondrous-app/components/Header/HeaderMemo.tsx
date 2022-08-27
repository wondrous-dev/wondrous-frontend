import { Button } from 'components/Common/button';
import Wallet from 'components/Common/Wallet';
import { CreateIconOutlined } from 'components/Icons/createBtn';
import NotificationsBoard from 'components/Notifications';
import { memo } from 'react';
import { Notification } from 'types/Notification';
import { User } from 'types/User';
import { HeaderBar, HeaderCreateButton } from './styles';

type Props = {
  fetchMoreNotifications: (fetchData, fetchVars) => unknown;
  isMobile: boolean;
  notifications: Notification[];
  onSignInClick: () => unknown;
  openCreateFormModal: () => unknown;
  setNotifications: () => unknown;
  showCreateButton: boolean;
  user: User | null;
};

const HeaderMemo = ({
  fetchMoreNotifications,
  isMobile,
  notifications,
  onSignInClick,
  openCreateFormModal,
  setNotifications,
  showCreateButton,
  user,
}: Props) => (
  <HeaderBar>
    {user && (
      <>
        {!isMobile && <Wallet />}
        <NotificationsBoard
          fetchMoreNotifications={fetchMoreNotifications}
          notifications={notifications}
          setNotifications={setNotifications}
        />
        <HeaderCreateButton highlighted="true" onClick={openCreateFormModal} visibility={showCreateButton}>
          <CreateIconOutlined id="tour-header-create-btn" />
        </HeaderCreateButton>
      </>
    )}
    {!user && (
      <Button
        highlighted
        type="submit"
        style={{
          width: '100px',
        }}
        onClick={onSignInClick}
      >
        Sign in
      </Button>
    )}
  </HeaderBar>
);

// eslint-disable-next-line react/display-name
export default memo(
  HeaderMemo,
  (prevProps, nextProps) =>
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.showCreateButton === nextProps.showCreateButton &&
    prevProps.user?.id === nextProps.user?.id &&
    prevProps.notifications.length === nextProps.notifications.length &&
    prevProps.notifications.every(
      (notification, index) =>
        notification.id === nextProps.notifications[index]?.id &&
        notification.viewedAt === nextProps.notifications[index]?.viewedAt
    )
);
