import { useMutation } from '@apollo/client';
import { Badge } from '@mui/material';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import SmartLink from 'components/Common/SmartLink';
import NotificationsIcon from 'components/Icons/notifications';
import Tooltip from 'components/Tooltip';
import { MARK_NOTIFICATIONS_READ } from 'graphql/mutations/notification';
import { GET_NOTIFICATIONS } from 'graphql/queries';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { useEffect, useMemo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import calculateTimeLapse from 'utils/calculateTimeLapse';
import { NOTIFICATION_OBJECT_TYPES, NOTIFICATION_VERBS, snakeToCamel } from 'utils/constants';
import { useHotkey, useNotifications } from 'utils/hooks';
import { HOTKEYS } from 'utils/hotkeyHelper';
import { LIMIT } from 'services/board';
import { SmallAvatar } from '../Common/AvatarList';
import { StyledBadge } from '../Header/styles';
import {
  NotificationItemBody,
  NotificationItemIcon,
  NotificationItemInner,
  NotificationItemStatus,
  NotificationItemTimeline,
  NotificationsBoardArrow,
  NotificationsBoardHeader,
  NotificationsBoardOverArrow,
  NotificationsBoardWrapper,
  NotificationsContentPreview,
  NotificationsDot,
  NotificationsItem,
  NotificationsLink,
  NotificationsMarkRead,
  NotificationsOverlay,
  NotificationsTitle,
  NotificationWrapper,
} from './styles';

function NotificationsBoard({ onlyBoard = false }) {
  const { notifications, unreadCount, fetchMore, markAllNotificationsRead, markNotificationRead, hasMore } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [ref, inView] = useInView({});
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };
  const showBadge = useHotkey();

  const handleMarkAllRead = async () => {
    // Mark all read (empty arg)
    markAllNotificationsRead();
  };

  useHotkeys(
    HOTKEYS.OPEN_NOTIFICATION,
    () => {
      setIsOpen(!isOpen);
    },
    [isOpen]
  );

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
            return (
              <SmartLink
                key={`notifications-${notification.id}`}
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
          <Badge
            badgeContent={HOTKEYS.OPEN_NOTIFICATION}
            color="primary"
            invisible={!showBadge}
            style={{ zIndex: 999 }}
          >
            <Tooltip title="Notifications" style={{ zIndex: 1 }}>
              <NotificationsIcon />
            </Tooltip>
          </Badge>
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
              return (
                <SmartLink
                  key={`notifications-${notification.id}`}
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
