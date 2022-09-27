import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_POD_BY_ID, GET_POD_MEMBERSHIP_REQUEST } from 'graphql/queries';
import { APPROVE_JOIN_POD_REQUEST, REJECT_JOIN_POD_REQUEST } from 'graphql/mutations/pod';
import Wrapper from 'components/Pod/wrapper';
import { SafeImage } from 'components/Common/Image';
import { SmallAvatar } from 'components/Common/AvatarList';
import RolePill from 'components/Common/RolePill';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import {
  MemberRequestsList,
  MemberRequestCard,
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
  MemberProfileLink,
} from './styles';

const QUERY_LIMIT = 3;

const useGetPodMemberRequests = (podId) => {
  const [hasMore, setHasMore] = useState(false);
  const [isInitialFetchForThePage, setIsInitialFetchForThePage] = useState(true); // this state is used to determine if the fetch is from a fetchMore or from route change
  const [getPodUserMembershipRequests, { data, fetchMore, previousData }] = useLazyQuery(GET_POD_MEMBERSHIP_REQUEST, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    // set notifyOnNetworkStatusChange to true if you want to trigger a rerender whenever the request status updates
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ getPodMembershipRequest }) => {
      const isPreviousDataValid = previousData && previousData?.getPodMembershipRequest?.length > 1; // if length of previous data is 1, it is likely a refetch;

      // if previousData is undefined, it means this is the initial fetch
      const limitToRefer = QUERY_LIMIT;
      const previousDataLength = previousData?.getPodMembershipRequest?.length;
      const currentDataLength = getPodMembershipRequest?.length;
      const updatedDataLength = isPreviousDataValid ? currentDataLength - previousDataLength : currentDataLength;
      if (isInitialFetchForThePage) {
        setHasMore(currentDataLength >= limitToRefer);
      } else {
        updatedDataLength >= 0 && setHasMore(updatedDataLength >= limitToRefer); // updatedDataLength >= 0 means it's not a refetch
      }
    },
  });
  useEffect(() => {
    if (podId) {
      getPodUserMembershipRequests({
        variables: {
          podId,
          limit: QUERY_LIMIT,
        },
      }).then(({ data }) => {
        const requestData = data?.getPodMembershipRequest;
        if (requestData) setIsInitialFetchForThePage(false);
      });
    }
  }, [podId, getPodUserMembershipRequests]);
  return { data: data?.getPodMembershipRequest, fetchMore, hasMore };
};

function MemberRequests(props) {
  const { podData = {} } = props;
  const [openGR15Modal, setOpenGR15Modal] = useState(false);
  const { id: podId } = podData;
  const { data: podUserMembershipRequests, fetchMore, hasMore } = useGetPodMemberRequests(podId);
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
  const showEmptyState = podUserMembershipRequests?.length === 0;

  const approveRequest = (requestId) => {
    approveJoinPodRequest({
      variables: {
        joinOrgRequestId: requestId,
      },
      refetchQueries,
    });
  };

  const declineRequest = (requestId) => {
    rejectJoinPodRequest({
      variables: {
        joinOrgRequestId: requestId,
      },
      refetchQueries,
    });
  };

  const handleShowMoreRequests = () => {
    fetchMore({
      variables: {
        podId,
        offset: podUserMembershipRequests?.length,
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
          {showEmptyState ? (
            <RequestCountEmptyState>No Requests</RequestCountEmptyState>
          ) : (
            <RequestCountWrapper>
              Requests
              {/* <RequestCount>{podUserMembershipRequests?.length ?? 0}</RequestCount> */}
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
                  <Link href={`/profile/${request.userUsername}/about`} passHref>
                    <MemberProfileLink>
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
                  </Link>
                  <MemberMessage style={{ marginRight: '8px' }}>“{request.message}”</MemberMessage>
                  <RolePill roleName={request.roleName} />
                  <RequestActionButtons>
                    <RequestDeclineButton onClick={() => declineRequest(request.id)}>Decline</RequestDeclineButton>
                    <RequestApproveButton onClick={() => approveRequest(request.id)}>Approve</RequestApproveButton>
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
}

export default MemberRequests;
