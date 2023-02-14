import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

import useSideBar from 'hooks/useSideBar';

import CollapseExpandButton from 'components/Common/SidebarCollapseButton';
import AboutEntity from 'components/Common/SidebarEntityAbout';
import SidebarEntityList from 'components/Common/SidebarEntityList';
import { ChildrenWrapper, SidebarContent, SidebarWrapper, Wrapper } from 'components/Common/SidebarStyles';
import { UnstyledLink } from 'components/WorkspacePicker/styles';
import useMediaQuery from 'hooks/useMediaQuery';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
import Button from 'components/Button';
import palette from 'theme/palette';
import OrgInviteLinkModal from 'components/Common/InviteLinkModal/OrgInviteLink';
import PodInviteLinkModal from 'components/Common/InviteLinkModal/PodInviteLink';
import useCanManage from 'hooks/useCanManage';
import JoinWorkspace from 'components/Common/JoinWorkspace';
import { ButtonsContainer } from './styles';

const EntitySidebarButtons = () => {
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const { minimized } = useSideBar();
  const canManage = useCanManage();

  const [openInvite, setOpenInvite] = useState(false);

  if (!canManage) {
    return (
      <ButtonsContainer minimized={minimized}>
        <JoinWorkspace />
      </ButtonsContainer>
    );
  }

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
      <ButtonsContainer minimized={minimized}>
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
  const { isMobileScreen } = useMediaQuery();

  return (
    <Wrapper>
      <SidebarWrapper minimized={minimized}>
        {isMobileScreen ? <AboutEntity /> : null}

        <SidebarContent>
          {renderSidebar ? (
            renderSidebar()
          ) : (
            <>
              <EntitySidebarButtons />
              <SidebarEntityList />
            </>
          )}
        </SidebarContent>
        <CollapseExpandButton />
      </SidebarWrapper>
      <ChildrenWrapper minimized={minimized}>{children}</ChildrenWrapper>
    </Wrapper>
  );
};

export default EntitySidebar;
