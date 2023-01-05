import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import debounce from 'lodash/debounce';

import { useMe } from 'components/Auth/withAuth';
import { APPROVE_JOIN_ORG_REQUEST, REJECT_JOIN_ORG_REQUEST } from 'graphql/mutations/org';
import { GET_ORG_FROM_USERNAME, GET_ORG_MEMBERSHIP_REQUEST, GET_ORG_ROLES } from 'graphql/queries';

import { DefaultUserImage, SafeImage } from 'components/Common/Image';
import RolePill from 'components/Common/RolePill';

import palette from 'theme/palette';

import { getRoleColor } from 'components/Settings/Members/MembersTableRow/helpers';

import MembershipRequests from './MembershipRequests';
import ExistingMembers from './ExistingMembers';
import RoleFilterSelection from './RoleFilterSelection';
import FilteredRoles from './FilteredRoles';

import { QUERY_LIMIT, userProfilePictureStyles } from './constants';

import { useGetOrgMemberRequests, useGetOrgUsers } from './hooks';

import {
  MembersWrapper,
  MembersHeading,
  MembersHeader,
  UserRole,
  FilterMembersContainer,
  FilterMembersInput,
  FilterMembersInputIcon,
} from './styles';

function MemberRequests(props) {
  const { orgData = {}, userPermissionsContext } = props;
  const { id: orgId } = orgData;
  const user = useMe();
  const userRole = userPermissionsContext?.orgRoles[orgId];

  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    getOrgUserMembershipRequests,
    data: orgUserMembershipRequests,
    fetchMore: fetchMoreOrgMemberRequests,
    hasMore: hasMoreOrgMemberRequests,
  } = useGetOrgMemberRequests(orgId);
  const { getOrgUsers, data: orgUsers, fetchMore: fetchMoreOrgUsers, hasMore: hasMoreOrgUsers } = useGetOrgUsers(orgId);
  const { data: orgRoles } = useQuery(GET_ORG_ROLES, {
    variables: {
      orgId,
    },
  });

  const [approveJoinOrgRequest] = useMutation(APPROVE_JOIN_ORG_REQUEST);
  const [rejectJoinOrgRequest] = useMutation(REJECT_JOIN_ORG_REQUEST);
  const refetchQueries = [
    GET_ORG_FROM_USERNAME,
    {
      query: GET_ORG_MEMBERSHIP_REQUEST,
      variables: {
        orgId,
        limit: orgUserMembershipRequests?.length - 1 ? orgUserMembershipRequests.length - 1 : QUERY_LIMIT,
      },
    },
  ];

  const structuredOrgRoles = orgRoles?.getOrgRoles?.reduce((acc, role) => {
    acc.push({ label: role.name, value: role.id });
    return acc;
  }, []);

  const showOrgMembershipRequestsEmptyState = orgUserMembershipRequests?.length === 0;

  const approveRequest = (id) => {
    approveJoinOrgRequest({
      variables: {
        joinOrgRequestId: id,
      },
      refetchQueries,
    });
  };

  // REMEMBER COLUMN ENTRY
  const declineRequest = (id) => {
    rejectJoinOrgRequest({
      variables: {
        joinOrgRequestId: id,
      },
      refetchQueries,
    });
  };

  const handleShowMoreRequests = () => {
    fetchMoreOrgMemberRequests({
      variables: {
        orgId,
        offset: orgUserMembershipRequests?.length,
      },
    });
  };

  const handleShowMoreOrgUsers = () => {
    fetchMoreOrgUsers({
      variables: {
        orgId,
        offset: orgUsers?.length,
      },
    });
  };

  const handleSearchOrgMembershipRequests = useCallback(
    debounce(async (searchQuery = '', selectedRoleIds = []) => {
      if (!orgId) {
        return;
      }

      getOrgUserMembershipRequests({
        variables: {
          orgId,
          searchString: searchQuery,
          roleIds: selectedRoleIds,
          limit: QUERY_LIMIT,
        },
      });
    }, 500),
    [orgId, QUERY_LIMIT]
  );

  const handleSearchOrgMembers = useCallback(
    debounce(async (searchQuery = '', selectedRoleIds = []) => {
      if (!orgId) {
        return;
      }

      getOrgUsers({
        variables: {
          orgId,
          searchString: searchQuery,
          roleIds: selectedRoleIds,
          limit: QUERY_LIMIT,
        },
      });
    }, 500),
    [orgId, QUERY_LIMIT]
  );

  const handleSearchQueryOnChange = useCallback(
    async (e) => {
      const searchQuery = e.target.value;
      setSearchQuery(searchQuery);
      handleSearchOrgMembershipRequests(searchQuery, selectedRoleIds);
      handleSearchOrgMembers(searchQuery, selectedRoleIds);
    },
    [selectedRoleIds, handleSearchOrgMembershipRequests, handleSearchOrgMembers]
  );

  const handleRoleFilterChange = useCallback(
    (roleId: string) => {
      const isRoleIdAlreadySelected = selectedRoleIds.includes(roleId);
      const updatedRoleIds = isRoleIdAlreadySelected
        ? selectedRoleIds.filter((id) => id !== roleId)
        : [...selectedRoleIds, roleId];
      setSelectedRoleIds(updatedRoleIds);
      handleSearchOrgMembershipRequests(searchQuery, updatedRoleIds);
      handleSearchOrgMembers(searchQuery, updatedRoleIds);
    },
    [selectedRoleIds, searchQuery, handleSearchOrgMembershipRequests, handleSearchOrgMembers]
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
          <FilteredRoles roles={orgRoles?.getOrgRoles} selectedRoleIds={selectedRoleIds} />
        )}
      </MembersHeader>

      <FilterMembersContainer>
        <FilterMembersInput value={searchQuery} onChange={handleSearchQueryOnChange} placeholder="Search members..." />
        <FilterMembersInputIcon />
        <RoleFilterSelection
          roles={structuredOrgRoles}
          selectedRoleIds={selectedRoleIds}
          handleRoleFilterChange={handleRoleFilterChange}
        />
      </FilterMembersContainer>

      {!showOrgMembershipRequestsEmptyState && (
        <MembershipRequests
          orgUserMembershipRequests={orgUserMembershipRequests}
          hasMore={hasMoreOrgMemberRequests}
          handleShowMoreRequests={handleShowMoreRequests}
          approveRequest={approveRequest}
          declineRequest={declineRequest}
        />
      )}

      <ExistingMembers orgUsers={orgUsers} hasMore={hasMoreOrgUsers} handleShowMoreOrgUsers={handleShowMoreOrgUsers} />
    </MembersWrapper>
  );
}

export default MemberRequests;
