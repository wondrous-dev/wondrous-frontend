import React, { useState } from 'react';
import HeaderBlock from 'components/Settings/headerBlock';
import EntitySidebar from 'components/Common/SidebarEntity';
import CreateCollaborationModal from 'components/CreateCollaborationModal';
import Image from 'next/image';
import CollabWrapper from './wrapper';
import { CollabsContainer, NewCollabButton, NewCollabDiv } from './styles';
import Tabs from './tabs';
import { TAB_TYPES } from './constants';

function Collaborations(props) {
  const { orgData = {} } = props;
  const [activeTab, setActiveTab] = useState(TAB_TYPES.ACTIVE);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const handleCreateModal = () => setOpenCreateModal((prevState) => !prevState);

  return (
    <EntitySidebar>
      <CreateCollaborationModal open={openCreateModal} onCancel={handleCreateModal} defaultOrgId={orgData?.id} />
      <CollabWrapper>
        <CollabsContainer>
          <HeaderBlock title={orgData?.name ? `Collabs with ${orgData?.name}` : 'Collabs'} />
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <NewCollabDiv>
            <Image src="/images/collabs/new-collab.svg" alt="New Collab" fill />
            <NewCollabButton highlighted onClick={handleCreateModal}>
              New Collab
            </NewCollabButton>
          </NewCollabDiv>
        </CollabsContainer>
      </CollabWrapper>
    </EntitySidebar>
  );
}

export default Collaborations;
