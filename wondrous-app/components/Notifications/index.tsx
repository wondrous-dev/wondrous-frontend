import { Link } from '@material-ui/core';
import React, { useMemo, useState } from 'react';
import { NOTIFICATION_OBJECT_TYPES, NOTIFICATION_VERBS, snakeToCamel } from '../../utils/constants';
import { SmallAvatar } from '../Common/AvatarList';
import { DropDown, DropDownItem } from '../Common/dropdown';
import { StyledLink } from '../Common/text';
import { formatDistance } from 'date-fns';

import { HeaderNotificationsButton, StyledBadge } from '../Header/styles';
import NotificationsIcon from '../Icons/notifications';
import { TaskMenuIcon } from '../Icons/taskMenu';
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
} from './styles';
import { MARK_NOTIFICATIONS_READ } from '../../graphql/mutations/notification';
import { useMutation } from '@apollo/client';
import { GET_NOTIFICATIONS } from '../../graphql/queries';

const NotificationsBoard = ({ notifications, setNofications }) => {
  const unreadCount = useMemo(() => {
    return notifications?.getNotifications?.filter((n) => !n.viewedAt).length;
  }, [notifications]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const calculateTimeLapse = (timestamp) => {
    return formatDistance(new Date(timestamp), new Date(), {
      addSuffix: true,
    });
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

    const actor = <StyledLink href={`/profile/${userId}/about`}>{userName}</StyledLink>;

    const verb = NOTIFICATION_VERBS[notification.type];
    const objectType = NOTIFICATION_OBJECT_TYPES[notification.objectType];
    const objectId = notification.objectId;

    const object = <StyledLink href={`/${snakeToCamel(notification.objectType)}/${objectId}`}>{objectType}</StyledLink>;

    return (
      <>
        {actor} {verb} {object}
      </>
    );
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
            <NotificationsMarkRead enabled={notifications?.getNofications?.length}>
              <span style={{ cursor: 'pointer' }} onClick={handleMarkAllRead}>
                Mark all as read
              </span>
            </NotificationsMarkRead>
            <div style={{ lineHeight: '12px' }}>
              <DropDown DropdownHandler={TaskMenuIcon}>
                <DropDownItem key={'notifications-menu-clean'} onClick={handleMarkAllRead}>
                  Mark all read
                </DropDownItem>
              </DropDown>
            </div>
          </NotificationsBoardHeader>
          {notifications?.getNotifications?.length ? (
            notifications.getNotifications?.map((notification) => (
              <NotificationsItem
                key={'notifications-' + notification.id}
                onClick={() =>
                  markNotificationRead({
                    variables: {
                      notificationId: notification?.id,
                    },
                    refetchQueries: [GET_NOTIFICATIONS],
                  })
                }
              >
                <NotificationItemIcon>
                  {getNotificationActorIcon(notification)}
                  <NotificationItemStatus>{notification.status}</NotificationItemStatus>
                </NotificationItemIcon>
                <NotificationItemBody>
                  <div style={{ paddingTop: '2px' }}>{getNotificationText(notification)}</div>
                  <NotificationItemTimeline>{calculateTimeLapse(notification.timestamp)}</NotificationItemTimeline>
                </NotificationItemBody>
              </NotificationsItem>
            ))
          ) : (
            <NotificationsItem>
              <NotificationItemIcon />
              <NotificationItemBody>No notifications</NotificationItemBody>
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
