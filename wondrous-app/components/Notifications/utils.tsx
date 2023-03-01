import React from 'react';
import * as Sentry from '@sentry/nextjs';
import { COLLAB_TYPES, NOTIFICATION_OBJ_TYPES, NOTIFICATION_TYPES } from 'utils/constants';
import { NoUnderlineLink } from 'components/Common/Link/links';
import { NotificationsLink } from './styles';

const NOTIFICATION_OBJ_TYPE_TO_DISPLAY = {
  [NOTIFICATION_OBJ_TYPES.TASK]: 'task',
  [NOTIFICATION_OBJ_TYPES.TASK_COMMENT]: 'task',
  [NOTIFICATION_OBJ_TYPES.TASK_PROPOSAL]: 'task proposal',
  [NOTIFICATION_OBJ_TYPES.TASK_PROPOSAL_COMMENT]: 'task proposal',
  [NOTIFICATION_OBJ_TYPES.TASK_SUBMISSION]: 'submission',
  [NOTIFICATION_OBJ_TYPES.TASK_SUBMISSION_COMMENT]: 'submission',
  [NOTIFICATION_OBJ_TYPES.POST]: 'post',
  [NOTIFICATION_OBJ_TYPES.COLLABORATION]: 'collaboration',
  [NOTIFICATION_OBJ_TYPES.MILESTONE]: 'milestone',
  [NOTIFICATION_OBJ_TYPES.MILESTONE_COMMENT]: 'milestone',
};

const NOTIFICATION_OBJ_TYPE_TO_LINK = {
  [NOTIFICATION_OBJ_TYPES.TASK]: 'task',
  [NOTIFICATION_OBJ_TYPES.TASK_COMMENT]: 'taskComment',
  [NOTIFICATION_OBJ_TYPES.TASK_PROPOSAL]: 'proposal',
  [NOTIFICATION_OBJ_TYPES.TASK_PROPOSAL_COMMENT]: 'taskProposalComment',
  [NOTIFICATION_OBJ_TYPES.TASK_SUBMISSION]: 'submission',
  [NOTIFICATION_OBJ_TYPES.TASK_SUBMISSION_COMMENT]: 'submissionComment',
  [NOTIFICATION_OBJ_TYPES.POST]: 'post',
  [NOTIFICATION_OBJ_TYPES.COLLABORATION]: 'collaboration',
  [NOTIFICATION_OBJ_TYPES.GRANT_APPLICATION]: 'grantApplication',
  [NOTIFICATION_OBJ_TYPES.MILESTONE]: 'milestone',
  [NOTIFICATION_OBJ_TYPES.MILESTONE_COMMENT]: 'milestoneComment',
};

export function getNotificationDescription(notification, link) {
  const objectType = NOTIFICATION_OBJ_TYPE_TO_DISPLAY[notification.objectType];
  const object = (
    <span>
      <NotificationsLink styled={{ display: 'block' }}>
        <NoUnderlineLink href={link}>{objectType}</NoUnderlineLink>
      </NotificationsLink>
    </span>
  );
  console.log('notification?.type', notification?.type);
  /// these languages are wrong potentailly need to consider the actor
  switch (notification?.type) {
    case NOTIFICATION_TYPES.MENTION:
      return <>mentioned you in a {object}</>;
    case NOTIFICATION_TYPES.COMMENT:
      return <>commented on {object}</>;
    // ====
    case NOTIFICATION_TYPES.TASK_ASSIGN:
      return <>assigned a {object} to you</>;
    case NOTIFICATION_TYPES.CREATOR_TASK_ASSIGN:
      return <>Your {object} was assigned</>;
    // ====
    case NOTIFICATION_TYPES.PROPOSAL_APPROVE:
      return <>Your {object} was approved</>;
    case NOTIFICATION_TYPES.PROPOSAL_REJECT:
      return <>Your {object} was rejected</>;
    // ====
    case NOTIFICATION_TYPES.SUBMISSION_CREATE:
      return (
        <>
          made a {object} on {notification.additionalData?.taskType}{' '}
        </>
      );
    case NOTIFICATION_TYPES.SUBMISSION_APPROVE:
      return <>approved your {object}</>;
    case NOTIFICATION_TYPES.SUBMISSION_REJECT:
      return <>rejected your {object}</>;
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
      return <>You just received a payment!</>;
    case NOTIFICATION_TYPES.GRANT_APPLICATION_APPROVED:
      return <>Your grant application has been approved!</>;
    default:
      Sentry.captureMessage(`unknow notification type: ${notification?.type}, ${objectType}`);
      return <>unknown notification type</>;
  }
}

export const getNotificationLink = (notification) => {
  let notificationLink = `/${NOTIFICATION_OBJ_TYPE_TO_LINK[notification.objectType]}/${notification.objectId}`;
  if (notification.objectType === NOTIFICATION_OBJ_TYPES.POD) {
    notificationLink = `/pod/${notification.objectId}/home`;
  }
  if (notification.objectType === NOTIFICATION_OBJ_TYPES.COLLABORATION) {
    const mainPath = notification.type === COLLAB_TYPES.APPROVE ? 'collaboration' : 'organization';
    notificationLink =
      notification.type === COLLAB_TYPES.APPROVE
        ? `/${mainPath}/${notification.additionalData.orgUsername}/home`
        : `/${mainPath}/${notification.additionalData.orgUsername}/collaborations?invite=true`;
  }
  if (notification?.additionalData?.viewNft) {
    notificationLink += `/nft`;
  }

  return notificationLink;
};
