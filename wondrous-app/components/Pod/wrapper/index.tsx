import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box } from '@mui/system';
import apollo from 'services/apollo';
import { useLazyQuery, useMutation } from '@apollo/client';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import palette from 'theme/palette';
import { ENTITIES_TYPES, GR15DEICategoryName, PERMISSIONS, PRIVACY_LEVEL } from 'utils/constants';
import { LIT_PROTOCOL_MESSAGE } from 'utils/web3Constants';
import { parseUserPermissionContext, toggleHtmlOverflow } from 'utils/helpers';
import { usePodBoard, useTokenGating } from 'utils/hooks';
import { useWonderWeb3 } from 'services/web3';
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
import { TokenGatedAndClaimableRoleModal } from 'components/organization/wrapper/TokenGatedAndClaimableRoleModal';
import TypeSelector from 'components/TypeSelector';
import { SafeImage } from 'components/Common/Image';
import BoardsActivity from 'components/Common/BoardsActivity';
import { RichTextViewer } from 'components/RichText';
import ChooseEntityToCreate from 'components/CreateEntity';
import BoardLock from 'components/BoardLock';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import {
  ExploreProjectsButton,
  ExploreProjectsButtonFilled,
} from 'components/Common/IntiativesModal/GR15DEIModal/styles';
import { LogoWrapper, OrgLogoWrapper, PodProfileImage } from './styles';
import { DAOEmptyIcon } from '../../Icons/dao';
import { TokenGatedBoard, ToggleBoardPrivacyIcon } from '../../Common/PrivateBoardIcon';
import { MoreInfoModal } from '../../profile/modals';
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
  HeaderMainBlock,
  HeaderText,
  HeaderTitle,
  RoleButtonWrapper,
  RoleText,
  RoleButton,
  OverviewComponent,
  TokenHeader,
  HeaderImage,
  HeaderTitleIcon,
  HeaderImageWrapper,
  TokenEmptyLogo,
  HeaderButton,
  BoardsSubheaderWrapper,
  InviteButton,
  SettingsButton,
  HeaderGr15Sponsor,
} from '../../organization/wrapper/styles';
import Tabs from '../../organization/tabs/tabs';
import PodIcon from '../../Icons/podIcon';
import { PodInviteLinkModal } from '../../Common/InviteLinkModal/podInviteLink';
import { useMe } from '../../Auth/withAuth';
import DefaultBg from '../../../public/images/overview/background.png';

const ExplorePodGr15 = ({
  onTaskPage,
  onBountyPage,
  hasGr15Tasks,
  hasGr15Bounties,
  podProfile,
  onFilterChange,
  filters,
  exploreGr15TasksAndBounties,
  setExploreGr15TasksAndBounties,
}) => {
  const router = useRouter();
  const ExploreButton = exploreGr15TasksAndBounties ? ExploreProjectsButtonFilled : ExploreProjectsButton;
  if (onTaskPage && !hasGr15Tasks && hasGr15Bounties) {
    return (
      <ExploreButton
        onClick={() => {
          router.push(`/pod/${podProfile?.id}/boards?entity=bounty`, undefined, {
            shallow: true,
          });
        }}
      >
        Explore GR15 Bounties
      </ExploreButton>
    );
  }
  if (onBountyPage && !hasGr15Bounties && hasGr15Tasks) {
    return (
      <ExploreButton
        style={{
          marginTop: 0,
        }}
        onClick={() => {
          router.push(`/pod/${podProfile?.id}/boards?entity=task&cause=${GR15DEICategoryName}`, undefined, {
            shallow: true,
          });
        }}
      >
        Explore GR15 Tasks
      </ExploreButton>
    );
  }
  if (onTaskPage && hasGr15Tasks) {
    return (
      <ExploreButton
        style={{
          marginTop: 0,
        }}
        onClick={() => {
          setExploreGr15TasksAndBounties(!exploreGr15TasksAndBounties);
          onFilterChange({
            ...filters,
            category: exploreGr15TasksAndBounties ? null : GR15DEICategoryName,
          });
        }}
      >
        Explore GR15 tasks
      </ExploreButton>
    );
  }
  if (onBountyPage && hasGr15Bounties) {
    return (
      <ExploreButton
        style={{
          marginTop: 0,
        }}
        onClick={() => {
          setExploreGr15TasksAndBounties(!exploreGr15TasksAndBounties);
          onFilterChange({
            ...filters,
            category: exploreGr15TasksAndBounties ? null : GR15DEICategoryName,
          });
        }}
      >
        Explore GR15 bounties
      </ExploreButton>
    );
  }
  return null;
};

