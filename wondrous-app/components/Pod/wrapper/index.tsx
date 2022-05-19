import { useRouter } from 'next/router';
import apollo from 'services/apollo';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useMe } from '../../Auth/withAuth';
import { PERMISSIONS, PRIVACY_LEVEL, SIDEBAR_WIDTH } from 'utils/constants';
import { LIT_PROTOCOL_MESSAGE } from 'utils/web3Constants';
import { SideBarContext } from 'utils/contexts';
import { parseUserPermissionContext, shrinkNumber, toggleHtmlOverflow } from 'utils/helpers';
import { usePodBoard, useTokenGating } from 'utils/hooks';
import { PodInviteLinkModal } from '../../Common/InviteLinkModal/podInviteLink';
import CreateFormModal from '../../CreateEntity';
import Header from '../../Header';
import PodIcon from '../../Icons/podIcon';
import Tabs from '../../organization/tabs/tabs';
import { useWonderWeb3 } from 'services/web3';
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
  HeaderImageDefault,
  HeaderMainBlock,
  HeaderManageSettingsButton,
  HeaderSettingsLockedButton,
  HeaderText,
  HeaderTitle,
  OverviewComponent,
  TokenHeader,
  HeaderInviteButton,
  PlusIconWrapper,
  HeaderTitleIcon,
  HeaderImageWrapper,
  TokenEmptyLogo,
  HeaderButton,
} from '../../organization/wrapper/styles';
import { MoreInfoModal } from '../../profile/modals';
import SideBarComponent from '../../SideBar';
import PlusIcon from '../../Icons/plus';
import { TokenGatedBoard, ToggleBoardPrivacyIcon } from '../../Common/PrivateBoardIcon';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  GET_USER_JOIN_POD_REQUEST,
  GET_TOKEN_GATED_ROLES_FOR_POD,
  LIT_SIGNATURE_EXIST,
  GET_ORG_BY_ID,
  GET_TASKS_PER_TYPE_FOR_POD,
} from 'graphql/queries';
import { MembershipRequestModal } from 'components/organization/wrapper/RequestModal';
import { CREATE_JOIN_POD_REQUEST } from 'graphql/mutations/pod';
import { CREATE_LIT_SIGNATURE } from 'graphql/mutations/tokenGating';
import { TokenGatedRoleModal } from 'components/organization/wrapper/TokenGatedRoleModal';
import TypeSelector from 'components/TypeSelector';
import { SafeImage } from 'components/Common/Image';
import { DAOEmptyIcon } from '../../Icons/dao';
import { LogoWrapper } from './styles';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Grey58 } from 'theme/colors';
const Wrapper = (props) => {
  const router = useRouter();
  const loggedInUser = useMe();
  const wonderWeb3 = useWonderWeb3();
  const { children } = props;
  const [minimized, setMinimized] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showPods, setShowPods] = useState(false);
  const [open, setOpen] = useState(false);
  const [joinRequestSent, setJoinRequestSent] = useState(false);
  const [getExistingJoinRequest, { data: getUserJoinRequestData }] = useLazyQuery(GET_USER_JOIN_POD_REQUEST);
  const [getPerTypeTaskCountForPodBoard, { data: tasksPerTypeData }] = useLazyQuery(GET_TASKS_PER_TYPE_FOR_POD);
  const [createJoinPodRequest] = useMutation(CREATE_JOIN_POD_REQUEST);
  const [openJoinRequestModal, setOpenJoinRequestModal] = useState(false);
  const [notLinkedWalletError, setNotLinkedWalletError] = useState(false);
  const [openGatedRoleModal, setOpenGatedRoleModal] = useState(false);
  const userJoinRequest = getUserJoinRequestData?.getUserJoinPodRequest;
  const podBoard = usePodBoard();
  const [tokenGatingConditions, isTokenGatingInfoLoading] = useTokenGating(podBoard?.orgId);
  const [getOrg, { loading: isOrgLoading, data: orgData }] = useLazyQuery(GET_ORG_BY_ID, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (podBoard?.orgId) {
      getOrg({
        variables: {
          orgId: podBoard?.orgId,
        },
      });
    }
  }, [podBoard?.orgId]);

  const ORG_PERMISSIONS = {
    MANAGE_SETTINGS: 'manageSettings',
    CONTRIBUTOR: 'contributor',
  };
  const userPermissionsContext = podBoard?.userPermissionsContext;
  const [permissions, setPermissions] = useState(undefined);
  const [createFormModal, setCreateFormModal] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  const [tokenGatedRoles, setTokenGatedRoles] = useState([]);
  const podProfile = podBoard?.pod;
  const toggleCreateFormModal = () => {
    toggleHtmlOverflow();
    setCreateFormModal((prevState) => !prevState);
  };
  const { search } = router.query;
  const links = podProfile?.links;
  const handleJoinPodButtonClick = async () => {
    if (loggedInUser && !loggedInUser?.activeEthAddress) {
      setOpenJoinRequestModal(true);
    }
    let apolloResult;
    try {
      apolloResult = await apollo.query({
        query: GET_TOKEN_GATED_ROLES_FOR_POD,
        variables: {
          podId: podBoard?.podId,
        },
      });
    } catch (e) {
      console.error(e);
      setOpenJoinRequestModal(true);
      return;
    }
    const roles = apolloResult?.data?.getTokenGatedRolesForPod;
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
    if (joinRequestSent) {
      setOpenGatedRoleModal(false);
    }
  }, [joinRequestSent]);
  useEffect(() => {
    const podPermissions = parseUserPermissionContext({
      userPermissionsContext,
      podId: podBoard?.podId,
      orgId: podBoard?.orgId,
    });

    if (
      podPermissions?.includes(PERMISSIONS.MANAGE_MEMBER) ||
      podPermissions?.includes(PERMISSIONS.FULL_ACCESS) ||
      podPermissions?.includes(PERMISSIONS.APPROVE_PAYMENT)
    ) {
      setPermissions(ORG_PERMISSIONS.MANAGE_SETTINGS);
    } else if (
      userPermissionsContext &&
      podProfile?.id in userPermissionsContext?.podPermissions &&
      podPermissions &&
      podPermissions
    ) {
      // Normal contributor with no access to admin settings
      setPermissions(ORG_PERMISSIONS.CONTRIBUTOR);
    } else if (
      podBoard?.podId &&
      userPermissionsContext &&
      !(podProfile?.id in userPermissionsContext?.podPermissions)
    ) {
      setPermissions(null);
      getExistingJoinRequest({
        variables: {
          podId: podBoard?.podId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podBoard?.orgId, userPermissionsContext]);

  useEffect(() => {
    if (podBoard?.podId) {
      getPerTypeTaskCountForPodBoard({
        variables: {
          podId: podBoard.podId,
        },
      });
    }
  }, [podBoard?.podId]);

  return (
    <>
      <PodInviteLinkModal podId={podBoard?.podId} open={openInvite} onClose={() => setOpenInvite(false)} />
      <MembershipRequestModal
        podId={podBoard?.podId}
        setJoinRequestSent={setJoinRequestSent}
        sendRequest={createJoinPodRequest}
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
          <HeaderImageWrapper>
            <HeaderImageDefault />
          </HeaderImageWrapper>
          <Content>
            <ContentContainer>
              <TokenHeader>
                <HeaderMainBlock>
                  {!isTokenGatingInfoLoading && (
                    <LogoWrapper>
                      {orgData?.getOrgById?.profilePicture ? (
                        <SafeImage
                          src={orgData?.getOrgById?.profilePicture}
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
                      <ArrowForwardIosIcon style={{ color: Grey58, marginLeft: '5px' }} />
                      <PodIcon
                        color={podProfile?.color}
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50px',
                        }}
                      />
                    </LogoWrapper>
                  )}

                  <HeaderTitleIcon>
                    <HeaderTitle>{podProfile?.name}</HeaderTitle>
                  </HeaderTitleIcon>
                  <HeaderButtons>
                    {!isTokenGatingInfoLoading && (
                      <TokenGatedBoard
                        isPrivate={tokenGatingConditions?.getTokenGatingConditionsForOrg?.length > 0}
                        tooltipTitle={'Token gating'}
                      />
                    )}
                    <ToggleBoardPrivacyIcon
                      isPrivate={podBoard?.pod?.privacyLevel !== PRIVACY_LEVEL.public}
                      tooltipTitle={podBoard?.pod?.privacyLevel !== PRIVACY_LEVEL.public ? 'Private' : 'Public'}
                    />

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
                          <HeaderButton
                            style={{
                              width: 'fit-content',
                            }}
                            onClick={handleJoinPodButtonClick}
                          >
                            <HeaderFollowButtonText>Join pod</HeaderFollowButtonText>
                          </HeaderButton>
                        )}
                      </>
                    )}
                    {permissions === ORG_PERMISSIONS.MANAGE_SETTINGS && (
                      <>
                        <HeaderButton reversed onClick={() => setOpenInvite(true)}>
                          Invite{' '}
                        </HeaderButton>
                        <HeaderButton
                          onClick={() =>
                            router.push(`/pod/settings/${podBoard?.podId}/general`, undefined, {
                              shallow: true,
                            })
                          }
                        >
                          Settings
                        </HeaderButton>
                      </>
                    )}
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

              <Tabs page="pod">
                {!search && !!podBoard?.setEntityType && (
                  <TypeSelector tasksPerTypeData={tasksPerTypeData?.getPerTypeTaskCountForPodBoard} />
                )}
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
