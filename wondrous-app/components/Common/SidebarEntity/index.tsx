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
import Button from 'components/Button';
import palette from 'theme/palette';
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
  const { minimized } = useSideBar();

  const [openInvite, setOpenInvite] = useState(false);

  if (minimized) return null;
  const href = orgBoard
    ? `/organization/settings/${orgBoard?.orgId}/general`
    : `/pod/settings/${podBoard?.podId}/general`;

  const sharedButtonProps = {
    height: 30,
    fullWidth: true,
  };

  const sharedButtonTheme = {
    fontSize: '14px',
    fontWeight: 500,
    paddingX: 8,
    paddingY: 8,
  };

  return (
    <>
      {orgBoard ? (
        <OrgInviteLinkModal orgId={orgBoard?.orgId} open={openInvite} onClose={() => setOpenInvite(false)} />
      ) : null}
      {podBoard ? (
        <PodInviteLinkModal podId={podBoard?.podId} open={openInvite} onClose={() => setOpenInvite(false)} />
      ) : null}
      <ButtonsContainer>
        <UnstyledLink href={href} style={{ width: '100%' }}>
          {/* <SettingsBtn>Settings</SettingsBtn> */}
          <Button
            {...sharedButtonProps}
            buttonTheme={{
              background: palette.grey75,
              borderColor: 'transparent',
              hover: {
                background: palette.grey76,
              },
              ...sharedButtonTheme,
            }}
          >
            Settings
          </Button>
        </UnstyledLink>
        <Button buttonTheme={sharedButtonTheme} {...sharedButtonProps} onClick={() => setOpenInvite(true)}>
          Invite
        </Button>
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
        <EntitySidebarButtons />
        <List />
      </>
    );
  }, [query.roles, query.collabs, isMobileScreen]);

  return (
    <Wrapper>
      <SidebarWrapper minimized={minimized}>
        {isMobileScreen ? <AboutEntity /> : null}

        <SidebarContent>{renderSidebar ? renderSidebar() : <Sidebar />}</SidebarContent>
        <CollapseExpandButton />
      </SidebarWrapper>
      <ChildrenWrapper minimized={minimized}>{children}</ChildrenWrapper>
    </Wrapper>
  );
};

export default EntitySidebar;
