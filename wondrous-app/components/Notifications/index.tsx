import React, { useMemo, useState, useEffect } from 'react';
import { NOTIFICATION_OBJECT_TYPES, NOTIFICATION_VERBS, snakeToCamel } from 'utils/constants';
import { SmallAvatar } from '../Common/AvatarList';
import { StyledBadge } from '../Header/styles';
import NotificationsIcon from 'components/Icons/notifications';
import Link from 'next/link';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import { useInView } from 'react-intersection-observer';
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
import Tooltip from 'components/Tooltip';

const NotificationsBoard = ({ notifications, setNotifications, fetchMoreNotifications }) => {
  const unreadCount = useMemo(() => {
    return notifications?.filter((n) => !n.viewedAt).length;
  }, [notifications]);

  const [isOpen, setIsOpen] = useState(false);
  const [ref, inView] = useInView({});
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAllRead = async () => {
    // Mark all read (empty arg)
    setNotifications();
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
  const hasMore = useEffect(() => {
    if (inView && fetchMoreNotifications) {
      fetchMoreNotifications({
        variables: {
          offset: notifications?.length,
          limit: 10,
        },
      }).then((result) => {
        const newNotifs = result?.data?.getNotifications;
        if (newNotifs && newNotifs?.length > 0) {
          setNotifications([...notifications, newNotifs]);
        }
      });
    }
  }, [inView, fetchMoreNotifications]);
  // Construct Text of Notification
  const getNotificationText = (notification) => {
    const userName = notification.actorUsername;
    const userId = notification.actorId;
    const actor = (
      <NotificationsLink>
        <Link href={`/profile/${userName}/about`}>{userName}</Link>
      </NotificationsLink>
    );

    const verb = NOTIFICATION_VERBS[notification.type];
    const objectType = NOTIFICATION_OBJECT_TYPES[notification.objectType];
    const objectId = notification.objectId;

    const object = (
      <span>
        <NotificationsLink styled={{ display: 'block' }}>
          <Link href={`/${snakeToCamel(notification.objectType)}/${notification.objectId}`}>{objectType}</Link>
        </NotificationsLink>
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
      <div style={{ position: 'relative' }}>
        <StyledBadge
          color="primary"
          hasUnreadNotifications={unreadCount > 0}
          isOpen={isOpen}
          onClick={toggleNotifications}
        >
          <Tooltip title="Notifications">
            <NotificationsIcon />
          </Tooltip>
        </StyledBadge>
        <NotificationsBoardWrapper style={{ display: display }}>
          <NotificationsBoardHeader>
            <NotificationsTitle>Notifications</NotificationsTitle>
            <NotificationsMarkRead enabled={unreadCount > 0}>
              <span onClick={handleMarkAllRead}>Mark all as read</span>
            </NotificationsMarkRead>
          </NotificationsBoardHeader>
          {notifications?.length ? (
            notifications?.map((notification) => {
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
          <LoadMore
            style={{
              height: '20px',
            }}
            hasMore={true}
            ref={ref}
          />
        </NotificationsBoardWrapper>
        <NotificationsBoardArrow style={{ display: display }} />
        <NotificationsBoardOverArrow style={{ display: display }} />
      </div>
    </>
  );
};

export default NotificationsBoard;
