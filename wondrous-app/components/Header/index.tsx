import { useMutation, useQuery } from '@apollo/client';
import { InputAdornment, Typography } from '@material-ui/core';
import Wallet from 'components/Common/Wallet';
import CreateBtnIcon from 'components/Icons/createBtn';
import HomeIcon from 'components/Icons/home';
import SearchIcon from 'components/Icons/search';
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
  // Grab Notifications from Backend
  const { data: notifications, refetch } = useQuery(GET_NOTIFICATIONS);
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

  const { pathname } = useRouter();
  const urlsWithCreateButton = ['/boards', '/dashboard', '/activities'];
  const showCreateButton = urlsWithCreateButton.some((url) => pathname.includes(url));
  return (
    <Header>
      <HeaderContainer>
        <HeaderLeftBlock>
          <Link passHref href="/dashboard">
            <HeaderLogo />
          </Link>
          <Tooltip title="Dashboard">
            <Link passHref href="/dashboard">
              <HeaderHomeButton>
                <HomeIcon />
              </HeaderHomeButton>
            </Link>
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
          <Wallet />

          <NotificationsBoard notifications={notifications || []} setNofications={setNotifications} />
          <HeaderCreateButton highlighted="true" onClick={openCreateFormModal} visibility={showCreateButton}>
            <span style={{ padding: '0px 8px' }}>Create</span>
            <CreateBtnIcon />
          </HeaderCreateButton>
        </HeaderRightBlock>
      </HeaderContainer>
    </Header>
  );
};

export default HeaderComponent;
