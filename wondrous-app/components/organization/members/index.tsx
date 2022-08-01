import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_ORG_FROM_USERNAME, GET_ORG_MEMBERSHIP_REQUEST } from 'graphql/queries';
import { APPROVE_JOIN_ORG_REQUEST, REJECT_JOIN_ORG_REQUEST } from 'graphql/mutations/org';
import Wrapper from 'components/organization/wrapper/wrapper';
import { SafeImage } from 'components/Common/Image';
import { SmallAvatar } from 'components/Common/AvatarList';
import {
  MemberRequestsList,
  MemberRequestCard,
  RequestCount,
  RequestCountWrapper,
  RequestCountEmptyState,
  RequestHeader,
  RequestsContainer,
  ShowMoreButton,
  MemberName,
  MemberMessage,
  RequestActionButtons,
  RequestDeclineButton,
  RequestApproveButton,
  MemberRequestsListEndMessage,
  EmptyMemberRequestsListMessage,
} from './styles';

const QUERY_LIMIT = 3;
const REFETCH_QUERY_LIMIT = 20;

const useGetOrgMemberRequests = (orgId) => {
  const [hasMore, setHasMore] = useState(false);
  const [getOrgUserMembershipRequests, { data, fetchMore, previousData }] = useLazyQuery(GET_ORG_MEMBERSHIP_REQUEST, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    // set notifyOnNetworkStatusChange to true if you want to trigger a rerender whenever the request status updates
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ getOrgMembershipRequest }) => {
      // if previousData is undefined, it means this is the initial fetch
      const limitToRefer = previousData ? REFETCH_QUERY_LIMIT : QUERY_LIMIT;
      const updatedDataLength = previousData
        ? getOrgMembershipRequest?.length - previousData?.getOrgMembershipRequest?.length
        : getOrgMembershipRequest?.length;
      // updatedDataLength >= 0 means it's not a refetch
      updatedDataLength >= 0 && setHasMore(updatedDataLength >= limitToRefer);
    },
  });
  useEffect(() => {
    if (orgId) {
      getOrgUserMembershipRequests({
        variables: {
          orgId,
          limit: QUERY_LIMIT,
        },
      });
    }
  }, [orgId, getOrgUserMembershipRequests]);
  return { data: data?.getOrgMembershipRequest, fetchMore, hasMore };
};

const MemberRequests = (props) => {
  const { orgData = {} } = props;
  const { id: orgId } = orgData;
  const { data: orgUserMembershipRequests, fetchMore, hasMore } = useGetOrgMemberRequests(orgId);
  const [approveJoinOrgRequest] = useMutation(APPROVE_JOIN_ORG_REQUEST);
  const [rejectJoinOrgRequest] = useMutation(REJECT_JOIN_ORG_REQUEST);
  const refetchQueries = [
    GET_ORG_FROM_USERNAME,
    {
      query: GET_ORG_MEMBERSHIP_REQUEST,
      variables: {
        orgId,
        limit: orgUserMembershipRequests?.length - 1,
      },
    },
  ];
  const showEmptyState = orgUserMembershipRequests?.length === 0;

  const approveRequest = (userId, orgId) => {
    approveJoinOrgRequest({
      variables: {
        userId,
        orgId,
      },
      refetchQueries,
    });
  };

  const declineRequest = (userId, orgId) => {
    rejectJoinOrgRequest({
      variables: {
        userId,
        orgId,
      },
      refetchQueries,
    });
  };

  const handleShowMoreRequests = () => {
    fetchMore({
      variables: {
        orgId,
        offset: orgUserMembershipRequests?.length,
        limit: REFETCH_QUERY_LIMIT,
      },
    });
  };

  const getUserInitials = (name) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('');

  return (
    <Wrapper orgData={orgData}>
      <RequestsContainer>
        <RequestHeader>
          {showEmptyState ? (
            <RequestCountEmptyState>No Requests</RequestCountEmptyState>
          ) : (
            <RequestCountWrapper>
              Requests
              <RequestCount>{orgUserMembershipRequests?.length ?? 0}</RequestCount>
            </RequestCountWrapper>
          )}
        </RequestHeader>

        {showEmptyState ? (
          <EmptyMemberRequestsListMessage>
            There are no requests right now. Come back later to see some.
          </EmptyMemberRequestsListMessage>
        ) : (
          <>
            <MemberRequestsList>
              {orgUserMembershipRequests?.map((request) => (
                <MemberRequestCard key={request.id}>
                  {request.userProfilePicture ? (
                    <SafeImage
                      width={28}
                      height={28}
                      style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                      src={request.userProfilePicture}
                      useNextImage
                    />
                  ) : (
                    <SmallAvatar
                      id={request.id}
                      username={request.userUsername}
                      initials={getUserInitials(request.userUsername)}
                      style={{ width: '28px', height: '28px' }}
                    />
                  )}

                  <MemberName>{request.userUsername}</MemberName>
                  <MemberMessage>“{request.message}”</MemberMessage>
                  <RequestActionButtons>
                    <RequestDeclineButton onClick={() => declineRequest(request.userId, request.orgId)}>
                      Decline
                    </RequestDeclineButton>
                    <RequestApproveButton onClick={() => approveRequest(request.userId, request.orgId)}>
                      Approve
                    </RequestApproveButton>
                  </RequestActionButtons>
                </MemberRequestCard>
              ))}
            </MemberRequestsList>

            {hasMore ? (
              <ShowMoreButton onClick={handleShowMoreRequests}>Show more</ShowMoreButton>
            ) : (
              <MemberRequestsListEndMessage>
                These are all the requests for now. Come back later to see more.
              </MemberRequestsListEndMessage>
            )}
          </>
        )}
      </RequestsContainer>
    </Wrapper>
  );
};

export default MemberRequests;
