import { useLazyQuery } from '@apollo/client';
import dynamic from 'next/dynamic';
import { useMe, withAuth } from 'components/Auth/withAuth';
import { HeaderButton } from 'components/organization/wrapper/styles';
import PodCurrentRoleModal from 'components/RoleModal/PodCurrentRoleModal';
import { GET_USER_JOIN_ORG_REQUEST, GET_USER_JOIN_POD_REQUEST } from 'graphql/queries';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { PERMISSIONS } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useOrgBoard, usePodBoard } from 'utils/hooks';

const MembershipRequestModal = dynamic(() => import('components/RoleModal/MembershipRequestModal'), { suspense: true });
const CurrentRoleModal = dynamic(() => import('components/RoleModal/CurrentRoleModal'), { suspense: true });

const ORG_PERMISSIONS = {
  MANAGE_SETTINGS: 'manageSettings',
  CONTRIBUTOR: 'contributor',
};

// TODO: Replace org/wrapper's join org and pod/wrapper's join pod with this component

const JoinWorkspace = () => {
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const [getOrgExistingJoinRequest, { data: getOrgUserJoinRequestData }] = useLazyQuery(GET_USER_JOIN_ORG_REQUEST, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });
  const [getPodExistingJoinRequest, { data: getPodUserJoinRequestData }] = useLazyQuery(GET_USER_JOIN_POD_REQUEST, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const [openJoinRequestModal, setOpenJoinRequestModal] = useState(false);
  const [openCurrentRoleModal, setOpenCurrentRoleModal] = useState(false);
  const [claimedOrRequestedRole, setClaimedOrRequestedRole] = useState(null);
  const userPermissionsContext = orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext;

  const loggedInUser = useMe();
  const userJoinRequest =
    getOrgUserJoinRequestData?.getUserJoinOrgRequest || getPodUserJoinRequestData?.getUserJoinPodRequest;
  const workspacePermissions = parseUserPermissionContext({
    userPermissionsContext,
    podId: podBoard?.podId,
    orgId: podBoard?.orgId,
  });

  const permissions = useMemo(() => {
    if (
      workspacePermissions?.includes(PERMISSIONS.MANAGE_MEMBER) ||
      workspacePermissions?.includes(PERMISSIONS.FULL_ACCESS) ||
      workspacePermissions?.includes(PERMISSIONS.APPROVE_PAYMENT)
    ) {
      return ORG_PERMISSIONS.MANAGE_SETTINGS;
    }
    if (
      userPermissionsContext &&
      (podBoard?.pod?.id in userPermissionsContext?.podPermissions ||
        orgBoard?.orgId in userPermissionsContext.orgPermissions) &&
      workspacePermissions
    ) {
      // Normal contributor with no access to admin settings
      return ORG_PERMISSIONS.CONTRIBUTOR;
    }

    if (
      (podBoard?.pod?.id || orgBoard?.orgId) &&
      userPermissionsContext &&
      !(
        podBoard?.pod?.id in userPermissionsContext?.podPermissions ||
        orgBoard?.orgId in userPermissionsContext.orgPermissions
      )
    ) {
      return null;
    }
  }, [podBoard, orgBoard, userPermissionsContext, workspacePermissions]);

  const role = podBoard
    ? userPermissionsContext?.podRoles[podBoard?.podId]
    : userPermissionsContext?.orgRoles[orgBoard?.orgId];

  useEffect(() => {
    if (permissions === null) {
      if (orgBoard?.orgId) {
        getOrgExistingJoinRequest({
          variables: {
            orgId: orgBoard?.orgId,
          },
        });
      } else if (podBoard?.podId) {
        getPodExistingJoinRequest({
          variables: {
            podId: podBoard?.podId,
          },
        });
      }
    }
  }, [permissions, orgBoard?.orgId, podBoard?.podId]);

  return (
    <>
      {openCurrentRoleModal && orgBoard && (
        <Suspense>
          <CurrentRoleModal
            orgId={orgBoard?.orgId}
            open={openCurrentRoleModal}
            onClose={() => setOpenCurrentRoleModal(false)}
            linkedWallet={loggedInUser?.activeEthAddress}
            currentRoleName={role}
            setOpenJoinRequestModal={setOpenJoinRequestModal}
            setClaimedOrRequestedRole={setClaimedOrRequestedRole}
          />
        </Suspense>
      )}
      {openCurrentRoleModal && podBoard && (
        <PodCurrentRoleModal
          podId={podBoard?.podId}
          open={openCurrentRoleModal}
          onClose={() => setOpenCurrentRoleModal(false)}
          linkedWallet={loggedInUser?.activeEthAddress}
          currentRoleName={role}
          setOpenJoinRequestModal={setOpenJoinRequestModal}
          setClaimedOrRequestedRole={setClaimedOrRequestedRole}
        />
      )}

      {openJoinRequestModal && (
        <Suspense>
          <MembershipRequestModal
            orgId={orgBoard?.orgId}
            podId={podBoard?.podId}
            open={openJoinRequestModal}
            onClose={() => setOpenJoinRequestModal(false)}
            setOpenCurrentRoleModal={setOpenCurrentRoleModal}
            requestingRole={claimedOrRequestedRole}
          />
        </Suspense>
      )}

      {permissions === null && (
        <>
          {userJoinRequest?.id ? (
            <HeaderButton style={{ pointerEvents: 'none' }}>Request sent</HeaderButton>
          ) : (
            <HeaderButton
              reversed
              onClick={() => {
                setOpenCurrentRoleModal(true);
              }}
            >
              Join {orgBoard ? 'org' : 'pod'}
            </HeaderButton>
          )}
        </>
      )}
    </>
  );
};

export default withAuth(JoinWorkspace);
