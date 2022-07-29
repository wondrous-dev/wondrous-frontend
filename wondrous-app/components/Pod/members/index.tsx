import { useEffect, useRef, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_POD_BY_ID, GET_POD_MEMBERSHIP_REQUEST } from 'graphql/queries';
import { APPROVE_JOIN_POD_REQUEST, REJECT_JOIN_POD_REQUEST } from 'graphql/mutations/pod';
import Wrapper from 'components/Pod/wrapper';
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

const useGetPodMemberRequests = (podId) => {
  const [getPodUserMembershipRequests, { data, fetchMore }] = useLazyQuery(GET_POD_MEMBERSHIP_REQUEST);
  useEffect(() => {
    if (podId) {
      getPodUserMembershipRequests({
        variables: {
          podId,
          limit: QUERY_LIMIT,
        },
      });
    }
  }, [podId, getPodUserMembershipRequests]);
  const hasMore = data?.getPodMembershipRequest?.length >= QUERY_LIMIT;
  return { data: data?.getPodMembershipRequest, fetchMore, hasMore };
};

const MemberRequests = (props) => {
  const { podData = {} } = props;
  const { id: podId } = podData;
  const { data: podUserMembershipRequests, fetchMore, hasMore } = useGetPodMemberRequests(podId);
  const [approveJoinPodRequest] = useMutation(APPROVE_JOIN_POD_REQUEST);
  const [rejectJoinPodRequest] = useMutation(REJECT_JOIN_POD_REQUEST);
  const [showShowMoreButton, setShowShowMoreButton] = useState(false);
  const refetchQueries = [
    GET_POD_BY_ID,
    {
      query: GET_POD_MEMBERSHIP_REQUEST,
      variables: {
        podId,
        limit: podUserMembershipRequests?.length - 1,
      },
    },
  ];
  const showEmptyState = podUserMembershipRequests?.length === 0;
  const initialLoad = useRef(true);

  useEffect(() => {
    if (initialLoad.current && hasMore) {
      setShowShowMoreButton(true);
      initialLoad.current = false;
    }
  }, [hasMore]);

  const approveRequest = (userId, podId) => {
    approveJoinPodRequest({
      variables: {
        userId,
        podId,
      },
      refetchQueries,
    });
  };

  const declineRequest = (userId, podId) => {
    rejectJoinPodRequest({
      variables: {
        userId,
        podId,
      },
      refetchQueries,
    });
  };

  const handleShowMoreRequests = () => {
    fetchMore({
      variables: {
        podId,
        offset: podUserMembershipRequests?.length,
        limit: REFETCH_QUERY_LIMIT,
      },
    }).then(({ data }) => {
      const hasMore = data?.getPodMembershipRequest?.length >= REFETCH_QUERY_LIMIT;
      setShowShowMoreButton(hasMore);
    });
  };

  const getUserInitials = (name) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('');

  return (
    <Wrapper>
      <RequestsContainer>
        <RequestHeader>
          {showEmptyState ? (
            <RequestCountEmptyState>No Requests</RequestCountEmptyState>
          ) : (
            <RequestCountWrapper>
              Requests
              <RequestCount>{podUserMembershipRequests?.length ?? 0}</RequestCount>
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
              {podUserMembershipRequests?.map((request) => (
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
                    <RequestDeclineButton onClick={() => declineRequest(request.userId, request.podId)}>
                      Decline
                    </RequestDeclineButton>
                    <RequestApproveButton onClick={() => approveRequest(request.userId, request.podId)}>
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
