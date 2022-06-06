import React, { useCallback, useEffect, useState } from 'react';
import { PERMISSIONS, PRIVACY_LEVEL, SIDEBAR_WIDTH } from 'utils/constants';
import { SideBarContext } from 'utils/contexts';
import apollo from 'services/apollo';
import { useMe } from '../../Auth/withAuth';
import Image from 'next/image';

import Header from '../../Header';
import SideBarComponent from '../../SideBar';
import Tabs from '../tabs/tabs';
import TypeSelector from 'components/TypeSelector';
import ChooseEntityToCreate from '../../CreateEntity';
import { parseUserPermissionContext, shrinkNumber, toggleHtmlOverflow } from 'utils/helpers';
import BoardsActivity from 'components/Common/BoardsActivity';

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
  HeaderImageDefault,
  HeaderMainBlock,
  HeaderButton,
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
  HeaderTitleIcon,
  HeaderImage,
  HeaderImageWrapper,
  HeaderTag,
  BoardsSubheaderWrapper,
} from './styles';
import { useOrgBoard, useTokenGating } from 'utils/hooks';
import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
import { GET_ORG_BY_ID, GET_USER_JOIN_ORG_REQUEST, GET_TASKS_PER_TYPE } from 'graphql/queries/org';
import { CREATE_JOIN_ORG_REQUEST } from 'graphql/mutations/org';
import { SafeImage } from '../../Common/Image';
import PlusIcon from '../../Icons/plus';
import { OrgInviteLinkModal } from '../../Common/InviteLinkModal/OrgInviteLink';
import { MoreInfoModal } from '../../profile/modals';
import { Router, useRouter } from 'next/router';
import { NoLogoDAO } from '../../SideBar/styles';
import { DAOEmptyIcon, DAOIcon } from '../../Icons/dao';
import { SOCIAL_MEDIA_DISCORD, SOCIAL_MEDIA_TWITTER, SOCIAL_OPENSEA, SOCIAL_MEDIA_LINKEDIN } from 'utils/constants';
import { LIT_PROTOCOL_MESSAGE } from 'utils/web3Constants';
import { useWonderWeb3 } from 'services/web3';
import TwitterPurpleIcon from '../../Icons/twitterPurple';
import LinkedInIcon from '../../Icons/linkedIn';
import OpenSeaIcon from '../../Icons/openSea';
import LinkBigIcon from '../../Icons/link';
import { DiscordIcon } from '../../Icons/discord';
import { MembershipRequestModal } from './RequestModal';
import { TokenGatedBoard, ToggleBoardPrivacyIcon } from '../../Common/PrivateBoardIcon';
import { GET_TOKEN_GATED_ROLES_FOR_ORG, LIT_SIGNATURE_EXIST } from 'graphql/queries';
import { CREATE_LIT_SIGNATURE } from 'graphql/mutations/tokenGating';
import { TokenGatedRoleModal } from 'components/organization/wrapper/TokenGatedRoleModal';

const MOCK_ORGANIZATION_DATA = {
  amount: 1234567,
};

