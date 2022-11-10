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
import { MODAL_TYPE } from 'components/CreateCollaborationModal/ViewCollab/CollabDetails';
import CollabsEntityList from './List';
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
    fetchPolicy: 'cache-and-network',
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
    skip: !board?.orgId || !canManageCollabs,
  });

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const href = useBackHref({ router });

  const handleCreateModal = () => setOpenCreateModal((prevState) => !prevState);

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
              <AddIconWrapper /> Create collaboration
            </CreateButton>
          )}
          {canManageCollabs && (
            <CollabsEntityList
              label="Pending invites"
              type={MODAL_TYPE.ACTION}
              items={pendingInvites?.getOrgCollabRequestForRecipient}
            />
          )}
          {canManageCollabs && (
            <CollabsEntityList
              label="Pending requests"
              type={MODAL_TYPE.VIEW}
              items={pendingRequests?.getOrgCollabRequestForInitiator}
            />
          )}
        </ListWrapper>
      </SectionWrapper>
    </>
  );
};

export default CollabsSidebar;
