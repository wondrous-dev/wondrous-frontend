import { useLazyQuery, useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { GET_ORG_MEMBERSHIP_REQUEST } from 'graphql/queries';
import { APPROVE_JOIN_ORG_REQUEST, REJECT_JOIN_ORG_REQUEST } from 'graphql/mutations/org';
import Wrapper from 'components/organization/wrapper/wrapper';
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
} from './styles';

const useGetOrgMemberRequests = (orgId) => {
  const [getOrgUserMembershipRequests, { data }] = useLazyQuery(GET_ORG_MEMBERSHIP_REQUEST);
  useEffect(() => {
    if (orgId) {
      getOrgUserMembershipRequests({
        variables: {
          orgId,
          limit: 1000,
        },
      });
    }
  }, [orgId, getOrgUserMembershipRequests]);
  return data?.getOrgMembershipRequest;
};

const MemberRequests = (props) => {
  const { orgData = {} } = props;
  const { id: orgId } = orgData;
  const orgUserMembershipRequests = useGetOrgMemberRequests(orgId);
  const [approveJoinOrgRequest] = useMutation(APPROVE_JOIN_ORG_REQUEST);
  const [rejectJoinOrgRequest] = useMutation(REJECT_JOIN_ORG_REQUEST);
  const refetchQueries = () => [GET_ORG_MEMBERSHIP_REQUEST];

  const approveRequest = (userId, orgId) => {
    approveJoinOrgRequest({
      variables: {
        userId,
        orgId,
      },
      refetchQueries: refetchQueries(),
    });
  };

  const declineRequest = (userId, orgId) => {
    rejectJoinOrgRequest({
      variables: {
        userId,
        orgId,
      },
      refetchQueries: refetchQueries(),
    });
  };

  const getUserInitials = (name) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('');

  console.log({ orgUserMembershipRequests });

  return (
    <Wrapper orgData={orgData}>
      <RequestsContainer>
        <RequestHeader>
          <RequestCountWrapper>
            Requests
            <RequestCount>{orgUserMembershipRequests?.length ?? 0}</RequestCount>
          </RequestCountWrapper>
        </RequestHeader>

        <MemberRequestsList>
          {orgUserMembershipRequests?.map((request) => (
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

        <ShowAllButton>Show all</ShowAllButton>
      </RequestsContainer>
    </Wrapper>
  );
};

export default MemberRequests;