const Wrapper = (props) => {
  const { children, orgData, onSearch, filterSchema, onFilterChange, statuses, podIds, userId } = props;
  const wonderWeb3 = useWonderWeb3();
  const loggedInUser = useMe();
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
  const [getPerTypeTaskCountForOrgBoard, { data: tasksPerTypeData }] = useLazyQuery(GET_TASKS_PER_TYPE);
  const userPermissionsContext = orgBoard?.userPermissionsContext;
  const [permissions, setPermissions] = useState(undefined);
  const [createFormModal, setCreateFormModal] = useState(false);
  const [data, setData] = useState(MOCK_ORGANIZATION_DATA);
  const [tokenGatedRoles, setTokenGatedRoles] = useState([]);
  const [openInvite, setOpenInvite] = useState(false);
  const { amount } = data;
  const [joinRequestSent, setJoinRequestSent] = useState(false);
  const [openJoinRequestModal, setOpenJoinRequestModal] = useState(false);
  const [notLinkedWalletError, setNotLinkedWalletError] = useState(false);
  const [openGatedRoleModal, setOpenGatedRoleModal] = useState(false);
  const [getExistingJoinRequest, { data: getUserJoinRequestData }] = useLazyQuery(GET_USER_JOIN_ORG_REQUEST);
  const [tokenGatingConditions, isLoading] = useTokenGating(orgBoard?.orgId);

  const toggleCreateFormModal = () => {
    toggleHtmlOverflow();
    setCreateFormModal((prevState) => !prevState);
  };
  const orgProfile = orgData;
  const links = orgProfile?.links;
  const router = useRouter();
  const userJoinRequest = getUserJoinRequestData?.getUserJoinOrgRequest;
  const { search } = router.query;
  const handleJoinOrgButtonClick = async () => {
    if (loggedInUser && !loggedInUser?.activeEthAddress) {
      setOpenJoinRequestModal(true);
    }
    let apolloResult;
    try {
      apolloResult = await apollo.query({
        query: GET_TOKEN_GATED_ROLES_FOR_ORG,
        variables: {
          orgId: orgBoard?.orgId,
        },
      });
    } catch (e) {
      console.error(e);
      setOpenJoinRequestModal(true);
      return;
    }
    const roles = apolloResult?.data?.getTokenGatedRolesForOrg;
    if (!roles || roles?.length === 0) {
      setOpenJoinRequestModal(true);
      return;
    }
    if (
      wonderWeb3.address &&
      loggedInUser?.activeEthAddress &&
      wonderWeb3.toChecksumAddress(wonderWeb3.address) != wonderWeb3.toChecksumAddress(loggedInUser?.activeEthAddress)
    ) {
      setOpenJoinRequestModal(true);
      setNotLinkedWalletError(true);
      return;
    }
    let litSignatureExistResult;
    try {
      litSignatureExistResult = await apollo.query({
        query: LIT_SIGNATURE_EXIST,
      });
    } catch (e) {
      console.error(e);
      setOpenJoinRequestModal(true);
      return;
    }
    const litSignatureExist = litSignatureExistResult?.data?.litSignatureExist;
    if (!litSignatureExist?.exist) {
      // FIXME make sure  account is the correct account
      try {
        const signedMessage = await wonderWeb3.signMessage(LIT_PROTOCOL_MESSAGE);
        await apollo.mutate({
          mutation: CREATE_LIT_SIGNATURE,
          variables: {
            input: {
              signature: signedMessage,
              signingAddress: wonderWeb3.address,
            },
          },
        });
      } catch (e) {
        console.error(e);
        setOpenJoinRequestModal(true);
        return;
      }
    }
    setTokenGatedRoles(roles);
    setOpenGatedRoleModal(true);
  };

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

  useEffect(() => {
    if (orgBoard?.orgId) {
      getPerTypeTaskCountForOrgBoard({
        variables: {
          orgId: orgBoard?.orgId,
        },
      });
    }
  }, [orgBoard?.orgId]);

  return (
    <>
      <OrgInviteLinkModal orgId={orgBoard?.orgId} open={openInvite} onClose={() => setOpenInvite(false)} />
      <MembershipRequestModal
        orgId={orgBoard?.orgId}
        setJoinRequestSent={setJoinRequestSent}
        sendRequest={createJoinOrgRequest}
        open={openJoinRequestModal}
        onClose={() => setOpenJoinRequestModal(false)}
        notLinkedWalletError={notLinkedWalletError}
        linkedWallet={loggedInUser?.activeEthAddress}
      />
      <TokenGatedRoleModal
        open={openGatedRoleModal}
        onClose={() => setOpenGatedRoleModal(false)}
        tokenGatedRoles={tokenGatedRoles}
        setOpenJoinRequestModal={setOpenJoinRequestModal}
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
        <ChooseEntityToCreate open={createFormModal} toggleOpen={toggleCreateFormModal} />
        <OverviewComponent
          style={{
            paddingLeft: minimized ? 0 : SIDEBAR_WIDTH,
          }}
        >
          <HeaderImageWrapper>
            {orgProfile?.headerPicture ? <HeaderImage src={orgProfile?.headerPicture} /> : <HeaderImageDefault />}
          </HeaderImageWrapper>

          <Content>
            <ContentContainer>
              <TokenHeader>
                <HeaderMainBlock>
                  {orgProfile?.profilePicture ? (
                    <SafeImage
                      src={orgProfile?.profilePicture}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '6px',
                      }}
                    />
                  ) : (
                    <TokenEmptyLogo>
                      <DAOEmptyIcon />
                    </TokenEmptyLogo>
                  )}
                  <HeaderTitleIcon>
                    <HeaderTitle>{orgProfile?.name}</HeaderTitle>
                    <HeaderTag>@{orgProfile?.username}</HeaderTag>
                  </HeaderTitleIcon>
                  <HeaderButtons>
                    {!isLoading && (
                      <TokenGatedBoard
                        isPrivate={tokenGatingConditions?.getTokenGatingConditionsForOrg?.length > 0}
                        tooltipTitle={'Token gating'}
                      />
                    )}
                    <ToggleBoardPrivacyIcon
                      isPrivate={orgData?.privacyLevel !== PRIVACY_LEVEL.public}
                      tooltipTitle={
                        orgData?.privacyLevel !== PRIVACY_LEVEL.public ? 'Private organization' : 'Public organization'
                      }
                    />
                    {permissions === null && (
                      <>
                        {joinRequestSent || userJoinRequest?.id ? (
                          <HeaderButton style={{ pointerEvents: 'none' }}>Request sent</HeaderButton>
                        ) : (
                          <HeaderButton reversed onClick={handleJoinOrgButtonClick}>
                            Join org
                          </HeaderButton>
                        )}
                      </>
                    )}
                    {permissions === ORG_PERMISSIONS.MANAGE_SETTINGS && (
                      <>
                        <HeaderButton
                          onClick={() => {
                            router.push(`/organization/settings/${orgBoard?.orgId}/general`, undefined, {
                              shallow: true,
                            });
                          }}
                        >
                          Settings
                        </HeaderButton>
                        <HeaderButton reversed onClick={() => setOpenInvite(true)}>
                          Invite{' '}
                        </HeaderButton>
                      </>
                    )}
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
              <Tabs>
                <BoardsSubheaderWrapper>
                  {orgBoard?.setEntityType && !search && (
                    <TypeSelector tasksPerTypeData={tasksPerTypeData?.getPerTypeTaskCountForOrgBoard} />
                  )}
                  {!!filterSchema && (
                    <BoardsActivity
                      onSearch={onSearch}
                      filterSchema={filterSchema}
                      onFilterChange={onFilterChange}
                      statuses={statuses}
                      podIds={podIds}
                      userId={userId}
                    />
                  )}
                </BoardsSubheaderWrapper>

                {children}
              </Tabs>
            </ContentContainer>
          </Content>
        </OverviewComponent>
      </SideBarContext.Provider>
    </>
  );
};

export default Wrapper;
