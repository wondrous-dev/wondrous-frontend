import React, { useState } from 'react';
import HeaderBlock from 'components/Settings/headerBlock';
import EntitySidebar from 'components/Common/SidebarEntity';
import CollabWrapper from './wrapper';
import { CollabsContainer } from './styles';
import Tabs from './tabs';
import { TAB_TYPES } from './constants';

function Collaborations(props) {
  const { orgData = {} } = props;
  const [activeTab, setActiveTab] = useState(TAB_TYPES.ACTIVE);

  return (
    <EntitySidebar>
      <CollabWrapper>
        <CollabsContainer>
          <HeaderBlock title={orgData?.name ? `Collabs with ${orgData?.name}` : 'Collabs'} />
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </CollabsContainer>
      </CollabWrapper>
    </EntitySidebar>
  );
}

export default Collaborations;
