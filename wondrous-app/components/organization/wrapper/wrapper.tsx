import React, { useCallback, useEffect, useState } from 'react';
import { PERMISSIONS, SIDEBAR_WIDTH } from '../../../utils/constants';
import { SideBarContext } from '../../../utils/contexts';
import Image from 'next/image';

import Header from '../../Header';
import SideBarComponent from '../../SideBar';
import Tabs from '../tabs/tabs';
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
  TokenLogo,
  HeaderInviteButton,
  PlusIconWrapper,
  TokenEmptyLogo,
} from './styles';
import { useOrgBoard } from '../../../utils/hooks';
import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
import { GET_ORG_BY_ID, GET_USER_JOIN_ORG_REQUEST } from '../../../graphql/queries/org';
import { CREATE_JOIN_ORG_REQUEST } from '../../../graphql/mutations/org';
import { SafeImage } from '../../Common/Image';
import PlusIcon from '../../Icons/plus';
import { OrgInviteLinkModal } from '../../Common/InviteLinkModal/OrgInviteLink';
import { MoreInfoModal } from '../../profile/modals';
import { Router, useRouter } from 'next/router';
import { NoLogoDAO } from '../../SideBar/styles';
import { DAOEmptyIcon, DAOIcon } from '../../Icons/dao';
import {
  SOCIAL_MEDIA_DISCORD,
  SOCIAL_MEDIA_TWITTER,
  SOCIAL_OPENSEA,
  SOCIAL_MEDIA_LINKEDIN,
} from '../../../utils/constants';
import TwitterPurpleIcon from '../../Icons/twitterPurple';
import LinkedInIcon from '../../Icons/linkedIn';
import OpenSeaIcon from '../../Icons/openSea';
import LinkBigIcon from '../../Icons/link';
import { DiscordIcon } from '../../Icons/discord';
import { MembershipRequestModal } from './RequestModal';

const MOCK_ORGANIZATION_DATA = {
  amount: 1234567,
};

