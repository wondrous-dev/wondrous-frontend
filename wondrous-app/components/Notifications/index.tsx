import React, { useMemo, useState } from 'react';
import { NOTIFICATION_OBJECT_TYPES, NOTIFICATION_VERBS, snakeToCamel } from 'utils/constants';
import { SmallAvatar } from '../Common/AvatarList';
import { HeaderNotificationsButton, StyledBadge } from '../Header/styles';
import NotificationsIcon from '../Icons/notifications';
import Link from 'next/link';

import {
  NotificationItemBody,
  NotificationItemIcon,
  NotificationItemStatus,
  NotificationItemTimeline,
  NotificationsBoardArrow,
  NotificationsBoardHeader,
  NotificationsBoardOverArrow,
  NotificationsBoardWrapper,
  NotificationsItem,
  NotificationsMarkRead,
  NotificationsOverlay,
  NotificationsLink,
  NotificationItemInner,
  NotificationWrapper,
  NotificationsContentPreview,
  NotificationsDot,
  NotificationsTitle,
} from './styles';
import { MARK_NOTIFICATIONS_READ } from 'graphql/mutations/notification';
import { useMutation } from '@apollo/client';
import { GET_NOTIFICATIONS } from 'graphql/queries';
import calculateTimeLapse from 'utils/calculateTimeLapse';
import SmartLink from 'components/Common/SmartLink';

const NotificationsBoard = ({ notifications, setNofications }) => {
  const unreadCount = useMemo(() => {
    return notifications?.getNotifications?.filter((n) => !n.viewedAt).length;
  }, [notifications]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAllRead = async () => {
    // Mark all read (empty arg)
    setNofications();
  };

  const handleNotificationsSettings = () => {
    // console.log('Tap on Notifications Settings');
  };

  const getNotificationActorIcon = (notification) => {
    const initials = notification?.actorUsername && notification.actorUsername[0];
    const avatar = {
      url: notification.actorThumbnail,
    };

    return <SmallAvatar initials={initials} avatar={avatar} />;
  };
  const [markNotificationRead] = useMutation(MARK_NOTIFICATIONS_READ);
  // Construct Text of Notification
  const getNotificationText = (notification) => {
    const userName = notification.actorUsername;
    const userId = notification.actorId;
    const actor = (
      <NotificationsLink>
        <Link href={`/profile/${userId}/about`}>{userName}</Link>
      </NotificationsLink>
    );

    const verb = NOTIFICATION_VERBS[notification.type];
    const objectType = NOTIFICATION_OBJECT_TYPES[notification.objectType];
    const objectId = notification.objectId;

    const object = (
      <span>
        <NotificationsLink styled={{ display: 'block' }}>{objectType}</NotificationsLink>
        <NotificationItemTimeline>{calculateTimeLapse(notification.timestamp)}</NotificationItemTimeline>
      </span>
    );

    return (
      <>
        {actor} {verb} {object}
      </>
    );
  };

  const getContentPreview = (notification) => {
    if (notification?.additionalData?.contentPreview) {
      let contentPreview = notification.additionalData.contentPreview.substring(0, 30);
      contentPreview.length < notification.additionalData.contentPreview.length
        ? (contentPreview = contentPreview + '...')
        : undefined;
      return contentPreview;
    }
    return null;
  };

  const display = isOpen ? 'block' : 'none';

  return (
    <>
      <NotificationsOverlay onClick={toggleNotifications} style={{ display: display }} />
      <div>
        <StyledBadge color="primary" badgeContent={unreadCount} onClick={toggleNotifications}>
          <HeaderNotificationsButton>
            <NotificationsIcon />
          </HeaderNotificationsButton>
        </StyledBadge>
        <NotificationsBoardWrapper style={{ display: display }}>
          <NotificationsBoardHeader>
            <NotificationsTitle>Notifications</NotificationsTitle>
            <NotificationsMarkRead enabled={unreadCount > 0}>
              <span onClick={handleMarkAllRead}>Mark all as read</span>
            </NotificationsMarkRead>
          </NotificationsBoardHeader>
          {notifications?.getNotifications?.length ? (
            notifications.getNotifications?.map((notification) => {
              const isNotificationViewed = notification?.viewedAt;
              return (
                <SmartLink
                  key={'notifications-' + notification.id}
                  href={`/${snakeToCamel(notification.objectType)}/${notification.objectId}`}
                  onClick={() => {
                    markNotificationRead({
                      variables: {
                        notificationId: notification?.id,
                      },
                      refetchQueries: [GET_NOTIFICATIONS],
                    });
                  }}
                >
                  <NotificationsItem isNotificationViewed={isNotificationViewed}>
                    <NotificationItemIcon>
                      {getNotificationActorIcon(notification)}
                      <NotificationItemStatus>{notification.status}</NotificationItemStatus>
                    </NotificationItemIcon>
                    <NotificationWrapper>
                      <NotificationItemBody>
                        <NotificationItemInner>{getNotificationText(notification)}</NotificationItemInner>
                      </NotificationItemBody>
                      <NotificationsContentPreview>{getContentPreview(notification)}</NotificationsContentPreview>
                    </NotificationWrapper>
                    {!isNotificationViewed && <NotificationsDot />}
                  </NotificationsItem>
                </SmartLink>
              );
            })
          ) : (
            <NotificationsItem emptyNotifications={true}>
              <NotificationItemBody emptyNotifications={true}>No notifications</NotificationItemBody>
            </NotificationsItem>
          )}
        </NotificationsBoardWrapper>
        <NotificationsBoardArrow style={{ display: display }} />
        <NotificationsBoardOverArrow style={{ display: display }} />
      </div>
    </>
  );
};

export default NotificationsBoard;
