import React, { useMemo, useState, useEffect } from 'react';
import { COLLAB_TYPES, NOTIFICATION_OBJECT_TYPES, NOTIFICATION_VERBS, snakeToCamel } from 'utils/constants';
import NotificationsIcon from 'components/Icons/notifications';
import Link from 'next/link';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import { useInView } from 'react-intersection-observer';
import { GET_NOTIFICATIONS } from 'graphql/queries';
import calculateTimeLapse from 'utils/calculateTimeLapse';
import SmartLink from 'components/Common/SmartLink';
import Tooltip from 'components/Tooltip';
import { useNotifications } from 'utils/hooks';
import { LIMIT } from 'services/board';
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
import { StyledBadge } from '../Header/styles';
import { SmallAvatar } from '../Common/AvatarList';

function NotificationsBoard({ onlyBoard = false }) {
  const { notifications, unreadCount, fetchMore, markAllNotificationsRead, markNotificationRead, hasMore } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [ref, inView] = useInView({});
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAllRead = async () => {
    // Mark all read (empty arg)
    markAllNotificationsRead();
  };

  const getNotificationActorIcon = (notification) => {
    const initials = notification?.actorUsername && notification.actorUsername[0];
    const avatar = {
      url: notification.actorThumbnail,
    };

    return <SmallAvatar initials={initials} avatar={avatar} />;
  };

  useEffect(() => {
    if (inView && hasMore && notifications?.length >= LIMIT) {
      fetchMore();
    }
  }, [inView, hasMore, notifications?.length]);

  const getNotificationLink = (notification) => {
    let notificationLink = `/${snakeToCamel(notification.objectType)}/${notification.objectId}`;

    if (notification.objectType === NOTIFICATION_OBJECT_TYPES.collaboration) {
      const mainPath = notification.type === COLLAB_TYPES.INVITE ? 'organization' : 'collaboration';
      notificationLink = `/${mainPath}/${notification.additionalData.orgUsername}/boards?collabs=${true}${
        notification.additionalData?.addMember && !notification.viewedAt ? `&addMembers=${true}` : ''
      }`;
    }
    return notificationLink;
  };
  // Construct Text of Notification
  const getNotificationText = (notification) => {
    const userName = notification.actorUsername;
    const actor = (
      <NotificationsLink>
        <Link href={`/profile/${userName}/about`}>{userName}</Link>
      </NotificationsLink>
    );

    const verb = NOTIFICATION_VERBS[notification.type];
    const objectType = NOTIFICATION_OBJECT_TYPES[notification.objectType];

    const link = getNotificationLink(notification);
    const object = (
      <span>
        <NotificationsLink styled={{ display: 'block' }}>
          <Link href={link}>{objectType}</Link>
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
      contentPreview.length < notification.additionalData.contentPreview.length ? (contentPreview += '...') : undefined;
      return contentPreview;
    }
    return null;
  };

  const display = isOpen ? 'block' : 'none';

  if (onlyBoard) {
    return (
      <>
        {notifications?.length ? (
          notifications?.map((notification) => {
            const isNotificationViewed = notification?.viewedAt;
            const notificationLink = getNotificationLink(notification);
            return (
              <SmartLink
                key={`notifications-${notification.id}`}
                href={notificationLink}
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
          <NotificationsItem emptyNotifications>
            <NotificationItemBody emptyNotifications>No notifications</NotificationItemBody>
          </NotificationsItem>
        )}
        <LoadMore
          style={{
            height: '20px',
          }}
          hasMore
          ref={ref}
        />
      </>
    );
  }
  return (
    <>
      <NotificationsOverlay onClick={toggleNotifications} style={{ display }} />
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
        <NotificationsBoardWrapper style={{ display }}>
          <NotificationsBoardHeader>
            <NotificationsTitle>Notifications</NotificationsTitle>
            <NotificationsMarkRead enabled={unreadCount > 0}>
              <span onClick={handleMarkAllRead}>Mark all as read</span>
            </NotificationsMarkRead>
          </NotificationsBoardHeader>
          {notifications?.length ? (
            notifications?.map((notification) => {
              const isNotificationViewed = notification?.viewedAt;
              const notificationLink = getNotificationLink(notification);

              return (
                <SmartLink
                  key={`notifications-${notification.id}`}
                  href={notificationLink}
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
            <NotificationsItem emptyNotifications>
              <NotificationItemBody emptyNotifications>No notifications</NotificationItemBody>
            </NotificationsItem>
          )}
          <LoadMore
            style={{
              height: '20px',
            }}
            hasMore
            ref={ref}
          />
        </NotificationsBoardWrapper>
        <NotificationsBoardArrow style={{ display }} />
        <NotificationsBoardOverArrow style={{ display }} />
      </div>
    </>
  );
}

export default NotificationsBoard;
