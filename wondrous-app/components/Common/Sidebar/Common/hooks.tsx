import { PERMISSIONS } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useBoards } from 'utils/hooks';

export const useCanManage = () => {
  const { board } = useBoards();
  const permissions = parseUserPermissionContext({
    userPermissionsContext: board?.userPermissionsContext,
    orgId: board?.orgId,
    podId: board?.podId,
  });
  const canManage =
    permissions?.includes(PERMISSIONS.MANAGE_MEMBER) ||
    permissions?.includes(PERMISSIONS.FULL_ACCESS) ||
    permissions?.includes(PERMISSIONS.APPROVE_PAYMENT);
  return canManage;
};

export const useCanEdit = () => {
  const { board } = useBoards();
  const permissions = parseUserPermissionContext({
    userPermissionsContext: board?.userPermissionsContext,
    orgId: board?.orgId,
    podId: board?.podId,
  });
  const canEdit = permissions.includes(PERMISSIONS.FULL_ACCESS);
  return canEdit;
};
