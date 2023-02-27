import TaskViewModalWatcher from 'components/Common/TaskViewModal/TaskViewModalWatcher';
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';
import { useLazyQuery, useQuery } from '@apollo/client';
import { PERMISSIONS, PRIVACY_LEVEL, ENTITIES_DISPLAY_LABEL_MAP, AVATAR_LIST_OVERFLOW_MAX } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { usePodBoard } from 'utils/hooks';
import { GET_USER_JOIN_POD_REQUEST, GET_ORG_BY_ID, GET_TASKS_PER_TYPE_FOR_POD, GET_POD_USERS } from 'graphql/queries';
import MembershipRequestModal from 'components/RoleModal/MembershipRequestModal';
import PodCurrentRoleModal from 'components/RoleModal/PodCurrentRoleModal';
import BoardsActivity from 'components/Common/BoardsActivity';
import ChooseEntityToCreate from 'components/CreateEntity';
import RolePill from 'components/Common/RolePill';
import MoreInfoModal from 'components/Common/MoreInfoModal';
import HeaderAvatars from 'components/Common/HeaderAvatars';
import { Button as PrimaryButton } from 'components/Button';
import { useMe } from '../../Auth/withAuth';
import {
  ContentContainer,
  Container,
  RolePodMemberContainer,
  HeaderTitle,
  RoleButtonWrapper,
  TokenHeader,
  BoardsSubheaderWrapper,
  PrivacyContainer,
  PrivacyText,
} from '../../organization/wrapper/styles';
import PodInviteLinkModal from '../../Common/InviteLinkModal/PodInviteLink';