function Wrapper(props) {
  const { children, onSearch, filterSchema, onFilterChange, statuses, userId } = props;

  const router = useRouter();
  const { entity, cause } = router.query;
  const loggedInUser = useMe();
  const wonderWeb3 = useWonderWeb3();
  const [showUsers, setShowUsers] = useState(false);
  const [podRole, setPodRole] = useState(null);
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
  const boardFilters = podBoard?.filters || {};
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
  const [openGR15Modal, setOpenGR15Modal] = useState(false);
  const [exploreGr15TasksAndBounties, setExploreGr15TasksAndBounties] = useState(false);
  const orgHasGr15Tasks = orgData?.getOrgById?.hasGr15TasksAndBounties?.hasGr15Tasks;
  const orgHasGr15Bounties = orgData?.getOrgById?.hasGr15TasksAndBounties?.hasGr15Bounties;
  const podHasGr15Tasks = podProfile?.hasGr15TasksAndBounties?.hasGr15Tasks;
  const podHasGr15Bounties = podProfile?.hasGr15TasksAndBounties?.hasGr15Bounties;
  const isGr15Sponsor = orgHasGr15Tasks || orgHasGr15Bounties;
  const podIsGr15Sponsor = podHasGr15Tasks || podHasGr15Bounties;
  const onTaskPage = entity === ENTITIES_TYPES.TASK || entity === undefined;
  const onBountyPage = entity === ENTITIES_TYPES.BOUNTY;
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
    if (cause === GR15DEICategoryName) {
      onFilterChange({
        category: GR15DEICategoryName,
      });
      setExploreGr15TasksAndBounties(true);
    }
  }, [cause, setExploreGr15TasksAndBounties]);

  useEffect(() => {
    const podPermissions = parseUserPermissionContext({
      userPermissionsContext,
      podId: podBoard?.podId,
      orgId: podBoard?.orgId,
    });
    const role = userPermissionsContext?.podRoles[podBoard?.podId];
    setPodRole(role);

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

  const showFilters = router?.pathname === '/pod/[podId]/boards';
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
      <TokenGatedAndClaimableRoleModal
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
      <ChooseEntityToCreate />
      <OverviewComponent>
        <HeaderImageWrapper>
          {podProfile ? (
            <SafeImage
              src={podProfile?.headerPicture || DefaultBg}
              width="100%"
              height={100}
              layout="fill"
              objectFit="cover"
              useNextImage
            />
          ) : null}
        </HeaderImageWrapper>
        <Content>
          <ContentContainer>
            <TokenHeader>
              <HeaderMainBlock>
                {!isTokenGatingInfoLoading && (
                  <LogoWrapper>
                    <OrgLogoWrapper
                      onClick={() => {
                        router.push(`/organization/${orgData?.getOrgById?.username}/boards`);
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          cursor: 'pointer',
                          ...(isGr15Sponsor && {
                            marginRight: '20px',
                          }),
                        }}
                      >
                        <SafeImage
                          src={orgData?.getOrgById?.profilePicture}
                          placeholderComp={
                            <TokenEmptyLogo>
                              <DAOEmptyIcon />
                            </TokenEmptyLogo>
                          }
                          width={60}
                          height={60}
                          layout="fixed"
                          useNextImage
                          style={{
                            borderRadius: '6px',
                          }}
                        />
                        {isGr15Sponsor && (
                          <>
                            <GR15DEIModal open={openGR15Modal} onClose={() => setOpenGR15Modal(false)} />
                            <GR15DEILogo
                              width="42"
                              height="42"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpenGR15Modal(true);
                              }}
                              style={{
                                top: '0',
                                right: '-20px',
                                position: 'absolute',
                                zIndex: '20',
                              }}
                            />
                          </>
                        )}
                      </div>
                    </OrgLogoWrapper>

                    <ArrowForwardIosIcon style={{ color: palette.grey58, marginLeft: 5 }} />
                    {podProfile?.profilePicture ? (
                      <PodProfileImage src={podProfile?.profilePicture} />
                    ) : (
                      <PodIcon
                        color={podProfile?.color}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 50,
                        }}
                      />
                    )}
                  </LogoWrapper>
                )}

                <HeaderTitleIcon>
                  <HeaderTitle>{podProfile?.name}</HeaderTitle>
                </HeaderTitleIcon>
                <HeaderButtons>
                  {permissions && podRole && (
                    <RoleButtonWrapper>
                      <RoleText>Your Role:</RoleText>
                      <RoleButton>🔑 {podRole}</RoleButton>
                    </RoleButtonWrapper>
                  )}

                  {!isTokenGatingInfoLoading && (
                    <TokenGatedBoard
                      isPrivate={tokenGatingConditions?.getTokenGatingConditionsForOrg?.length > 0}
                      tooltipTitle="Token gating"
                    />
                  )}
                  <ToggleBoardPrivacyIcon
                    isPrivate={podBoard?.pod?.privacyLevel !== PRIVACY_LEVEL.public}
                    tooltipTitle={podBoard?.pod?.privacyLevel !== PRIVACY_LEVEL.public ? 'Private' : 'Public'}
                  />

                  {permissions === null && (
                    <>
                      {joinRequestSent || userJoinRequest?.id ? (
                        <HeaderButton style={{ pointerEvents: 'none' }}>Request sent</HeaderButton>
                      ) : (
                        <HeaderButton reversed onClick={handleJoinPodButtonClick}>
                          Join pod
                        </HeaderButton>
                      )}
                    </>
                  )}
                  {permissions === ORG_PERMISSIONS.MANAGE_SETTINGS && (
                    <>
                      <SettingsButton onClick={() => router.push(`/pod/settings/${podBoard?.podId}/general`)}>
                        Settings
                      </SettingsButton>
                      <InviteButton onClick={() => setOpenInvite(true)}>Invite</InviteButton>
                    </>
                  )}
                </HeaderButtons>
              </HeaderMainBlock>
              <HeaderText>
                <RichTextViewer text={podProfile?.description} />
              </HeaderText>
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
                {podIsGr15Sponsor && (
                  <HeaderGr15Sponsor>
                    <ExplorePodGr15
                      onTaskPage={onTaskPage}
                      onBountyPage={onBountyPage}
                      hasGr15Bounties={podHasGr15Bounties}
                      hasGr15Tasks={podHasGr15Tasks}
                      onFilterChange={onFilterChange}
                      podProfile={podProfile}
                      filters={boardFilters}
                      exploreGr15TasksAndBounties={exploreGr15TasksAndBounties}
                      setExploreGr15TasksAndBounties={setExploreGr15TasksAndBounties}
                    />
                  </HeaderGr15Sponsor>
                )}
                {/* <HeaderPods>
                    <HeaderPodsAmount>{podProfile?.podCount}</HeaderPodsAmount>
                    <HeaderPodsText>Pods</HeaderPodsText>
                  </HeaderPods> */}
              </HeaderActivity>
            </TokenHeader>

            <Tabs page="pod" showMembers={permissions === ORG_PERMISSIONS.MANAGE_SETTINGS}>
              <BoardsSubheaderWrapper>
                {podBoard?.setEntityType && !search && (
                  <TypeSelector
                    tasksPerTypeData={tasksPerTypeData?.getPerTypeTaskCountForPodBoard}
                    setExploreGr15TasksAndBounties={setExploreGr15TasksAndBounties}
                  />
                )}
                {showFilters && (
                  <BoardsActivity
                    onSearch={onSearch}
                    filterSchema={filterSchema}
                    onFilterChange={onFilterChange}
                    statuses={statuses}
                    userId={userId}
                  />
                )}
              </BoardsSubheaderWrapper>

              {children}
            </Tabs>
          </ContentContainer>
        </Content>
      </OverviewComponent>
    </>
  );
}

export default Wrapper;
