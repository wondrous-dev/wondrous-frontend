import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import debounce from 'lodash/debounce';

import { useMe } from 'components/Auth/withAuth';
import { APPROVE_JOIN_POD_REQUEST, REJECT_JOIN_POD_REQUEST } from 'graphql/mutations/pod';
import { APPROVE_JOIN_ORG_REQUEST, REJECT_JOIN_ORG_REQUEST } from 'graphql/mutations/org';
import {
  GET_ORG_MEMBERSHIP_REQUEST,
  GET_ORG_ROLES,
  GET_ORG_USERS,
  GET_POD_MEMBERSHIP_REQUEST,
  GET_POD_ROLES,
  GET_POD_USERS,
} from 'graphql/queries';

import { DefaultUserImage, SafeImage } from 'components/Common/Image';
import RolePill from 'components/Common/RolePill';

import palette from 'theme/palette';

import { getRoleColor } from 'components/Settings/Members/MembersTableRow/helpers';
import { useOrgBoard, usePodBoard } from 'utils/hooks';

import MembershipRequests from './MembershipRequests';
import ExistingMembers from './ExistingMembers';
import RoleFilterSelection from './RoleFilterSelection';
import FilteredRoles from './FilteredRoles';

import { QUERY_LIMIT, userProfilePictureStyles } from './constants';

import { useGetOrgMemberRequests, useGetOrgUsers, useGetPodMemberRequests, useGetPodUsers } from './hooks';

import {
  MembersWrapper,
  MembersHeader,
  MembersHeading,
  UserRole,
  FilterMembersContainer,
  FilterMembersInput,
  FilterMembersInputIcon,
} from './styles';

