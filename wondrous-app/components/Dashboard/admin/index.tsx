import BoardWrapper from '../boards/BoardWrapper';
import {
  MEMBERSHIP_REQUESTS,
  PERMISSIONS,
  TASK_STATUS_PROPOSAL_REQUEST,
  TASK_STATUS_SUBMISSION_REQUEST,
} from 'utils/constants';
import {
  useGetMembershipRequests,
  useGetSubmissionsUserCanReview,
  useGetProposalsUserCanReview,
} from 'hooks/useAdminColumns';
import ListViewAdmin from 'components/ListViewAdmin';
import { useMe } from 'components/Auth/withAuth';
import { useCreateEntityContext } from 'utils/hooks';
import { generateAdminDashboardFilters } from 'services/board';
import { parseUserPermissionContext } from 'utils/helpers';

const PAGE_TYPE_TO_HOOK_MAP = {
  [MEMBERSHIP_REQUESTS]: useGetMembershipRequests,
  [TASK_STATUS_PROPOSAL_REQUEST]: useGetProposalsUserCanReview,
  [TASK_STATUS_SUBMISSION_REQUEST]: useGetSubmissionsUserCanReview,
};

const AdminBoard = ({ type }) => {
  const loggedInUser = useMe();
  const createEntityContext = useCreateEntityContext();
  const { userOrgs, userPermissionsContext } = createEntityContext;

  const permissionContext = userPermissionsContext?.getUserPermissionContext
    ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
    : null;
  const orgsWithAdminPermissions = userOrgs?.getUserOrgs.filter((org) => {
    const permissions = parseUserPermissionContext({ userPermissionsContext: permissionContext, orgId: org?.id });
    const hasPermission =
      permissions.includes(PERMISSIONS.FULL_ACCESS) ||
      permissions.includes(PERMISSIONS.CREATE_TASK) ||
      permissions.includes(PERMISSIONS.MANAGE_MEMBER);
    return hasPermission;
  });

  const adminFilters = generateAdminDashboardFilters({
    userId: loggedInUser?.id,
    orgs: orgsWithAdminPermissions,
    permissionContext,
  });

  const useGetColumnData = PAGE_TYPE_TO_HOOK_MAP[type];
  const { items, onFilterChange, hasMore, loading, handleFetchMore } = useGetColumnData({
    filters: {},
  });

  const column = {
    type,
    items,
    hasMore,
    loading,
    handleFetchMore,
  };

  return (
    <BoardWrapper
      isAdmin
      onSearch={() => {}}
      filterSchema={adminFilters}
      onFilterChange={onFilterChange}
      statuses={[]}
      podIds={[]}
    >
      <ListViewAdmin column={column} />
    </BoardWrapper>
  );
};

export default AdminBoard;
