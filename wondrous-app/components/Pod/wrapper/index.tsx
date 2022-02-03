import React, { useCallback, useEffect, useState } from 'react';
import { PERMISSIONS, SIDEBAR_WIDTH } from '../../../utils/constants';
import { SideBarContext } from '../../../utils/contexts';

import Header from '../../Header';
import SideBarComponent from '../../SideBar';
import Tabs from '../../organization/tabs/tabs';
import CreateFormModal from '../../CreateEntity';
import { parseUserPermissionContext, shrinkNumber, toggleHtmlOverflow } from '../../../utils/helpers';

import {
  Content,
  ContentContainer,
  HeaderActivity,
  HeaderActivityLink,
  HeaderActivityLinkIcon,
  HeaderButtons,
  HeaderContributeButton,
  HeaderContributors,
  HeaderContributorsAmount,
  HeaderContributorsText,
  HeaderFollowButton,
  HeaderFollowButtonIcon,
  HeaderFollowButtonText,
  HeaderImage,
  HeaderMainBlock,
  HeaderManageSettingsButton,
  HeaderPods,
  HeaderPodsAmount,
  HeaderPodsText,
  HeaderSettingsLockedButton,
  HeaderText,
  HeaderTitle,
  OverviewComponent,
  TokenHeader,
  HeaderInviteButton,
  PlusIconWrapper,
} from '../../organization/wrapper/styles';
import { useOrgBoard, usePodBoard } from '../../../utils/hooks';
import { useQuery } from '@apollo/client';
import { GET_POD_BY_ID } from '../../../graphql/queries/pod';
import { SafeImage } from '../../Common/Image';
import { MoreInfoModal } from '../../profile/modals';
import { PodInviteLinkModal } from '../../Common/InviteLinkModal/podInviteLink';
import PlusIcon from '../../Icons/plus';
import { useRouter } from 'next/router';

const SIDEBAR_LIST_ITEMS = [
  {
    id: 1,
    icon: '/images/sidebar/first.png',
    path: '/',
  },
  {
    id: 2,
    icon: '/images/sidebar/second.png',
    path: '/',
  },
  {
    id: 3,
    icon: '/images/sidebar/third.png',
    path: '/',
  },
];

const MOCK_ORGANIZATION_DATA = {
  amount: 1234567,
};

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
  const [data, setData] = useState(MOCK_ORGANIZATION_DATA);
  const [openInvite, setOpenInvite] = useState(false);
  const { amount } = data;
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
                <SafeImage
                  src={podProfile?.profilePicture}
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
                      <HeaderFollowButtonText>{shrinkNumber(amount)}</HeaderFollowButtonText>
                      <HeaderFollowButtonIcon src="/images/overview/icon.png" />
                    </HeaderFollowButton>
                    {permissions === ORG_PERMISSIONS.MANAGE_SETTINGS && (
                      <>
                        <HeaderInviteButton onClick={() => setOpenInvite(true)}>
                          Invite{' '}
                          <PlusIconWrapper>
                            <PlusIcon height="8" width="8" fill="#fff" />
                          </PlusIconWrapper>
                        </HeaderInviteButton>
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
                    <HeaderActivityLink href={link?.url} key={link}>
                      <HeaderActivityLinkIcon />
                      {link?.name || link?.url}
                    </HeaderActivityLink>
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
