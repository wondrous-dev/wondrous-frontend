import { useEffect, useRef, useState } from 'react';
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

let QUERY_LIMIT = 3;
let REFETCH_QUERY_LIMIT = 20;

const useGetOrgMemberRequests = (orgId) => {
  const [getOrgUserMembershipRequests, { data, fetchMore }] = useLazyQuery(GET_ORG_MEMBERSHIP_REQUEST);
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
  const hasMore = data?.getOrgMembershipRequest?.length >= QUERY_LIMIT;
  return { data: data?.getOrgMembershipRequest, fetchMore, hasMore };
};

const MemberRequests = (props) => {
  const { orgData = {} } = props;
  const { id: orgId } = orgData;
  const { data: orgUserMembershipRequests, fetchMore, hasMore } = useGetOrgMemberRequests(orgId);
  const [approveJoinOrgRequest] = useMutation(APPROVE_JOIN_ORG_REQUEST);
  const [rejectJoinOrgRequest] = useMutation(REJECT_JOIN_ORG_REQUEST);
  const [showShowMoreButton, setShowShowMoreButton] = useState(false);
  const refetchQueries = [GET_ORG_FROM_USERNAME];
  const showEmptyState = orgUserMembershipRequests?.length === 0;
  const initialLoad = useRef(true);

  useEffect(() => {
    if (initialLoad.current && hasMore) {
      setShowShowMoreButton(true);
      initialLoad.current = false;
    }
  }, [hasMore]);

  const approveRequest = (userId, orgId) => {
    approveJoinOrgRequest({
      variables: {
        userId,
        orgId,
      },
      refetchQueries,
      updateQueries: {
        getOrgMembershipRequest: (prev, { mutationResult }) => {
          const isMutationSuccess = mutationResult.data?.approveJoinOrgRequest?.success;
          if (isMutationSuccess) {
            const newOrgMembershipRequests = [...prev.getOrgMembershipRequest].filter((req) => req.userId !== userId);
            return { getOrgMembershipRequest: newOrgMembershipRequests };
          }
          return { getOrgMembershipRequest: prev };
        },
      },
    });
  };

  const declineRequest = (userId, orgId) => {
    rejectJoinOrgRequest({
      variables: {
        userId,
        orgId,
      },
      refetchQueries,
      updateQueries: {
        getOrgMembershipRequest: (prev, { mutationResult }) => {
          const isMutationSuccess = mutationResult.data?.rejectJoinOrgRequest?.success;
          if (isMutationSuccess) {
            const newOrgMembershipRequests = [...prev.getOrgMembershipRequest].filter((req) => req.userId !== userId);
            return { getOrgMembershipRequest: newOrgMembershipRequests };
          }
          return { getOrgMembershipRequest: prev };
        },
      },
    });
  };

  const handleShowMoreRequests = () => {
    fetchMore({
      variables: {
        orgId,
        offset: orgUserMembershipRequests?.length,
        limit: REFETCH_QUERY_LIMIT,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        const getOrgMembershipRequest = [...prev?.getOrgMembershipRequest, ...fetchMoreResult?.getOrgMembershipRequest];
        const hasMore = fetchMoreResult?.getOrgMembershipRequest?.length >= REFETCH_QUERY_LIMIT;
        setShowShowMoreButton(hasMore);
        return { getOrgMembershipRequest };
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

            {showShowMoreButton ? (
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
