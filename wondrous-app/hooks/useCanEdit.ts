import { PERMISSIONS } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useBoards, useCreateEntityContext } from 'utils/hooks';

const useCanEdit = () => {
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

export default useCanEdit;
