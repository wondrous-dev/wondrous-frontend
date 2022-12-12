import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

import useSideBar from 'hooks/useSideBar';

import CollapseExpandButton from 'components/Common/SidebarCollapseButton';
import AboutEntity from 'components/Common/SidebarEntityAbout';
import CollabsSidebar from 'components/Common/SidebarEntityCollabs';
import List from 'components/Common/SidebarEntityList';
import RolesSidebar from 'components/Common/SidebarEntityRoles';
import { ChildrenWrapper, SidebarContent, SidebarWrapper, Wrapper } from 'components/Common/SidebarStyles';
import { RequestApproveButton } from 'components/organization/members/styles';
import { UnstyledLink } from 'components/WorkspacePicker/styles';
import useMediaQuery from 'hooks/useMediaQuery';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
import { OrgInviteLinkModal } from '../InviteLinkModal/OrgInviteLink';
import { PodInviteLinkModal } from '../InviteLinkModal/podInviteLink';
import SidebarUserBoard from '../UserSidebar';
import { ButtonsContainer, SettingsBtn } from './styles';

const SIDEBAR_COMPONENTS = {
  collabs: () => <CollabsSidebar />,
  roles: () => <RolesSidebar />,
};

const EntitySidebarButtons = () => {
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const [openInvite, setOpenInvite] = useState(false);
  const href = orgBoard
    ? `/organization/settings/${orgBoard?.orgId}/general`
    : `/pod/settings/${podBoard?.podId}/general`;
  return (
    <>
      {orgBoard ? (
        <OrgInviteLinkModal orgId={orgBoard?.orgId} open={openInvite} onClose={() => setOpenInvite(false)} />
      ) : null}
      {podBoard ? (
        <PodInviteLinkModal podId={podBoard?.podId} open={openInvite} onClose={() => setOpenInvite(false)} />
      ) : null}
      <ButtonsContainer>
        <UnstyledLink href={href}>
          <SettingsBtn>Settings</SettingsBtn>
        </UnstyledLink>
        <RequestApproveButton onClick={() => setOpenInvite(true)}>Invite</RequestApproveButton>
      </ButtonsContainer>
    </>
  );
};


const EntitySidebar = ({ children, renderSidebar = null }) => {
  const { minimized } = useSideBar();
  const { query } = useRouter();
  const { isMobileScreen } = useMediaQuery();

  const Sidebar = useMemo(() => {
    if (query.roles) {
      return SIDEBAR_COMPONENTS.roles;
    }
    if (query.collabs) {
      return SIDEBAR_COMPONENTS.collabs;
    }

    return () => (
      <>
        {isMobileScreen ? <AboutEntity /> : null}
        <EntitySidebarButtons />
        <List />
      </>
    );
  }, [query.roles, query.collabs, isMobileScreen]);

  return (
    <Wrapper>
      <SidebarWrapper minimized={minimized}>
        <SidebarContent>
          {renderSidebar ? renderSidebar() : <Sidebar />}
        </SidebarContent>
        <CollapseExpandButton />
      </SidebarWrapper>
      <ChildrenWrapper minimized={minimized}>{children}</ChildrenWrapper>
    </Wrapper>
  );
};

export default EntitySidebar;
