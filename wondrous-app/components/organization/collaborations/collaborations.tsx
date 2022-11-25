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
import { PERMISSIONS } from 'utils/constants';

import Image from 'next/image';
import CollabWrapper from './wrapper';
import { CollabsContainer, NewCollabButton, NewCollabButtonText, NewCollabDiv } from './styles';
import Tabs from './tabs';
import { TAB_TYPES } from './constants';

function Collaborations(props) {
  const { orgData = {}, userPermissionsContext } = props;
  const [activeTab, setActiveTab] = useState(TAB_TYPES.ACTIVE);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const canManageCollabs = userPermissionsContext?.orgPermissions[orgData?.orgId]?.includes(PERMISSIONS.FULL_ACCESS);

  const [getOrgCollabs, { data, loading, error }] = useLazyQuery(GET_ORG_COLLABS_FOR_ORG);

  const [getOrgCollabRequestsAsRecipient, { data: pendingInvites, loading: pendingInvitesLoading }] = useLazyQuery(
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
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
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
        </CollabsContainer>
      </CollabWrapper>
    </EntitySidebar>
  );
}

export default Collaborations;
