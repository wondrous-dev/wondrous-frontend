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
  return { data: data?.getOrgMembershipRequest, fetchMore };
};

const MemberRequests = (props) => {
  const { orgData = {} } = props;
  const { id: orgId } = orgData;
  const { data: orgUserMembershipRequests, fetchMore } = useGetOrgMemberRequests(orgId);
  const [approveJoinOrgRequest] = useMutation(APPROVE_JOIN_ORG_REQUEST);
  const [rejectJoinOrgRequest] = useMutation(REJECT_JOIN_ORG_REQUEST);
  const [showShowAllButton, setShowShowAllButton] = useState(true);
  const refetchQueries = [GET_ORG_FROM_USERNAME];
  const showEmptyState = orgUserMembershipRequests?.length === 0;

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

  const handleShowAllRequests = () => {
    fetchMore({
      variables: {
        orgId,
        offset: orgUserMembershipRequests?.length,
        limit: REFETCH_QUERY_LIMIT,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        const getOrgMembershipRequest = [...prev?.getOrgMembershipRequest, ...fetchMoreResult?.getOrgMembershipRequest];
        setShowShowAllButton(false);
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
