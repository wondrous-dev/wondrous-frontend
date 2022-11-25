import React from 'react';
import { Container, StyledTab, StyledTabs, ChildrenWrapper } from './styles';
import { TAB_TYPES } from './constants';

const Tabs = (props) => {
  const { children, activeTab, setActiveTab } = props;
  const TABS = [
    {
      name: TAB_TYPES.ACTIVE,
      label: 'Active',
      action: () => setActiveTab(TAB_TYPES.ACTIVE),
    },
    {
      name: TAB_TYPES.INVITATIONS,
      label: 'Invitations',
      action: () => setActiveTab(TAB_TYPES.INVITATIONS),
    },
  ];
  return (
    <Container>
      <StyledTabs value={activeTab} variant="fullWidth">
        {TABS.map((tab) => (
          <StyledTab
            value={tab.name}
            key={tab.name}
            label={tab.label}
            onClick={tab.action}
            isActive={activeTab === tab.name}
          />
        ))}
      </StyledTabs>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </Container>
  );
};

export default Tabs;