const Members = (props) => {
  const user = useMe();
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();

  const board = orgBoard || podBoard;
  const orgData = orgBoard?.orgData;
  const podData = podBoard?.pod;
  const orgId = orgBoard?.orgId;
  const podId = podBoard?.podId;
  const isOrg = !!orgId;

  const userRole = useMemo(() => {
    if (isOrg) {
      return board?.userPermissionsContext?.orgRoles[orgData?.id];
    }
    return board?.userPermissionsContext?.podRoles[podData?.id];
  }, [isOrg, board, orgData?.id, podData?.id]);

  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Get membership requests for org or pod depending on what's being viewed
  const {
    getOrgUserMembershipRequests,
    data: orgUserMembershipRequests,
    fetchMore: fetchMoreOrgMemberRequests,
    hasMore: hasMoreOrgMemberRequests,
  } = useGetOrgMemberRequests(orgId);

  const {
    getPodUserMembershipRequests,
    data: podUserMembershipRequests,
    fetchMore: fetchMorePodMemberRequests,
    hasMore: hasMorePodMemberRequests,
  } = useGetPodMemberRequests(podId);

  // Get users for org or pod depending on what's being viewed
  const { getOrgUsers, data: orgUsers, fetchMore: fetchMoreOrgUsers, hasMore: hasMoreOrgUsers } = useGetOrgUsers(orgId);
  const { getPodUsers, data: podUsers, fetchMore: fetchMorePodUsers, hasMore: hasMorePodUsers } = useGetPodUsers(podId);

  // Get roles for org or pod depending on what's being viewed
  const { data: orgRoles } = useQuery(GET_ORG_ROLES, {
    skip: !orgId,
    variables: {
      orgId,
    },
  });

  const { data: podRoles } = useQuery(GET_POD_ROLES, {
    skip: !podId,
    variables: {
      podId,
    },
  });

  // Approve membership request mutation
  const [approveJoinPodRequest] = useMutation(APPROVE_JOIN_POD_REQUEST);
  const [approveJoinOrgRequest] = useMutation(APPROVE_JOIN_ORG_REQUEST);

  // Reject membership request mutation
  const [rejectJoinPodRequest] = useMutation(REJECT_JOIN_POD_REQUEST);
  const [rejectJoinOrgRequest] = useMutation(REJECT_JOIN_ORG_REQUEST);

  // Refetch queries
  const refetchQueries = isOrg
    ? [
        {
          query: GET_ORG_MEMBERSHIP_REQUEST,
          variables: {
            orgId,
            limit: orgUserMembershipRequests?.length >= QUERY_LIMIT ? orgUserMembershipRequests.length : QUERY_LIMIT,
            offset: 0,
            searchString: searchQuery,
            roleIds: selectedRoleIds,
          },
        },
        {
          query: GET_ORG_USERS,
          variables: {
            orgId,
            limit: orgUsers?.length >= QUERY_LIMIT ? orgUsers.length : QUERY_LIMIT,
            offset: 0,
            searchString: searchQuery,
            roleIds: selectedRoleIds,
          },
        },
      ]
    : [
        {
          query: GET_POD_MEMBERSHIP_REQUEST,
          variables: {
            orgId,
            limit: podUserMembershipRequests?.length >= QUERY_LIMIT ? podUserMembershipRequests.length : QUERY_LIMIT,
            offset: 0,
            searchString: searchQuery,
            roleIds: selectedRoleIds,
          },
        },
        {
          query: GET_POD_USERS,
          variables: {
            orgId,
            limit: podUsers?.length >= QUERY_LIMIT ? podUsers.length : QUERY_LIMIT,
            offset: 0,
            searchString: searchQuery,
            roleIds: selectedRoleIds,
          },
        },
      ];

  const structuredRoles = useMemo(() => {
    let roles;

    if (isOrg) {
      roles = orgRoles?.getOrgRoles;
    } else {
      roles = podRoles?.getPodRoles;
    }

    return roles?.reduce((acc, role) => {
      acc.push({ label: role.name, value: role.id });
      return acc;
    }, []);
  }, [isOrg, orgRoles, podRoles]);

  const showMembershipRequestsEmptyState = isOrg
    ? orgUserMembershipRequests?.length === 0
    : podUserMembershipRequests?.length === 0;

  const userRoleColor = useMemo(() => getRoleColor(userRole), [userRole]);

  // Approve membership request for org or pod
  const handleApproveMembershipRequest = useCallback(
    (requestId) => {
      if (isOrg) {
        approveJoinOrgRequest({
          variables: {
            joinOrgRequestId: requestId,
          },
          refetchQueries,
        });
      } else {
        approveJoinPodRequest({
          variables: {
            joinPodRequestId: requestId,
          },
          refetchQueries,
        });
      }
    },
    [isOrg, refetchQueries]
  );

  // Decline membership request for org or pod
  const handleDeclineMembershipRequest = useCallback(
    (requestId) => {
      if (isOrg) {
        rejectJoinOrgRequest({
          variables: {
            joinOrgRequestId: requestId,
          },
          refetchQueries,
        });
      } else {
        rejectJoinPodRequest({
          variables: {
            joinPodRequestId: requestId,
          },
          refetchQueries,
        });
      }
    },
    [isOrg, refetchQueries]
  );

  // Load more membership requests for org or pod
  const handleShowMoreMembershipRequests = useCallback(() => {
    if (orgId) {
      fetchMoreOrgMemberRequests({
        variables: {
          orgId,
          offset: orgUserMembershipRequests?.length,
        },
      });
    } else {
      fetchMorePodMemberRequests({
        variables: {
          podId,
          offset: podUserMembershipRequests?.length,
        },
      });
    }
  }, [
    orgId,
    podId,
    fetchMoreOrgMemberRequests,
    fetchMorePodMemberRequests,
    podUserMembershipRequests?.length,
    orgUserMembershipRequests?.length,
  ]);

  // Load more users for org or pod
  const handleShowMoreUsers = useCallback(() => {
    if (orgId) {
      fetchMoreOrgUsers({
        variables: {
          orgId,
          offset: orgUsers?.length,
        },
      });
    } else {
      fetchMorePodUsers({
        variables: {
          podId,
          offset: podUsers?.length,
        },
      });
    }
  }, [orgId, podId, fetchMoreOrgUsers, fetchMorePodUsers, orgUsers?.length, podUsers?.length]);

  // Search membership requests for org or pod
  const handleSearchMembershipRequests = useCallback(
    debounce(async (searchQuery = '', selectedRoleIds = []) => {
      if (orgId) {
        getOrgUserMembershipRequests({
          variables: {
            orgId,
            searchString: searchQuery,
            roleIds: selectedRoleIds,
            limit: QUERY_LIMIT,
          },
        });
      } else {
        getPodUserMembershipRequests({
          variables: {
            podId,
            searchString: searchQuery,
            roleIds: selectedRoleIds,
            limit: QUERY_LIMIT,
          },
        });
      }
    }, 500),
    [orgId, podId, QUERY_LIMIT, getOrgUserMembershipRequests, getPodUserMembershipRequests]
  );

  // Search users for org or pod
  const handleSearchExistingMembers = useCallback(
    debounce(async (searchQuery = '', selectedRoleIds = []) => {
      if (orgId) {
        getOrgUsers({
          variables: {
            orgId,
            searchString: searchQuery,
            roleIds: selectedRoleIds,
            limit: QUERY_LIMIT,
          },
        });
      } else {
        getPodUsers({
          variables: {
            podId,
            searchString: searchQuery,
            roleIds: selectedRoleIds,
            limit: QUERY_LIMIT,
          },
        });
      }
    }, 500),
    [orgId, podId, QUERY_LIMIT, getOrgUsers, getPodUsers]
  );

  // Handle search query onChange
  const handleSearchQueryOnChange = useCallback(
    async (e: ChangeEvent) => {
      const searchQuery = (e.target as HTMLInputElement).value;
      setSearchQuery(searchQuery);
      handleSearchMembershipRequests(searchQuery, selectedRoleIds);
      handleSearchExistingMembers(searchQuery, selectedRoleIds);
    },
    [selectedRoleIds, handleSearchMembershipRequests, handleSearchExistingMembers]
  );

  // Handle role filter onChange
  const handleRoleFilterChange = useCallback(
    (roleId: string) => {
      const isRoleIdAlreadySelected = selectedRoleIds.includes(roleId);
      const updatedRoleIds = isRoleIdAlreadySelected
        ? selectedRoleIds.filter((id) => id !== roleId)
        : [...selectedRoleIds, roleId];
      setSelectedRoleIds(updatedRoleIds);
      handleSearchMembershipRequests(searchQuery, updatedRoleIds);
      handleSearchExistingMembers(searchQuery, updatedRoleIds);
    },
    [selectedRoleIds, searchQuery, handleSearchMembershipRequests, handleSearchExistingMembers]
  );

  return (
    <MembersWrapper>
      <MembersHeader>
        <MembersHeading>Members</MembersHeading>

        <UserRole borderColor={userRoleColor}>
          <SafeImage
            src={user?.thumbnailPicture || user?.profilePicture}
            placeholderComp={<DefaultUserImage style={userProfilePictureStyles} />}
            width={28}
            height={28}
            useNextImage
            style={userProfilePictureStyles}
            alt="User profile picture"
          />

          <RolePill roleName={userRole} borderColor="transparent" backgroundColor={palette.grey85} />
        </UserRole>

        {selectedRoleIds?.length > 0 && (
          <FilteredRoles
            roles={isOrg ? orgRoles?.getOrgRoles : podRoles?.getPodRoles}
            selectedRoleIds={selectedRoleIds}
          />
        )}
      </MembersHeader>

      <FilterMembersContainer>
        <FilterMembersInput value={searchQuery} onChange={handleSearchQueryOnChange} placeholder="Search members..." />
        <FilterMembersInputIcon />
        <RoleFilterSelection
          roles={structuredRoles}
          selectedRoleIds={selectedRoleIds}
          handleRoleFilterChange={handleRoleFilterChange}
        />
      </FilterMembersContainer>

      {!showMembershipRequestsEmptyState && (
        <MembershipRequests
          userMembershipRequests={isOrg ? orgUserMembershipRequests : podUserMembershipRequests}
          membershipRequestsCount={isOrg ? orgData?.membershipRequestsCount : podData?.membershipRequestsCount}
          hasMore={isOrg ? hasMoreOrgMemberRequests : hasMorePodMemberRequests}
          handleShowMoreRequests={handleShowMoreMembershipRequests}
          approveRequest={handleApproveMembershipRequest}
          declineRequest={handleDeclineMembershipRequest}
        />
      )}

      <ExistingMembers
        existingUsers={isOrg ? orgUsers : podUsers}
        hasMore={isOrg ? hasMoreOrgUsers : hasMorePodUsers}
        handleShowMoreUsers={handleShowMoreUsers}
        contributorsCount={isOrg ? orgData?.contributorCount : podData?.contributorCount}
      />
    </MembersWrapper>
  );
};

export default Members;
