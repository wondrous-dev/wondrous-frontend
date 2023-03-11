import { useState } from 'react';
import { format } from 'date-fns';

import { SmallAvatar } from 'components/Common/AvatarList';
import { SafeImage } from 'components/Common/Image';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import RolePill from 'components/Common/RolePill';

import palette from 'theme/palette';

import {
  MemberMessage,
  MemberName,
  MemberProfileLink,
  MemberRequestCard,
  MemberRequestDate,
  MemberRequestDetails,
  MemberRequestsList,
  RequestActionButtons,
  RequestApproveButton,
  RequestCount,
  RequestDeclineButton,
  RequestsContainer,
  ShowMoreButton,
} from './styles';

type Props = {
  userMembershipRequests: Array<any>;
  membershipRequestsCount: number;
  hasMore: boolean;
  handleShowMoreRequests?: () => void;
  declineRequest: (requestId: string) => void;
  approveRequest: (requestId: string) => void;
};

const MembershipRequests = (props: Props) => {
  const {
    userMembershipRequests,
    membershipRequestsCount,
    hasMore,
    handleShowMoreRequests,
    declineRequest,
    approveRequest,
  } = props;

  const [openGR15Modal, setOpenGR15Modal] = useState(false);

  const handleOpenGR15Modal = (ev) => {
    ev.preventDefault();
    setOpenGR15Modal(true);
  };

  const getUserInitials = (name) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('');

  return (
    <RequestsContainer>
      <GR15DEIModal open={openGR15Modal} onClose={() => setOpenGR15Modal(false)} />

      <RequestCount>{membershipRequestsCount} Requests</RequestCount>
      <MemberRequestsList>
        {userMembershipRequests?.map((request) => (
          <MemberRequestCard key={request.id}>
            <MemberProfileLink href={`/profile/${request.userUsername}/about`}>
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
                <GR15DEILogo
                  style={{
                    marginLeft: '-8px',
                  }}
                  width="28"
                  height="28"
                  onClick={handleOpenGR15Modal}
                />
              )}
              <MemberName>{request.userUsername}</MemberName>
            </MemberProfileLink>
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
  );
};
export default MembershipRequests;
