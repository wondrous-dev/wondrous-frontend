import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_ORG_ACTIVE_COLLAB_COUNT, GET_ORG_INVITE_COLLAB_COUNT } from 'graphql/queries';
import { Container, StyledTab, StyledTabs, ChildrenWrapper, CollabCount } from './styles';
import { TAB_TYPES } from './constants';

const Tabs = (props) => {
  const { children, activeTab, setActiveTab, orgId } = props;
  const [getActiveCollabCount, { data: activeCollabCountData }] = useLazyQuery(GET_ORG_ACTIVE_COLLAB_COUNT);
  const [getInvitationCollabCount, { data: inviteCollabCountData }] = useLazyQuery(GET_ORG_INVITE_COLLAB_COUNT);

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
  useEffect(() => {
    if (orgId) {
      getActiveCollabCount({
        variables: {
          orgId,
        },
      });
      getInvitationCollabCount({
        variables: {
          orgId,
        },
      });
    }
  }, [orgId]);

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
            icon={
              <CollabCount isActive={activeTab === tab.name}>
                {tab.name === TAB_TYPES.ACTIVE
                  ? activeCollabCountData?.getOrgActiveCollabCount?.count || 0
                  : inviteCollabCountData?.getOrgInviteCollabCount?.count || 0}
              </CollabCount>
            }
            iconPosition="end"
          />
        ))}
      </StyledTabs>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </Container>
  );
};

export default Tabs;
