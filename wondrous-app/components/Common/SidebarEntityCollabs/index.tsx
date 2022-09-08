import { useMutation, useQuery } from '@apollo/client';
import BackButton from 'components/Common/SidebarBackButton';
import { SectionWrapper } from 'components/Common/SidebarEntityRoles/styles';
import { AddIconWrapper, Label, ListWrapper } from 'components/Common/SidebarStyles';
import CreateCollaborationModal from 'components/CreateCollaborationModal';
import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import {
  GET_ORG_COLLABS_FOR_ORG,
  GET_ORG_COLLAB_REQUESTS_FOR_RECIPIENT,
  GET_ORG_COLLAB_REQUESTS_FOR_INITIATOR,
} from 'graphql/queries';
import { pickBy } from 'lodash';
import SidebarTooltip from 'components/Common/SidebarMainTooltip';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useBoards } from 'utils/hooks';
import Link from 'next/link';
import { APPROVE_ORG_COLLAB_REQUEST, DECLINE_ORG_COLLAB_REQUEST } from 'graphql/mutations';
import { PERMISSIONS } from 'utils/constants';
import {
  CreateButton,
  CollabRequestLogoWrapper,
  CollabRequestAction,
  CollabRequestTitle,
  CollabsWrapper,
} from './styles';

const useBackHref = ({ router }) => {
  const query = pickBy(router.query, (_v, key) => key !== 'collabs');
  const href = {
    pathname: router.pathname,
    query,
  };
  return href;
};

const CollabsSidebar = () => {
  const router = useRouter();
  const { board } = useBoards();
  const canManageCollabs = board?.userPermissionsContext?.orgPermissions[board?.orgId]?.includes(
    PERMISSIONS.FULL_ACCESS
  );

  const { data, loading, error } = useQuery(GET_ORG_COLLABS_FOR_ORG, {
    variables: {
      orgId: board.orgId,
    },
    skip: !board?.orgId,
  });

  const { data: pendingInvites, loading: pendingInvitesLoading } = useQuery(GET_ORG_COLLAB_REQUESTS_FOR_RECIPIENT, {
    variables: {
      orgId: board.orgId,
    },
    skip: !board?.orgId || !canManageCollabs,
  });

  const { data: pendingRequests } = useQuery(GET_ORG_COLLAB_REQUESTS_FOR_INITIATOR, {
    variables: {
      orgId: board.orgId,
    },
    skip: !board?.orgId || canManageCollabs,
  });

  const [declineOrgCollabRequest] = useMutation(DECLINE_ORG_COLLAB_REQUEST, {
    refetchQueries: ['getOrgCollabRequestForRecipient', 'getOrgCollabRequestForInitiator'],
  });

  const [approveOrgCollabRequest] = useMutation(APPROVE_ORG_COLLAB_REQUEST, {
    refetchQueries: ['getOrgCollabRequestForRecipient', 'getOrgCollabRequestForInitiator'],
  });

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const href = useBackHref({ router });

  const handleCreateModal = () => setOpenCreateModal((prevState) => !prevState);

  const handleDecline = (orgCollabRequestId) => declineOrgCollabRequest({ variables: { orgCollabRequestId } });

  const handleApprove = (orgCollabRequestId) => approveOrgCollabRequest({ variables: { orgCollabRequestId } });

  return (
    <>
      <CreateCollaborationModal open={openCreateModal} onCancel={handleCreateModal} defaultOrgId={board?.orgId} />

      <BackButton href={href} />
      <SectionWrapper>
        <ListWrapper>
          <ListWrapper>
            <Label>Collabs</Label>
            {data?.getOrgCollabsForOrg?.map((collab, idx) => (
              <Link href={`/collaboration/${collab.username}/boards`}>
                <CollabsWrapper key={idx}>
                  <CollabRequestTitle>{collab.name}</CollabRequestTitle>
                  <CollabRequestLogoWrapper>
                    <OrgProfilePicture
                      profilePicture={collab.parentOrgProfilePicture}
                      style={{ height: '22px', width: '22px', borderRadius: '2px' }}
                    />
                    X
                    <OrgProfilePicture
                      profilePicture={collab.childOrgProfilePicture}
                      style={{ height: '22px', width: '22px', borderRadius: '2px' }}
                    />
                  </CollabRequestLogoWrapper>
                </CollabsWrapper>
              </Link>
            ))}
          </ListWrapper>
          {canManageCollabs && (
            <CreateButton roundedBg onClick={handleCreateModal}>
              <AddIconWrapper /> Create collab
            </CreateButton>
          )}

          {canManageCollabs && (
            <ListWrapper>
              <Label>Pending invites</Label>
              {pendingInvites?.getOrgCollabRequestForRecipient?.map((request, idx) => (
                <CollabsWrapper key={idx}>
                  <CollabRequestTitle isPending>{request.title}</CollabRequestTitle>
                  <CollabRequestLogoWrapper isPending>
                    <SidebarTooltip title={request.initiatorOrg.username} placement="top">
                      <Link href={`/organization/${request.initiatorOrg.username}/boards`}>
                        <a>
                          <OrgProfilePicture
                            profilePicture={request.initiatorOrg.profilePicture}
                            style={{ height: '22px', width: '22px', borderRadius: '2px' }}
                          />
                        </a>
                      </Link>
                    </SidebarTooltip>
                    X
                    <SidebarTooltip title={request.recipientOrg.username}>
                      <Link href={`/organization/${request.recipientOrg.username}/boards`}>
                        <a>
                          <OrgProfilePicture
                            profilePicture={request.recipientOrg.profilePicture}
                            style={{ height: '22px', width: '22px', borderRadius: '2px' }}
                          />
                        </a>
                      </Link>
                    </SidebarTooltip>
                    {request.recipientOrg.username}
                  </CollabRequestLogoWrapper>
                  <CollabRequestAction type="button" onClick={() => handleApprove(request.id)}>
                    Approve
                  </CollabRequestAction>
                  <CollabRequestAction type="button" onClick={() => handleDecline(request.id)}>
                    Decline
                  </CollabRequestAction>
                </CollabsWrapper>
              ))}
            </ListWrapper>
          )}
          {canManageCollabs && (
            <ListWrapper>
              <Label>Pending requests</Label>
              {pendingRequests?.getOrgCollabRequestForInitiator?.map((request, idx) => (
                <CollabsWrapper key={idx}>
                  <CollabRequestTitle isPending>{request.title}</CollabRequestTitle>
                  <CollabRequestLogoWrapper isPending>
                    <SidebarTooltip title={request.initiatorOrg.username} placement="top">
                      <Link href={`/organization/${request.initiatorOrg.username}/boards`}>
                        <a>
                          <OrgProfilePicture
                            profilePicture={request.initiatorOrg.profilePicture}
                            style={{ height: '22px', width: '22px', borderRadius: '2px' }}
                          />
                        </a>
                      </Link>
                    </SidebarTooltip>
                    X
                    <SidebarTooltip title={request.recipientOrg.username}>
                      <Link href={`/organization/${request.recipientOrg.username}/boards`}>
                        <a>
                          <OrgProfilePicture
                            profilePicture={request.recipientOrg.profilePicture}
                            style={{ height: '22px', width: '22px', borderRadius: '2px' }}
                          />
                        </a>
                      </Link>
                    </SidebarTooltip>
                    {request.recipientOrg.username}
                  </CollabRequestLogoWrapper>
                </CollabsWrapper>
              ))}
            </ListWrapper>
          )}
        </ListWrapper>
      </SectionWrapper>
    </>
  );
};

export default CollabsSidebar;
