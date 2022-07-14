import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';

import Box from '@mui/material/Box';

import { MARK_ALL_NOTIFICATIONS_READ, MARK_NOTIFICATIONS_READ } from 'graphql/mutations/notification';
import { GET_NOTIFICATIONS } from 'graphql/queries';
import { useIsMobile } from 'utils/hooks';

import Wallet from 'components/Common/Wallet';
import { useMe, withAuth } from '../Auth/withAuth';
import { CreateIconOutlined } from 'components/Icons/createBtn';
import { Button } from 'components/Common/button';
import NotificationsBoard from 'components/Notifications';
import Tooltip from 'components/Tooltip';
import HomeIcon from 'components/Icons/home';

import {
  Header,
  HeaderContainer,
  HeaderCreateButton,
  HeaderHomeButton,
  HeaderLeftBlock,
  HeaderLogo,
  HeaderRightBlock,
  HeaderHomeButtonWrapper,
  HeaderLogoWrapper,
} from './styles';

const HeaderComponent = (props) => {
  const user = useMe();
  const isMobile = useIsMobile();

  // Grab Notifications from Backend
  const { data: notifications, refetch, fetchMore: fetchMoreNotifications } = useQuery(GET_NOTIFICATIONS);
  const [markAllNotificationsRead] = useMutation(MARK_ALL_NOTIFICATIONS_READ);
  const [markNotificationRead] = useMutation(MARK_NOTIFICATIONS_READ);
  const { openCreateFormModal } = props;
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
    <Header>
      <HeaderContainer>
        <HeaderLeftBlock>
          <Tooltip title="Explore page">
            <HeaderLogoWrapper>
              <div onClick={() => router.push('/explore')}>
                <HeaderLogo />
              </div>
            </HeaderLogoWrapper>
          </Tooltip>
          <Tooltip title="Dashboard">
            <Box>
              <Link passHref href="/dashboard">
                <HeaderHomeButtonWrapper>
                  <HeaderHomeButton>
                    <HomeIcon id="tour-header-dashboard-icon" />
                  </HeaderHomeButton>
                </HeaderHomeButtonWrapper>
              </Link>
            </Box>
          </Tooltip>
        </HeaderLeftBlock>
        <HeaderRightBlock>
          {user && (
            <>
              {!isMobile && <Wallet />}
              <NotificationsBoard
                fetchMoreNotifications={fetchMoreNotifications}
                notifications={notifications?.getNotifications || []}
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
              onClick={() => {
                router.push('/login');
              }}
            >
              Sign in
            </Button>
          )}
        </HeaderRightBlock>
      </HeaderContainer>
    </Header>
  );
};

export default withAuth(HeaderComponent);
