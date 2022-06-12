import { useMutation, useQuery } from '@apollo/client';
import { InputAdornment, Typography } from '@material-ui/core';
import Wallet from 'components/Common/Wallet';
import { useMe } from '../Auth/withAuth';
import CreateBtnIcon from 'components/Icons/createBtn';
import HomeIcon from 'components/Icons/home';
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
} from './styles';

const HeaderComponent = (props) => {
  const user = useMe();
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
            <div style={{ display: 'flex' }}>
              <Link passHref href="/dashboard">
                <HeaderLogo />
              </Link>
            </div>
          </Tooltip>
          <Tooltip title="Dashboard">
            <div>
              <Link passHref href="/dashboard">
                <HeaderHomeButton>
                  <HomeIcon />
                </HeaderHomeButton>
              </Link>
            </div>
          </Tooltip>
          <HeaderInput
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
          />
        </HeaderLeftBlock>
        <HeaderRightBlock>
          <a
            style={{
              textDecoration: 'none',
            }}
            href="https://linktr.ee/wonderverse"
            target="_blank"
            rel="noreferrer"
          >
            <TutorialButton
              style={{
                borderRadius: '8px',
              }}
              buttonInnerStyle={{
                borderRadius: '7px',
              }}
            >
              <TutorialText>Wonder Tutorials</TutorialText>
            </TutorialButton>
          </a>
          {user && (
            <>
              <Wallet />
              <NotificationsBoard
                fetchMoreNotifications={fetchMoreNotifications}
                notifications={notifications?.getNotifications || []}
                setNotifications={setNotifications}
              />
              <HeaderCreateButton highlighted="true" onClick={openCreateFormModal} visibility={showCreateButton}>
                <span style={{ padding: '0px 8px' }}>Create</span>
                <CreateBtnIcon />
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
