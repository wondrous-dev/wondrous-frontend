import { MemberRequestsList, RequestCount, RequestsContainer } from './styles';

type Props = {};

const MembershipRequests = (props: Props) => (
  <RequestsContainer>
    {/* <MemberRequestsList>
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

      {hasMore && <ShowMoreButton onClick={handleShowMoreRequests}>Show more</ShowMoreButton>} */}
  </RequestsContainer>
);

export default MembershipRequests;
