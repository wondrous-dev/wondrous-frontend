import React from 'react';
import * as Sentry from '@sentry/nextjs';
import { NOTIFICATION_OBJECT_TYPES, NOTIFICATION_TYPES } from 'utils/constants';
import { NoUnderlineLink } from 'components/Common/Link/links';
import { NotificationsLink } from './styles';

export default function getNotificationDescription(notification, link) {
  const objectType = NOTIFICATION_OBJECT_TYPES[notification.objectType];
  const object = (
    <span>
      <NotificationsLink styled={{ display: 'block' }}>
        <NoUnderlineLink href={link}>{objectType}</NoUnderlineLink>
      </NotificationsLink>
    </span>
  );
  /// these languages are wrong potentailly need to consider the actor
  switch (notification?.type) {
    case NOTIFICATION_TYPES.MENTION:
      return <>mentioned you in a {object}</>;
    case NOTIFICATION_TYPES.COMMENT:
      return <>comented on {object}</>;
    // ====
    case NOTIFICATION_TYPES.TASK_ASSIGN:
      return <>assigned a {object} to you</>;
    case NOTIFICATION_TYPES.CREATOR_TASK_ASSIGN:
      return <>your {object} was asigned</>;
    // ====
    case NOTIFICATION_TYPES.PROPOSAL_APPROVE:
      return <>your {object} was approved</>;
    case NOTIFICATION_TYPES.PROPOSAL_REJECT:
      return <>your {object} was rejected</>;
    // ====
    case NOTIFICATION_TYPES.SUBMISSION_CREATE:
      return (
        <>
          made a {object} on {notification.additionalData?.taskType}{' '}
        </>
      );
    case NOTIFICATION_TYPES.SUBMISSION_APPROVE:
      return <>rejected your {object}</>;
    case NOTIFICATION_TYPES.SUBMISSION_REJECT:
      return <>approved your {object}</>;
    case NOTIFICATION_TYPES.SUBMISSION_REQUEST_CHANGE:
      return <>requested change on your {object}</>;
    case NOTIFICATION_TYPES.SUBMISSION_RESUBMIT:
      return <>resubmitted {object}</>;
    // ====
    case NOTIFICATION_TYPES.COLLAB_INVITE:
      return <>invited your org to a {object} </>;
    case NOTIFICATION_TYPES.COLLAB_APPROVE:
      return <>approved a {object} </>;
    case NOTIFICATION_TYPES.COLLAB_DECLINE:
      return <>declined request to create a {object} </>;
    // ====
    case NOTIFICATION_TYPES.TASK_MINTED:
      return <>finished minting a {object} </>;
    case NOTIFICATION_TYPES.PAYMENT_RECEIVED:
      return <>you just received a payment!</>;
    default:
      Sentry.captureMessage(`unknow notification type: ${notification?.type}, ${objectType}`);
      return <>unknown notification type</>;
  }
}
