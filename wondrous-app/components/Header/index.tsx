import { useMutation, useQuery } from '@apollo/client';
import { InputAdornment, Typography } from '@material-ui/core';
import Wallet from 'components/Common/Wallet';
import { useMe } from '../Auth/withAuth';
import { CreateIconOutlined } from 'components/Icons/createBtn';
import SearchIcon from 'components/Icons/search';
import { Button } from 'components/Common/button';
import NotificationsBoard from 'components/Notifications';
import Tooltip from 'components/Tooltip';
import { MARK_ALL_NOTIFICATIONS_READ, MARK_NOTIFICATIONS_READ } from 'graphql/mutations/notification';
import { GET_NOTIFICATIONS } from 'graphql/queries';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import {
  Header,
  HeaderContainer,
  HeaderCreateButton,
  HeaderHomeButton,
  HeaderInput,
  HeaderLeftBlock,
  HeaderLogo,
  HeaderRightBlock,
  TutorialButton,
  TutorialText,
  HeaderHomeButtonWrapper,
  HeaderLogoWrapper,
} from './styles';
import HomeIcon from 'components/Icons/home';
import { useIsMobile } from 'utils/hooks';
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
              <div onClick={() => (window.location.href = '/explore')}>
                <HeaderLogo />
              </div>
            </HeaderLogoWrapper>
          </Tooltip>
          <Tooltip title="Dashboard">
            <div>
              <Link passHref href="/dashboard">
                <HeaderHomeButtonWrapper>
                  <HeaderHomeButton>
                    <HomeIcon id="tour-header-dashboard-icon" />
                  </HeaderHomeButton>
                </HeaderHomeButtonWrapper>
              </Link>
            </div>
          </Tooltip>
          {/* <HeaderInput
            placeholder="Search wonder..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            style={{
              visibility: 'hidden',
            }}
          /> */}
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

export default HeaderComponent;
