import { PERMISSIONS } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useBoards, useCreateEntityContext } from 'utils/hooks';

export const useCanManage = () => {
  const { board } = useBoards();
  const { userPermissionsContext } = useCreateEntityContext();
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
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
  const { userPermissionsContext } = useCreateEntityContext();
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: board?.orgId,
    podId: board?.podId,
  });
  const canEdit = permissions.includes(PERMISSIONS.FULL_ACCESS);
  return canEdit;
};
