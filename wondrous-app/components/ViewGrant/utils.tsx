import { GRANT_APPLICATION_STATUSES, PAYMENT_STATUS, PERMISSIONS, PRIVACY_LEVEL } from 'utils/constants';

export const canViewGrant = (grant, userPermissionsContext, permissions) => {
  // if a pod exists we should check it's permissions else fallback to org permissions
  const hasPermissionToPod = grant?.pod?.id
    ? userPermissionsContext?.podPermissions[grant?.pod?.id] ||
      permissions?.includes(PERMISSIONS.FULL_ACCESS) ||
      grant?.pod?.privacyLevel === PRIVACY_LEVEL.public
    : true;

  const hasPermissionToViewGrant =
    grant?.privacyLevel === PRIVACY_LEVEL.public ||
    permissions?.includes(PERMISSIONS.FULL_ACCESS) ||
    (userPermissionsContext?.orgPermissions[grant?.org?.id] && hasPermissionToPod);

  return hasPermissionToViewGrant;
};

export const selectApplicationStatus = (application) => {
  if (!application?.approvedAt && !application?.changeRequestedAt && !application?.rejectedAt)
    return GRANT_APPLICATION_STATUSES.WAITING_FOR_REVIEW;
  if (application?.changeRequestedAt) return GRANT_APPLICATION_STATUSES.CHANGE_REQUESTED;
  if (application?.rejectedAt) return GRANT_APPLICATION_STATUSES.REJECTED;
  if (application?.approvedAt && application?.paymentStatus === PAYMENT_STATUS.PAID)
    return GRANT_APPLICATION_STATUSES.APPROVED_AND_PAID;
  if (application?.approvedAt && application?.paymentStatus === PAYMENT_STATUS.PROCESSING)
    return GRANT_APPLICATION_STATUSES.APPROVED_AND_PROCESSING;
  if (application?.approvedAt) return GRANT_APPLICATION_STATUSES.APPROVED;
  return GRANT_APPLICATION_STATUSES.OPEN;
};
