import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_ORG_FROM_USERNAME, GET_ORG_MEMBERSHIP_REQUEST } from 'graphql/queries';
import { APPROVE_JOIN_ORG_REQUEST, REJECT_JOIN_ORG_REQUEST } from 'graphql/mutations/org';
import HomePageHeader from 'components/organization/wrapper/HomePageHeader';
import { SafeImage } from 'components/Common/Image';
import { SmallAvatar } from 'components/Common/AvatarList';
import RolePill from 'components/Common/RolePill';
import { NoUnderlineLink } from 'components/Common/Link/links';
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
} from './styles';

const QUERY_LIMIT = 20;

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

function MemberRequests(props) {
  const { orgData = {} } = props;
  const { id: orgId } = orgData;
  const { data: orgUserMembershipRequests, fetchMore, hasMore } = useGetOrgMemberRequests(orgId);
  const [openGR15Modal, setOpenGR15Modal] = useState(false);
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
    <HomePageHeader orgData={orgData}>
      <RequestsContainer>
        <RequestHeader>
          {showEmptyState ? (
            <RequestCountEmptyState>No Requests</RequestCountEmptyState>
          ) : (
            <RequestCountWrapper>
              Requests
              {/* <RequestCount>{orgUserMembershipRequests?.length ?? 0}</RequestCount> */}
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
                  <NoUnderlineLink href={`/profile/${request.userUsername}/about`} passHref>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                      <MemberName>{request.userUsername}</MemberName>
                    </div>
                  </NoUnderlineLink>
                  <MemberMessage>“{request.message}”</MemberMessage>
                  <RolePill roleName={request.roleName} />

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
    </HomePageHeader>
  );
}

export default MemberRequests;