function BoardPageHeader(props) {
  const { children, onSearch, filterSchema, onFilterChange, statuses, userId, headerTitle = null } = props;

  const router = useRouter();
  const { entity, cause } = router.query;
  const loggedInUser = useMe();
  const [showUsers, setShowUsers] = useState(false);
  const [podRoleName, setPodRoleName] = useState(null);
  const [showPods, setShowPods] = useState(false);
  const [moreInfoModalOpen, setMoreInfoModalOpen] = useState(false);
  const [getExistingJoinRequest, { data: getUserJoinRequestData }] = useLazyQuery(GET_USER_JOIN_POD_REQUEST, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });
  const [getPerTypeTaskCountForPodBoard, { data: tasksPerTypeData }] = useLazyQuery(GET_TASKS_PER_TYPE_FOR_POD);
  const [openJoinRequestModal, setOpenJoinRequestModal] = useState(false);
  const [openCurrentRoleModal, setOpenCurrentRoleModal] = useState(false);
  const [claimedOrRequestedRole, setClaimedOrRequestedRole] = useState(null);
  const userJoinRequest = getUserJoinRequestData?.getUserJoinPodRequest;
  const podBoard = usePodBoard();

  const [getOrg, { loading: isOrgLoading, data: orgData }] = useLazyQuery(GET_ORG_BY_ID, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (podBoard?.orgId) {
      getOrg({
        variables: {
          orgId: podBoard?.orgId,
        },
      });
    }
  }, [podBoard?.orgId]);

  const ORG_PERMISSIONS = {
    MANAGE_SETTINGS: 'manageSettings',
    CONTRIBUTOR: 'contributor',
  };
  const userPermissionsContext = podBoard?.userPermissionsContext;
  const [permissions, setPermissions] = useState(undefined);
  const [openInvite, setOpenInvite] = useState(false);
  const podProfile = podBoard?.pod;

  useEffect(() => {
    const podPermissions = parseUserPermissionContext({
      userPermissionsContext,
      podId: podBoard?.podId,
      orgId: podBoard?.orgId,
    });
    const role = userPermissionsContext?.podRoles[podBoard?.podId];
    setPodRoleName(role);

    if (
      podPermissions?.includes(PERMISSIONS.MANAGE_MEMBER) ||
      podPermissions?.includes(PERMISSIONS.FULL_ACCESS) ||
      podPermissions?.includes(PERMISSIONS.APPROVE_PAYMENT)
    ) {
      setPermissions(ORG_PERMISSIONS.MANAGE_SETTINGS);
    } else if (
      userPermissionsContext &&
      podProfile?.id in userPermissionsContext?.podPermissions &&
      podPermissions &&
      podPermissions
    ) {
      // Normal contributor with no access to admin settings
      setPermissions(ORG_PERMISSIONS.CONTRIBUTOR);
    } else if (
      podBoard?.podId &&
      userPermissionsContext &&
      !(podProfile?.id in userPermissionsContext?.podPermissions)
    ) {
      setPermissions(null);
      getExistingJoinRequest({
        variables: {
          podId: podBoard?.podId,
        },
      });
    }
  }, [podBoard?.orgId, userPermissionsContext]);

  useEffect(() => {
    if (podBoard?.podId) {
      getPerTypeTaskCountForPodBoard({
        variables: {
          podId: podBoard.podId,
        },
      });
    }
  }, [podBoard?.podId]);

  const { data: podUsersData } = useQuery(GET_POD_USERS, {
    skip: !podBoard?.podId,
    variables: {
      searchString: '',
      podId: podBoard?.podId,
      limit: AVATAR_LIST_OVERFLOW_MAX,
    },
  });

  return (
    <>
      <TaskViewModalWatcher />
      <PodInviteLinkModal podId={podBoard?.podId} open={openInvite} onClose={() => setOpenInvite(false)} />
      {openJoinRequestModal && (
        <MembershipRequestModal
          podId={podBoard?.podId}
          open={openJoinRequestModal}
          onClose={() => setOpenJoinRequestModal(false)}
          setOpenCurrentRoleModal={setOpenCurrentRoleModal}
          requestingRole={claimedOrRequestedRole}
        />
      )}
      {openCurrentRoleModal && (
        <PodCurrentRoleModal
          podId={podBoard?.podId}
          open={openCurrentRoleModal}
          onClose={() => setOpenCurrentRoleModal(false)}
          linkedWallet={loggedInUser?.activeEthAddress}
          currentRoleName={podRoleName}
          setOpenJoinRequestModal={setOpenJoinRequestModal}
          setClaimedOrRequestedRole={setClaimedOrRequestedRole}
        />
      )}
      {moreInfoModalOpen && (
        <MoreInfoModal
          open={moreInfoModalOpen && (showUsers || showPods)}
          handleClose={() => {
            document.body.setAttribute('style', '');
            setMoreInfoModalOpen(false);
          }}
          showUsers={showUsers}
          showPods={showPods}
          name={podProfile?.name}
          podId={podProfile?.id}
        />
      )}
      <ChooseEntityToCreate />
      <ContentContainer>
        <TokenHeader>
          <Grid container width="fit-content" alignItems="center" gap="8px" marginBottom="18px">
            <HeaderTitle>{ENTITIES_DISPLAY_LABEL_MAP[entity?.toString()] || headerTitle}</HeaderTitle>
            <PrivacyContainer>
              <PrivacyText>{orgData?.privacyLevel !== PRIVACY_LEVEL.public ? 'Private' : 'Public'}</PrivacyText>
            </PrivacyContainer>
          </Grid>
        </TokenHeader>

        <BoardsSubheaderWrapper>
          <RolePodMemberContainer>
            {permissions && podRoleName && (
              <RoleButtonWrapper>
                <RolePill
                  onClick={() => {
                    setOpenCurrentRoleModal(true);
                  }}
                  roleName={podRoleName}
                />
              </RoleButtonWrapper>
            )}
            {permissions === null && (
              <>
                {userJoinRequest?.id ? (
                  <PrimaryButton
                    height={36}
                    width="max-content"
                    variant="outlined"
                    color="purple"
                    succeeded
                    paddingX={15}
                    buttonTheme={{ fontWeight: '500', fontSize: '14px' }}
                  >
                    Request sent
                  </PrimaryButton>
                ) : (
                  <PrimaryButton
                    height={36}
                    paddingX={15}
                    width="max-content"
                    buttonTheme={{ fontWeight: '500', fontSize: '14px' }}
                    onClick={() => {
                      setOpenCurrentRoleModal(true);
                    }}
                  >
                    Join pod
                  </PrimaryButton>
                )}
              </>
            )}
            {podUsersData?.getPodUsers && (
              <HeaderAvatars
                users={podUsersData?.getPodUsers}
                contributorCount={podProfile?.contributorCount}
                setMoreInfoModalOpen={setMoreInfoModalOpen}
                setShowUsers={setShowUsers}
              />
            )}
          </RolePodMemberContainer>

          {!!filterSchema && (
            <BoardsActivity
              onSearch={onSearch}
              filterSchema={filterSchema}
              onFilterChange={onFilterChange}
              statuses={statuses}
              userId={userId}
            />
          )}
        </BoardsSubheaderWrapper>
        <Container>{children}</Container>
      </ContentContainer>
    </>
  );
}

export default BoardPageHeader;
