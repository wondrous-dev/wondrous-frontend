import React from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { InputAdornment } from '@material-ui/core';

import Link from 'next/link';

import { GET_NOTIFICATIONS } from 'graphql/queries';
import { MARK_ALL_NOTIFICATIONS_READ, MARK_NOTIFICATIONS_READ } from 'graphql/mutations/notification';

import NotificationsBoard from 'components/Notifications';
import HomeIcon from 'components/Icons/home';
import SearchIcon from 'components/Icons/search';
import CreateBtnIcon from 'components/Icons/createBtn';
import Tooltip from 'components/Tooltip';
import Wallet from 'components/Common/Wallet';

import {
  Header,
  HeaderHomeButton,
  HeaderInput,
  HeaderLeftBlock,
  HeaderLogo,
  HeaderRightBlock,
  HeaderContainer,
  HeaderCreateButton,
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
  return (
    <Header>
      <HeaderContainer>
        <HeaderLeftBlock>
          <HeaderLogo />
          <Link passHref href="/dashboard">
            <Tooltip title="Dashboard">
              <HeaderHomeButton>
                <HomeIcon />
              </HeaderHomeButton>
            </Tooltip>
          </Link>

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
          <Wallet />

          <NotificationsBoard notifications={notifications || []} setNofications={setNotifications} />
          {pathname.includes('/boards') || pathname.includes('/dashboard') ? (
            <HeaderCreateButton highlighted="true" onClick={openCreateFormModal}>
              <span style={{ padding: '0px 8px' }}>Create</span>
              <CreateBtnIcon />
            </HeaderCreateButton>
          ) : (
            <HeaderCreateButton highlighted="true" style={{ visibility: 'hidden' }}>
              <span style={{ padding: '0px 8px' }}>Create</span>
              <CreateBtnIcon />
            </HeaderCreateButton>
          )}
        </HeaderRightBlock>
      </HeaderContainer>
    </Header>
  );
};

export default HeaderComponent;
