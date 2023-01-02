import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORG_FROM_USERNAME, GET_ORG_MEMBERSHIP_REQUEST, GET_ORG_ROLES, GET_ORG_USERS } from 'graphql/queries';
import { APPROVE_JOIN_ORG_REQUEST, REJECT_JOIN_ORG_REQUEST } from 'graphql/mutations/org';
import { useMe } from 'components/Auth/withAuth';
import { DefaultUserImage, SafeImage } from 'components/Common/Image';
import RolePill from 'components/Common/RolePill';
import { getRoleColor } from 'components/Settings/Members/MembersTableRow/helpers';
import palette from 'theme/palette';
import {
  MembersWrapper,
  MembersHeading,
  MembersHeader,
  UserRole,
  FilterMembersContainer,
  FilterMembersInput,
  FilterMembersInputIcon,
} from './styles';
import MembershipRequests from './MembershipRequests';
import ExistingMembers from './ExistingMembers';
import RoleFilter from './RoleFilter';

const QUERY_LIMIT = 20;

const userProfilePictureStyles = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
};

const memberProfilePictureStyles = {
  ...userProfilePictureStyles,
  width: '32px',
  height: '32px',
};

const useGetOrgMemberRequests = (orgId) => {
  const [hasMore, setHasMore] = useState(false);
  const [isInitialFetchForThePage, setIsInitialFetchForThePage] = useState(true); // this state is used to determine if the fetch is from a fetchMore or from route change
  const [getOrgUserMembershipRequests, { data, fetchMore, previousData }] = useLazyQuery(GET_ORG_MEMBERSHIP_REQUEST, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    // set notifyOnNetworkStatusChange to true if you want to trigger a rerender whenever the request status updates
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ getOrgMembershipRequest }) => {
      const isPreviousDataValid = previousData && previousData?.getOrgMembershipRequest?.length > 1; // if length of previous data is 1, it is likely a refetch;

      const limitToRefer = QUERY_LIMIT;
      const previousDataLength = previousData?.getOrgMembershipRequest?.length;
      const currentDataLength = getOrgMembershipRequest?.length;
      const updatedDataLength = isPreviousDataValid ? currentDataLength - previousDataLength : currentDataLength;
      if (isInitialFetchForThePage) {
        setHasMore(currentDataLength >= limitToRefer);
      } else {
        updatedDataLength >= 0 && setHasMore(updatedDataLength >= limitToRefer); // updatedDataLength >= 0 means it's not a refetch
      }
    },
  });
  useEffect(() => {
    if (orgId) {
      getOrgUserMembershipRequests({
        variables: {
          orgId,
          limit: QUERY_LIMIT,
        },
      }).then(({ data }) => {
        const requestData = data?.getOrgMembershipRequest;
        if (requestData) setIsInitialFetchForThePage(false);
      });
    }
  }, [orgId, getOrgUserMembershipRequests]);
  return { data: data?.getOrgMembershipRequest, fetchMore, hasMore };
};

const useGetOrgUsers = (orgId) => {
  const [getOrgUsers, { data }] = useLazyQuery(GET_ORG_USERS, {
    fetchPolicy: 'network-only',
    variables: {
      orgId,
      limit: Number.POSITIVE_INFINITY,
    },
  });
  useEffect(() => {
    if (orgId) {
      getOrgUsers();
    }
  }, [orgId, getOrgUsers]);
  return { data: data?.getOrgUsers };
};

function MemberRequests(props) {
  const { orgData = {}, userPermissionsContext } = props;
  const { id: orgId } = orgData;
  const user = useMe();
  const userRole = userPermissionsContext?.orgRoles[orgId];
  const { data: orgUserMembershipRequests, fetchMore, hasMore } = useGetOrgMemberRequests(orgId);
  // const [openGR15Modal, setOpenGR15Modal] = useState(false);
  // const [getOrgUsers, { fetchMore: fetchMoreOrgUsers }] = useLazyQuery(GET_ORG_USERS, {
  //   fetchPolicy: 'network-only',
  //   variables: {
  //     orgId,
  //   },
  // });
  const { data: orgUsers } = useGetOrgUsers(orgId);
  const { data: orgRoles } = useQuery(GET_ORG_ROLES, {
    variables: {
      orgId,
    },
  });
  // console.log({ user, userRole, orgUserMembershipRequests });
  console.log({ orgUsers, orgRoles });
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
  const showEmptyState = orgUserMembershipRequests?.length === 0;

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
    fetchMore({
      variables: {
        orgId,
        offset: orgUserMembershipRequests?.length,
      },
    });
  };

  const getUserInitials = (name) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('');

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
      </MembersHeader>

      <FilterMembersContainer>
        <FilterMembersInput placeholder="Search members..." />
        <FilterMembersInputIcon />
        <RoleFilter roles={orgRoles} />
      </FilterMembersContainer>

      {!showEmptyState && (
        <MembershipRequests
          orgUserMembershipRequests={orgUserMembershipRequests}
          hasMore={hasMore}
          handleShowMoreRequests={handleShowMoreRequests}
          approveRequest={approveRequest}
          declineRequest={declineRequest}
        />
      )}

      {/* {!showEmptyState && (
        <RequestsContainer>
          <MemberRequestsList>
            <RequestCount>{orgUserMembershipRequests?.length} Requests</RequestCount>

            {orgUserMembershipRequests?.map((request) => (
              <MemberRequestCard key={request.id}>
                <NoUnderlineLink href={`/profile/${request.userUsername}/about`} passHref>
                  <MemberProfileLink>
                    {request.userProfilePicture ? (
                      <SafeImage
                        width={28}
                        height={28}
                        style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                        src={request.userProfilePicture}
                        useNextImage
                        alt="User profile picture"
                      />
                    ) : (
                      <SmallAvatar
                        id={request.id}
                        username={request.userUsername}
                        initials={getUserInitials(request.userUsername)}
                        style={{ width: '28px', height: '28px' }}
                      />
                    )}
                    {request?.checkIsGr15Contributor?.isGr15Contributor && (
                      <>
                        <GR15DEIModal open={openGR15Modal} onClose={() => setOpenGR15Modal(false)} />
                        <GR15DEILogo
                          style={{
                            marginLeft: '-8px',
                          }}
                          width="28"
                          height="28"
                          onClick={() => setOpenGR15Modal(true)}
                        />
                      </>
                    )}
                    <MemberName>{request.userUsername}</MemberName>
                  </MemberProfileLink>
                </NoUnderlineLink>
                <MemberMessage style={{ marginRight: '8px' }}>“{request.message}”</MemberMessage>

                <MemberRequestDetails>
                  <MemberRequestDate>{format(new Date(request.createdAt), 'MMM dd, yyyy')}</MemberRequestDate>
                  <RolePill roleName={request.roleName} backgroundColor={palette.grey85} />
                </MemberRequestDetails>

                <RequestActionButtons>
                  <RequestDeclineButton onClick={() => declineRequest(request.id)}>Decline</RequestDeclineButton>
                  <RequestApproveButton
                    onClick={() => {
                      approveRequest(request.id);
                    }}
                  >
                    Approve
                  </RequestApproveButton>
                </RequestActionButtons>
              </MemberRequestCard>
            ))}
          </MemberRequestsList>

          {hasMore && <ShowMoreButton onClick={handleShowMoreRequests}>Show more</ShowMoreButton>}
        </RequestsContainer>
      )} */}

      <ExistingMembers orgUsers={orgUsers} />
    </MembersWrapper>
  );
}

export default MemberRequests;
