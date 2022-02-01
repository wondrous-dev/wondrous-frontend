import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { InputAdornment } from '@material-ui/core';

import HomeIcon from '../Icons/home';
import SearchIcon from '../Icons/search';
import { StatusArchived, StatusAssigned, StatusLiked } from '../Icons/notifications';
import CreateBtnIcon from '../Icons/createBtn';

import Wallet from '../Common/Wallet';

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
import NotificationsBoard from '../Notifications';
import { GET_NOTIFICATIONS } from '../../graphql/queries';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { MARK_ALL_NOTIFICATIONS_READ, MARK_NOTIFICATIONS_READ } from '../../graphql/mutations/notification';
import { useRouter } from 'next/router';

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
            <HeaderHomeButton>
              <HomeIcon />
            </HeaderHomeButton>
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
          />
        </HeaderLeftBlock>
        <HeaderRightBlock>
          <Wallet />

          <NotificationsBoard notifications={notifications || []} setNofications={setNotifications} />
          {pathname.includes('/boards') ? (
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
