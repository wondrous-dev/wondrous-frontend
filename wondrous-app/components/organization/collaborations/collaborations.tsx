import React, { useEffect, useState } from 'react';
import HeaderBlock from 'components/Settings/headerBlock';
import EntitySidebar from 'components/Common/SidebarEntity';
import CreateCollaborationModal from 'components/CreateCollaborationModal';
import { useLazyQuery } from '@apollo/client';
import {
  GET_ORG_COLLABS_FOR_ORG,
  GET_ORG_COLLAB_REQUESTS_FOR_INITIATOR,
  GET_ORG_COLLAB_REQUESTS_FOR_RECIPIENT,
} from 'graphql/queries';
import { gridMobileStyles, PERMISSIONS } from 'utils/constants';
import { Masonry } from '@mui/lab';
import { useIsMobile } from 'utils/hooks';

import Image from 'next/image';
import CollabWrapper from './wrapper';
import {
  CollabInvitationHeader,
  CollabsContainer,
  EmptyText,
  NewCollabButton,
  NewCollabButtonText,
  NewCollabDiv,
} from './styles';
import Tabs from './tabs';
import { TAB_TYPES } from './constants';
import {
  ActiveCollaborationItem,
  PendingInviteCollaborationItem,
  PendingRequestCollaborationItem,
} from './CollaborationItem';

function Collaborations(props) {
  const { orgData = {}, userPermissionsContext } = props;
  const [activeTab, setActiveTab] = useState(TAB_TYPES.ACTIVE);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const isMobile = useIsMobile();
  const canManageCollabs = userPermissionsContext?.orgPermissions[orgData?.orgId]?.includes(PERMISSIONS.FULL_ACCESS);

  const [getOrgCollabs, { data, loading, error }] = useLazyQuery(GET_ORG_COLLABS_FOR_ORG);

  const [getOrgCollabRequestsAsRecipient, { data: pendingInvites }] = useLazyQuery(
    GET_ORG_COLLAB_REQUESTS_FOR_RECIPIENT
  );

  const [getOrgCollabRequestsAsInitiator, { data: pendingRequests }] = useLazyQuery(
    GET_ORG_COLLAB_REQUESTS_FOR_INITIATOR
  );

  const handleCreateModal = () => setOpenCreateModal((prevState) => !prevState);

  useEffect(() => {
    if (orgData?.id) {
      if (activeTab === TAB_TYPES.ACTIVE) {
        getOrgCollabs({
          variables: {
            orgId: orgData?.id,
          },
          fetchPolicy: 'cache-and-network',
        });
      } else if (activeTab === TAB_TYPES.INVITATIONS) {
        getOrgCollabRequestsAsRecipient({
          variables: {
            orgId: orgData?.id,
          },
          fetchPolicy: 'cache-and-network',
        });
        getOrgCollabRequestsAsInitiator({
          variables: {
            orgId: orgData?.id,
          },
          fetchPolicy: 'cache-and-network',
        });
      }
    }
  }, [activeTab, orgData?.id]);

  return (
    <EntitySidebar>
      <CreateCollaborationModal open={openCreateModal} onCancel={handleCreateModal} defaultOrgId={orgData?.id} />
      <CollabWrapper>
        <CollabsContainer>
          <HeaderBlock title={orgData?.name ? `Collabs with ${orgData?.name}` : 'Collabs'} />
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} orgId={orgData?.id} />
          <NewCollabDiv>
            <Image src="/images/collabs/new-collab.svg" alt="New Collab" fill />

            <NewCollabButton
              buttonInnerStyle={{
                padding: '8px',
                paddingRight: '12px',
              }}
              highlighted
              onClick={handleCreateModal}
            >
              <Image src="/images/collabs/add-icon.svg" width={30} height={30} alt="Add Icon" />
              <NewCollabButtonText>New Collab</NewCollabButtonText>
            </NewCollabButton>
          </NewCollabDiv>
          {activeTab === TAB_TYPES.ACTIVE && (
            <>
              {data?.getOrgCollabsForOrg?.length > 0 ? (
                <Masonry spacing={3} columns={{ xs: 1, sm: 2, md: 2, lg: 2 }} style={isMobile ? gridMobileStyles : {}}>
                  {data?.getOrgCollabsForOrg?.map((collab, idx) => (
                    <ActiveCollaborationItem
                      collab={collab}
                      key={idx}
                      userPermissionsContext={userPermissionsContext}
                    />
                  ))}
                </Masonry>
              ) : (
                <EmptyText>You have no active collaborations.</EmptyText>
              )}
            </>
          )}
          {activeTab === TAB_TYPES.INVITATIONS && (
            <>
              <CollabInvitationHeader>Collab requests you've sent</CollabInvitationHeader>
              {pendingRequests?.getOrgCollabRequestForInitiator?.length > 0 ? (
                <Masonry spacing={3} columns={{ xs: 1, sm: 2, md: 2, lg: 2 }} style={isMobile ? gridMobileStyles : {}}>
                  {pendingRequests?.getOrgCollabRequestForInitiator?.map((collab, idx) => (
                    <PendingRequestCollaborationItem
                      collab={collab}
                      key={idx}
                      userPermissionsContext={userPermissionsContext}
                    />
                  ))}
                </Masonry>
              ) : (
                <EmptyText>You have not sent any collab requests.</EmptyText>
              )}
              <CollabInvitationHeader>Collab invites you've received</CollabInvitationHeader>
              {pendingInvites?.getOrgCollabRequestForRecipient?.length > 0 ? (
                <Masonry spacing={3} columns={{ xs: 1, sm: 2, md: 2, lg: 2 }} style={isMobile ? gridMobileStyles : {}}>
                  {pendingInvites?.getOrgCollabRequestForRecipient?.map((collab, idx) => (
                    <PendingInviteCollaborationItem
                      collab={collab}
                      key={idx}
                      userPermissionsContext={userPermissionsContext}
                    />
                  ))}
                </Masonry>
              ) : (
                <EmptyText>You have no pending collab invites.</EmptyText>
              )}
            </>
          )}
        </CollabsContainer>
      </CollabWrapper>
    </EntitySidebar>
  );
}

export default Collaborations;
