import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { PERMISSIONS, SIDEBAR_WIDTH } from '../../../utils/constants';
import { SideBarContext } from '../../../utils/contexts';
import { parseUserPermissionContext, shrinkNumber, toggleHtmlOverflow } from '../../../utils/helpers';
import { usePodBoard } from '../../../utils/hooks';
import { PodInviteLinkModal } from '../../Common/InviteLinkModal/podInviteLink';
import CreateFormModal from '../../CreateEntity';
import Header from '../../Header';
import PodIcon from '../../Icons/podIcon';
import Tabs from '../../organization/tabs/tabs';
import {
  Content,
  ContentContainer,
  HeaderActivity,
  HeaderActivityLink,
  HeaderActivityLinkIcon,
  HeaderButtons,
  HeaderContributors,
  HeaderContributorsAmount,
  HeaderContributorsText,
  HeaderFollowButton,
  HeaderFollowButtonIcon,
  HeaderFollowButtonText,
  HeaderImage,
  HeaderMainBlock,
  HeaderManageSettingsButton,
  HeaderSettingsLockedButton,
  HeaderText,
  HeaderTitle,
  OverviewComponent,
  TokenHeader,
} from '../../organization/wrapper/styles';
import { MoreInfoModal } from '../../profile/modals';
import SideBarComponent from '../../SideBar';

const Wrapper = (props) => {
  const router = useRouter();
  const { children } = props;
  const [minimized, setMinimized] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showPods, setShowPods] = useState(false);
  const [open, setOpen] = useState(false);
  const podBoard = usePodBoard();
  const ORG_PERMISSIONS = {
    MANAGE_SETTINGS: 'manageSettings',
    CONTRIBUTOR: 'contributor',
  };
  const userPermissionsContext = podBoard?.userPermissionsContext;
  const [permissions, setPermissions] = useState(null);
  const [createFormModal, setCreateFormModal] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  const podProfile = podBoard?.pod;
  const toggleCreateFormModal = () => {
    toggleHtmlOverflow();
    setCreateFormModal((prevState) => !prevState);
  };
  const links = podProfile?.links;

  useEffect(() => {
    const orgPermissions = parseUserPermissionContext({
      userPermissionsContext,
      podId: podBoard?.podId,
      orgId: podBoard?.orgId,
    });

    if (
      orgPermissions?.includes(PERMISSIONS.MANAGE_MEMBER) ||
      orgPermissions?.includes(PERMISSIONS.FULL_ACCESS) ||
      orgPermissions?.includes(PERMISSIONS.APPROVE_PAYMENT)
    ) {
      setPermissions(ORG_PERMISSIONS.MANAGE_SETTINGS);
    } else if (userPermissionsContext && orgPermissions) {
      // Normal contributor with no access to admin settings
      setPermissions(ORG_PERMISSIONS.CONTRIBUTOR);
    } else if (!userPermissionsContext) {
      setPermissions(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podBoard?.orgId, userPermissionsContext]);

  return (
    <>
      <PodInviteLinkModal podId={podBoard?.podId} open={openInvite} onClose={() => setOpenInvite(false)} />
      <MoreInfoModal
        open={open && (showUsers || showPods)}
        handleClose={() => {
          document.body.setAttribute('style', '');
          setOpen(false);
        }}
        showUsers={showUsers}
        showPods={showPods}
        name={podProfile?.name}
        podId={podProfile?.id}
      />
      <Header openCreateFormModal={toggleCreateFormModal} />
      <SideBarContext.Provider
        value={{
          minimized,
          setMinimized,
        }}
      >
        <SideBarComponent />
        <CreateFormModal open={createFormModal} toggleOpen={toggleCreateFormModal} />
        <OverviewComponent
          style={{
            paddingLeft: minimized ? 0 : SIDEBAR_WIDTH,
          }}
        >
          <HeaderImage />
          <Content>
            <ContentContainer>
              <TokenHeader>
                <PodIcon
                  color={podProfile?.color}
                  style={{
                    width: '96px',
                    height: '96px',
                    position: 'absolute',
                    borderRadius: '48px',
                    top: '-50px',
                    border: '10px solid #0f0f0f',
                  }}
                />
                <HeaderMainBlock>
                  <HeaderTitle>{podProfile?.name}</HeaderTitle>
                  <HeaderButtons>
                    <HeaderFollowButton
                      style={{
                        visibility: 'hidden',
                      }}
                    >
                      <HeaderFollowButtonText>{shrinkNumber(1234)}</HeaderFollowButtonText>
                      <HeaderFollowButtonIcon src="/images/overview/icon.png" />
                    </HeaderFollowButton>
                    {permissions === ORG_PERMISSIONS.MANAGE_SETTINGS && (
                      <>
                        <HeaderManageSettingsButton
                          onClick={() =>
                            router.push(`/pod/settings/${podBoard?.podId}/general`, undefined, {
                              shallow: true,
                            })
                          }
                        >
                          Settings
                        </HeaderManageSettingsButton>
                      </>
                    )}
                    {permissions === ORG_PERMISSIONS.CONTRIBUTOR && (
                      <HeaderSettingsLockedButton>Settings</HeaderSettingsLockedButton>
                    )}
                    {/* {!permissions && (
                      <HeaderContributeButton>
                        Contribute
                      </HeaderContributeButton>
                    )} */}
                  </HeaderButtons>
                </HeaderMainBlock>
                <HeaderText>{podProfile?.description}</HeaderText>
                <HeaderActivity>
                  {links?.map((link) => (
                    <>
                      {link?.url ? (
                        <HeaderActivityLink href={link?.url} key={link}>
                          {(link?.name || link?.url) && <HeaderActivityLinkIcon />}
                          {link?.name || link?.url}
                        </HeaderActivityLink>
                      ) : null}
                    </>
                  ))}
                  <HeaderContributors
                    onClick={() => {
                      setOpen(true);
                      setShowUsers(true);
                    }}
                  >
                    <HeaderContributorsAmount>{podProfile?.contributorCount}</HeaderContributorsAmount>
                    <HeaderContributorsText>
                      {podProfile?.contributorCount === 1 ? 'Contributor' : 'Contributors'}
                    </HeaderContributorsText>
                  </HeaderContributors>
                  {/* <HeaderPods>
                    <HeaderPodsAmount>{podProfile?.podCount}</HeaderPodsAmount>
                    <HeaderPodsText>Pods</HeaderPodsText>
                  </HeaderPods> */}
                </HeaderActivity>
              </TokenHeader>

              <Tabs>{children}</Tabs>
            </ContentContainer>
          </Content>
        </OverviewComponent>
      </SideBarContext.Provider>
    </>
  );
};

export default Wrapper;