const Wrapper = (props) => {
  const { children, orgData } = props;
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showPods, setShowPods] = useState(false);
  const orgBoard = useOrgBoard();
  const ORG_PERMISSIONS = {
    MANAGE_SETTINGS: 'manageSettings',
    CONTRIBUTOR: 'contributor',
  };

  const [createJoinOrgRequest] = useMutation(CREATE_JOIN_ORG_REQUEST);

  const userPermissionsContext = orgBoard?.userPermissionsContext;
  const [permissions, setPermissions] = useState(undefined);
  const [createFormModal, setCreateFormModal] = useState(false);
  const [data, setData] = useState(MOCK_ORGANIZATION_DATA);
  const [openInvite, setOpenInvite] = useState(false);
  const { amount } = data;
  const [joinRequestSent, setJoinRequestSent] = useState(false);
  const [openJoinRequestModal, setOpenJoinRequestModal] = useState(false);
  const [getExistingJoinRequest, { data: getUserJoinRequestData }] = useLazyQuery(GET_USER_JOIN_ORG_REQUEST);
  const toggleCreateFormModal = () => {
    toggleHtmlOverflow();
    setCreateFormModal((prevState) => !prevState);
  };
  const orgProfile = orgData;
  const links = orgProfile?.links;
  const router = useRouter();
  const userJoinRequest = getUserJoinRequestData?.getUserJoinOrgRequest;
  useEffect(() => {
    const orgPermissions = parseUserPermissionContext({
      userPermissionsContext,
      orgId: orgBoard?.orgId,
    });

    if (
      orgPermissions?.includes(PERMISSIONS.MANAGE_MEMBER) ||
      orgPermissions?.includes(PERMISSIONS.FULL_ACCESS) ||
      orgPermissions?.includes(PERMISSIONS.APPROVE_PAYMENT)
    ) {
      setPermissions(ORG_PERMISSIONS.MANAGE_SETTINGS);
    } else if (
      userPermissionsContext?.orgPermissions &&
      orgProfile?.id in userPermissionsContext?.orgPermissions &&
      orgPermissions
    ) {
      // Normal contributor with no access to admin settings
      setPermissions(ORG_PERMISSIONS.CONTRIBUTOR);
    } else if (
      orgBoard?.orgId &&
      userPermissionsContext &&
      !(orgProfile?.id in userPermissionsContext?.orgPermissions)
    ) {
      setPermissions(null);
      getExistingJoinRequest({
        variables: {
          orgId: orgBoard?.orgId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgBoard?.orgId, userPermissionsContext]);

  return (
    <>
      <OrgInviteLinkModal orgId={orgBoard?.orgId} open={openInvite} onClose={() => setOpenInvite(false)} />
      <MembershipRequestModal
        orgId={orgBoard?.orgId}
        setJoinRequestSent={setJoinRequestSent}
        sendRequest={createJoinOrgRequest}
        open={openJoinRequestModal}
        onClose={() => setOpenJoinRequestModal(false)}
      />
      <MoreInfoModal
        open={open && (showUsers || showPods)}
        handleClose={() => {
          document.body.setAttribute('style', '');
          setShowPods(false);
          setShowUsers(false);
          setOpen(false);
        }}
        showUsers={showUsers}
        showPods={showPods}
        name={orgProfile?.name}
        orgId={orgBoard?.orgId}
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
          <HeaderImage>
            <Image
              alt="Background"
              src="/images/overview/background.png"
              layout="fill"
              objectFit="cover"
              quality={80}
            />
          </HeaderImage>
          <Content>
            <ContentContainer>
              <TokenHeader>
                {orgProfile?.profilePicture ? (
                  <SafeImage
                    src={orgProfile?.profilePicture}
                    style={{
                      width: '96px',
                      height: '96px',
                      position: 'absolute',
                      borderRadius: '48px',
                      top: '-50px',
                      border: '10px solid #0f0f0f',
                    }}
                  />
                ) : (
                  <TokenEmptyLogo>
                    <DAOEmptyIcon />
                  </TokenEmptyLogo>
                )}
                <HeaderMainBlock>
                  <HeaderTitle>{orgProfile?.name}</HeaderTitle>
                  <HeaderButtons>
                    <HeaderFollowButton
                      style={{
                        visibility: 'hidden',
                      }}
                    >
                      <HeaderFollowButtonText>{shrinkNumber(amount)}</HeaderFollowButtonText>
                      <HeaderFollowButtonIcon src="/images/overview/icon.png" />
                    </HeaderFollowButton>
                    {permissions === null && (
                      <>
                        {joinRequestSent || userJoinRequest?.id ? (
                          <HeaderSettingsLockedButton
                            style={{
                              width: 'fit-content',
                              visibility: 'visible',
                            }}
                          >
                            Request sent
                          </HeaderSettingsLockedButton>
                        ) : (
                          <HeaderManageSettingsButton
                            style={{
                              width: 'fit-content',
                            }}
                            onClick={() => {
                              setOpenJoinRequestModal(true);
                            }}
                          >
                            <HeaderFollowButtonText>Request to join</HeaderFollowButtonText>
                          </HeaderManageSettingsButton>
                        )}
                      </>
                    )}
                    {permissions === ORG_PERMISSIONS.MANAGE_SETTINGS && (
                      <>
                        <HeaderInviteButton onClick={() => setOpenInvite(true)}>
                          Invite{' '}
                          <PlusIconWrapper>
                            <PlusIcon height="8" width="8" fill="#fff" />
                          </PlusIconWrapper>
                        </HeaderInviteButton>
                        <HeaderManageSettingsButton
                          onClick={() => {
                            router.push(`/organization/settings/${orgBoard?.orgId}/general`, undefined, {
                              shallow: true,
                            });
                          }}
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
                <HeaderText>{orgProfile?.description}</HeaderText>
                <HeaderActivity>
                  <HeaderContributors
                    onClick={() => {
                      setOpen(true);
                      setShowUsers(true);
                    }}
                  >
                    <HeaderContributorsAmount>{orgProfile?.contributorCount}</HeaderContributorsAmount>
                    <HeaderContributorsText>Contributors</HeaderContributorsText>
                  </HeaderContributors>
                  <HeaderPods
                    onClick={() => {
                      setOpen(true);
                      setShowPods(true);
                    }}
                  >
                    <HeaderPodsAmount>{orgProfile?.podCount}</HeaderPodsAmount>
                    <HeaderPodsText>Pods</HeaderPodsText>
                  </HeaderPods>
                  {links?.map((link, index) => {
                    if (link.type === 'link') {
                      return (
                        <HeaderActivityLink href={link?.url} key={index} target="_blank">
                          <HeaderActivityLinkIcon />
                          {link?.name || link?.url}
                        </HeaderActivityLink>
                      );
                    }
                  })}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {links?.map((link, index) => {
                      if (link.type !== 'link') {
                        let SocialIcon = null;
                        switch (link.type) {
                          case SOCIAL_MEDIA_DISCORD:
                            SocialIcon = DiscordIcon;
                            break;
                          case SOCIAL_MEDIA_TWITTER:
                            SocialIcon = TwitterPurpleIcon;
                            break;
                          case SOCIAL_MEDIA_LINKEDIN:
                            SocialIcon = LinkedInIcon;
                            break;
                          case SOCIAL_OPENSEA:
                            SocialIcon = OpenSeaIcon;
                            break;
                        }
                        if (SocialIcon) {
                          return (
                            <HeaderActivityLink href={link?.url} key={index} target="_blank">
                              <SocialIcon
                                style={{
                                  width: '20px',
                                  height: '20px',
                                }}
                              />
                            </HeaderActivityLink>
                          );
                        }
                        return null;
                      }
                    })}
                  </div>
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
