import { useEffect, useState } from 'react';
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
  RequestHeader,
  RequestsContainer,
  ShowAllButton,
  MemberName,
  MemberMessage,
  RequestActionButtons,
  RequestDeclineButton,
  RequestApproveButton,
  MemberRequestsListEndMessage,
  EmptyMemberRequestsListMessage,
} from './styles';

let QUERY_LIMIT = 1;
let REFETCH_QUERY_LIMIT = undefined;

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
  return { data: data?.getPodMembershipRequest, fetchMore };
};

const MemberRequests = (props) => {
  const { podData = {} } = props;
  const { id: podId } = podData;
  const { data: podUserMembershipRequests, fetchMore } = useGetPodMemberRequests(podId);
  const [approveJoinPodRequest] = useMutation(APPROVE_JOIN_POD_REQUEST);
  const [rejectJoinPodRequest] = useMutation(REJECT_JOIN_POD_REQUEST);
  const [showShowAllButton, setShowShowAllButton] = useState(true);
  const refetchQueries = [GET_POD_BY_ID];
  const showEmptyState = podUserMembershipRequests?.length === 0;

  const approveRequest = (userId, podId) => {
    approveJoinPodRequest({
      variables: {
        userId,
        podId,
      },
      refetchQueries,
      updateQueries: {
        getPodMembershipRequest: (prev, { mutationResult }) => {
          const isMutationSuccess = mutationResult.data?.approveJoinPodRequest?.success;
          if (isMutationSuccess) {
            const newOrgMembershipRequests = [...prev.getPodMembershipRequest].filter((req) => req.userId !== userId);
            return { getPodMembershipRequest: newOrgMembershipRequests };
          }
          return { getPodMembershipRequest: prev };
        },
      },
    });
  };

  const declineRequest = (userId, podId) => {
    rejectJoinPodRequest({
      variables: {
        userId,
        podId,
      },
      refetchQueries,
      updateQueries: {
        getPodMembershipRequest: (prev, { mutationResult }) => {
          const isMutationSuccess = mutationResult.data?.rejectJoinPodRequest?.success;
          if (isMutationSuccess) {
            const newOrgMembershipRequests = [...prev.getPodMembershipRequest].filter((req) => req.userId !== userId);
            return { getPodMembershipRequest: newOrgMembershipRequests };
          }
          return { getPodMembershipRequest: prev };
        },
      },
    });
  };

  const handleShowAllRequests = () => {
    fetchMore({
      variables: {
        podId,
        offset: podUserMembershipRequests?.length,
        limit: REFETCH_QUERY_LIMIT,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        const getPodMembershipRequest = [...prev?.getPodMembershipRequest, ...fetchMoreResult?.getPodMembershipRequest];
        setShowShowAllButton(false);
        return { getPodMembershipRequest };
      },
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
          <RequestCountWrapper>
            Requests
            <RequestCount>{podUserMembershipRequests?.length ?? 0}</RequestCount>
          </RequestCountWrapper>
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
                      style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                      src={request.userProfilePicture}
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

            {showShowAllButton ? (
              <ShowAllButton onClick={handleShowAllRequests}>Show all</ShowAllButton>
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
