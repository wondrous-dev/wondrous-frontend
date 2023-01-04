import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import debounce from 'lodash/debounce';

import { useMe } from 'components/Auth/withAuth';
import { APPROVE_JOIN_POD_REQUEST, REJECT_JOIN_POD_REQUEST } from 'graphql/mutations/pod';
import { GET_POD_BY_ID, GET_POD_MEMBERSHIP_REQUEST, GET_POD_ROLES } from 'graphql/queries';

import { DefaultUserImage, SafeImage } from 'components/Common/Image';
import RolePill from 'components/Common/RolePill';

import palette from 'theme/palette';

import { getRoleColor } from 'components/Settings/Members/MembersTableRow/helpers';

import MembershipRequests from './MembershipRequests';
import ExistingMembers from './ExistingMembers';
import RoleFilterSelection from './RoleFilterSelection';
import FilteredRoles from './FilteredRoles';

import { QUERY_LIMIT, userProfilePictureStyles } from './constants';

import { useGetPodMemberRequests, useGetPodUsers } from './hooks';

import {
  MembersWrapper,
  MembersHeader,
  MembersHeading,
  UserRole,
  FilterMembersContainer,
  FilterMembersInput,
  FilterMembersInputIcon,
} from './styles';

function MemberRequests(props) {
  const { podData = {}, userPermissionsContext } = props;
  const { id: podId } = podData;
  const user = useMe();
  const userRole = userPermissionsContext?.podRoles[podId];

  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: podUserMembershipRequests,
    fetchMore: fetchMorePodMemberRequests,
    hasMore: hasMorePodMemberRequests,
  } = useGetPodMemberRequests(podId);
  const { getPodUsers, data: podUsers, fetchMore: fetchMorePodUsers, hasMore: hasMorePodUsers } = useGetPodUsers(podId);
  const { data: podRoles } = useQuery(GET_POD_ROLES, {
    variables: {
      podId,
    },
  });

  const [approveJoinPodRequest] = useMutation(APPROVE_JOIN_POD_REQUEST);
  const [rejectJoinPodRequest] = useMutation(REJECT_JOIN_POD_REQUEST);
  const refetchQueries = [
    GET_POD_BY_ID,
    {
      query: GET_POD_MEMBERSHIP_REQUEST,
      variables: {
        podId,
        limit: podUserMembershipRequests?.length - 1 ? podUserMembershipRequests?.length - 1 : QUERY_LIMIT,
      },
    },
  ];

  const structuredPodRoles = podRoles?.getPodRoles?.reduce((acc, role) => {
    acc.push({ label: role.name, value: role.id });
    return acc;
  }, []);

  const showPodMembershipRequestsEmptyState = podUserMembershipRequests?.length === 0;

  const approveRequest = (requestId) => {
    approveJoinPodRequest({
      variables: {
        joinPodRequestId: requestId,
      },
      refetchQueries,
    });
  };

  const declineRequest = (requestId) => {
    rejectJoinPodRequest({
      variables: {
        joinPodRequestId: requestId,
      },
      refetchQueries,
    });
  };

  const handleShowMoreRequests = () => {
    fetchMorePodMemberRequests({
      variables: {
        podId,
        offset: podUserMembershipRequests?.length,
      },
    });
  };

  const handleShowMorePodUsers = () => {
    fetchMorePodUsers({
      variables: {
        podId,
        offset: podUsers?.length,
      },
    });
  };

  const handleSearchPodMembershipRequests = useCallback(
    debounce(async (searchQuery = '', selectedRoleIds = []) => {}, 500),
    []
  );

  const handleSearchPodMembers = useCallback(
    debounce(async (searchQuery = '', selectedRoleIds = []) => {
      if (!podId) {
        return;
      }

      getPodUsers({
        variables: {
          podId,
          searchString: searchQuery,
          roleIds: selectedRoleIds,
          limit: QUERY_LIMIT,
        },
      });
    }, 500),
    [podId, QUERY_LIMIT]
  );

  const handleSearchQueryOnChange = useCallback(
    async (e) => {
      const searchQuery = e.target.value;
      setSearchQuery(searchQuery);
      handleSearchPodMembershipRequests(searchQuery, selectedRoleIds);
      handleSearchPodMembers(searchQuery, selectedRoleIds);
    },
    [selectedRoleIds, handleSearchPodMembershipRequests, handleSearchPodMembers]
  );

  const handleRoleFilterChange = useCallback(
    (roleId: string) => {
      const isRoleIdAlreadySelected = selectedRoleIds.includes(roleId);
      const updatedRoleIds = isRoleIdAlreadySelected
        ? selectedRoleIds.filter((id) => id !== roleId)
        : [...selectedRoleIds, roleId];
      setSelectedRoleIds(updatedRoleIds);
      handleSearchPodMembershipRequests(searchQuery, updatedRoleIds);
      handleSearchPodMembers(searchQuery, updatedRoleIds);
    },
    [selectedRoleIds, searchQuery, handleSearchPodMembershipRequests, handleSearchPodMembers]
  );

  return (
    <MembersWrapper>
      <MembersHeader>
        <MembersHeading>Members</MembersHeading>

        <UserRole borderColor={getRoleColor(userRole)}>
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
          <FilteredRoles roles={podRoles?.getPodRoles} selectedRoleIds={selectedRoleIds} />
        )}
      </MembersHeader>

      <FilterMembersContainer>
        <FilterMembersInput value={searchQuery} onChange={handleSearchQueryOnChange} placeholder="Search members..." />
        <FilterMembersInputIcon />
        <RoleFilterSelection
          roles={structuredPodRoles}
          selectedRoleIds={selectedRoleIds}
          handleRoleFilterChange={handleRoleFilterChange}
        />
      </FilterMembersContainer>

      {!showPodMembershipRequestsEmptyState && (
        <MembershipRequests
          podUserMembershipRequests={podUserMembershipRequests}
          hasMore={hasMorePodMemberRequests}
          handleShowMoreRequests={handleShowMoreRequests}
          approveRequest={approveRequest}
          declineRequest={declineRequest}
        />
      )}

      <ExistingMembers podUsers={podUsers} hasMore={hasMorePodUsers} handleShowMorePodUsers={handleShowMorePodUsers} />
    </MembersWrapper>
  );
}

export default MemberRequests;
