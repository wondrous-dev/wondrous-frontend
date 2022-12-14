import { Badge } from '@mui/material';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import { NoUnderlineLink } from 'components/Common/Link/links';
import SmartLink from 'components/Common/SmartLink';
import { Wrapper } from 'components/HeaderItems/CreateEntityComponent/styles';
import NotificationsIcon from 'components/Icons/notifications';
import { getNotificationDescription, getNotificationLink } from 'components/Notifications/utils';
import Tooltip from 'components/Tooltip';
import { GET_NOTIFICATIONS } from 'graphql/queries';
import React, { forwardRef, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useInView } from 'react-intersection-observer';
import { LIMIT } from 'services/board';
import calculateTimeLapse from 'utils/calculateTimeLapse';
import { ENTITIES_TYPES, NOTIFICATION_TYPES } from 'utils/constants';
import { useHotkey, useNotifications, useOutsideAlerter } from 'utils/hooks';
import { HOTKEYS } from 'utils/hotkeyHelper';
import { SmallAvatar } from '../Common/AvatarList';
import { HeaderItemWrapper, StyledBadge } from '../Header/styles';
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

const NotificationsBoard = forwardRef(
  ({ onlyBoard = false, isActive = true, setIsActive = () => {}, isOpen = false }: any, forwardedRef: any) => {
    const { notifications, unreadCount, fetchMore, markAllNotificationsRead, markNotificationRead, hasMore } =
      useNotifications();
    const [ref, inView] = useInView({});
    const toggleNotifications = () => {
      setIsActive();
    };
    const getNotificationActorLink = (notification) => {
      if (notification?.actorType === ENTITIES_TYPES.USER) {
        return `/profile/${notification.actorUsername}/about`;
      }
      if (notification?.actorType === ENTITIES_TYPES.ORG) {
        return `/organization/${notification.actorUsername}/home  `;
      }
      if (notification?.actorType === ENTITIES_TYPES.POD) {
        return `/pod/${notification?.actorId}/boards`;
      }
    };

    const getNotificationActorUsername = (notification) => {
      if (notification?.actorType === ENTITIES_TYPES.USER) {
        return notification.actorUsername;
      }
      if (notification?.actorType === ENTITIES_TYPES.ORG) {
        if (notification?.type === NOTIFICATION_TYPES.COLLAB_INVITE) {
          return notification?.additionalData?.invitorOrgName;
        }
        if (notification?.type === NOTIFICATION_TYPES.COLLAB_APPROVE) {
          return notification?.additionalData?.recipientOrgName;
        }
        return notification.actorUsername;
      }
      if (notification?.actorType === ENTITIES_TYPES.POD) {
        return notification?.actorUsername;
      }
    };
    const showBadge = useHotkey();

    const handleMarkAllRead = async () => {
      // Mark all read (empty arg)
      markAllNotificationsRead();
    };

    useEffect(() => {
      if (inView && hasMore && notifications?.length >= LIMIT) {
        fetchMore();
      }
    }, [inView, hasMore, notifications?.length]);

    // Construct Text of Notification
    const getNotificationText = (notification) => {
      const actor = notification?.actorId ? (
        <NotificationsLink>
          <NoUnderlineLink href={getNotificationActorLink(notification)}>
            {getNotificationActorUsername(notification)}
          </NoUnderlineLink>
        </NotificationsLink>
      ) : null;
      const link = getNotificationLink(notification);

      const description = getNotificationDescription(notification, link);
      const notificationTimeStamp = (
        <span>
          <NotificationItemTimeline>{calculateTimeLapse(notification.timestamp)}</NotificationItemTimeline>
        </span>
      );

      return (
        <>
          {actor} {description} {notificationTimeStamp}
        </>
      );
    };

    useHotkeys(
      HOTKEYS.OPEN_NOTIFICATION,
      () => {
        setIsActive();
      },
      [setIsActive]
    );

    const getNotificationActorIcon = (notification) => {
      if (!notification?.actorId) return;
      const initials = notification?.actorUsername && notification.actorUsername[0];
      const avatar = {
        url: notification.actorThumbnail || notification.actorProfilePicture,
      };

      return <SmallAvatar initials={initials} avatar={avatar} />;
    };

    const getContentPreview = (notification) => {
      if (notification?.additionalData?.contentPreview) {
        let contentPreview = notification.additionalData.contentPreview.substring(0, 30);
        contentPreview.length < notification.additionalData.contentPreview.length
          ? (contentPreview += '...')
          : undefined;
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
      <div>
        <StyledBadge
          color="primary"
          isActive={isActive}
          hasUnreadNotifications={unreadCount > 0}
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
        <HeaderItemWrapper ref={forwardedRef} style={{ display }}>
          <Wrapper>
            <NotificationsBoardHeader>
              <NotificationsTitle>Notifications</NotificationsTitle>
              <NotificationsMarkRead enabled={unreadCount > 0}>
                <span onClick={handleMarkAllRead}>Mark all as read</span>
              </NotificationsMarkRead>
            </NotificationsBoardHeader>
            <NotificationsBoardWrapper>
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
          </Wrapper>
        </HeaderItemWrapper>
      </div>
    );
  }
);

export default NotificationsBoard;
