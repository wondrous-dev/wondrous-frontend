import { useState } from 'react';
import { PERMISSIONS, PRIVACY_LEVEL } from 'utils/constants';

export const canViewGrant = (grant, userPermissionsContext, permissions) => {
  // if a pod exists we should check it's permissions else fallback to org permissions
  const hasPermissionToPod = grant?.podId
    ? userPermissionsContext?.podPermissions[grant?.podId] ||
      permissions?.includes(PERMISSIONS.FULL_ACCESS) ||
      grant?.pod?.privacyLevel === PRIVACY_LEVEL.public
    : true;

  const hasPermissionToViewGrant =
    grant?.privacyLevel === PRIVACY_LEVEL.public ||
    permissions?.includes(PERMISSIONS.FULL_ACCESS) ||
    (userPermissionsContext?.orgPermissions[grant?.orgId] && hasPermissionToPod);

  return hasPermissionToViewGrant;
};
