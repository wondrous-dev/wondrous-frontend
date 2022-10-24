import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useMutation } from '@apollo/client';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import palette from 'theme/palette';
import { ENTITIES_TYPES, GR15DEICategoryName, PERMISSIONS, PRIVACY_LEVEL } from 'utils/constants';
import { parseUserPermissionContext, toggleHtmlOverflow } from 'utils/helpers';
import { usePodBoard } from 'utils/hooks';
import { GET_USER_JOIN_POD_REQUEST, GET_ORG_BY_ID, GET_TASKS_PER_TYPE_FOR_POD } from 'graphql/queries';
import MembershipRequestModal from 'components/RoleModal/MembershipRequestModal';
import PodCurrentRoleModal from 'components/RoleModal/PodCurrentRoleModal';
import TypeSelector from 'components/TypeSelector';
import { SafeImage } from 'components/Common/Image';
import BoardsActivity from 'components/Common/BoardsActivity';
import { RichTextViewer } from 'components/RichText';
import ChooseEntityToCreate from 'components/CreateEntity';
import RolePill from 'components/Common/RolePill';
import BoardLock from 'components/BoardLock';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import {
  ExploreProjectsButton,
  ExploreProjectsButtonFilled,
} from 'components/Common/IntiativesModal/GR15DEIModal/styles';
import { LogoWrapper, OrgLogoWrapper, PodProfileImage } from './styles';
import { DAOEmptyIcon } from '../../Icons/dao';
import { ToggleBoardPrivacyIcon } from '../../Common/PrivateBoardIcon';
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
  OverviewComponent,
  TokenHeader,
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
        style={{
          marginTop: 0,
        }}
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
  const [showUsers, setShowUsers] = useState(false);
  const [podRoleName, setPodRoleName] = useState(null);
  const [showPods, setShowPods] = useState(false);
  const [open, setOpen] = useState(false);
  const [getExistingJoinRequest, { data: getUserJoinRequestData }] = useLazyQuery(GET_USER_JOIN_POD_REQUEST);
  const [getPerTypeTaskCountForPodBoard, { data: tasksPerTypeData }] = useLazyQuery(GET_TASKS_PER_TYPE_FOR_POD);
  const [openJoinRequestModal, setOpenJoinRequestModal] = useState(false);
  const [openCurrentRoleModal, setOpenCurrentRoleModal] = useState(false);
  const [claimedOrRequestedRole, setClaimedOrRequestedRole] = useState(null);
  const userJoinRequest = getUserJoinRequestData?.getUserJoinPodRequest;
  const podBoard = usePodBoard();
  const boardFilters = podBoard?.filters || {};
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
  const [openInvite, setOpenInvite] = useState(false);
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

  const { search } = router.query;
  const links = podProfile?.links;

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
    setPodRoleName(role);

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
  console.log('setOpenCurrentRoleModal', setOpenCurrentRoleModal);
  return (
    <>
      <PodInviteLinkModal podId={podBoard?.podId} open={openInvite} onClose={() => setOpenInvite(false)} />
      <MembershipRequestModal
        podId={podBoard?.podId}
        open={openJoinRequestModal}
        onClose={() => setOpenJoinRequestModal(false)}
        setOpenCurrentRoleModal={setOpenCurrentRoleModal}
        requestingRole={claimedOrRequestedRole}
      />
      <PodCurrentRoleModal
        podId={podBoard?.podId}
        open={openCurrentRoleModal}
        onClose={() => setOpenCurrentRoleModal(false)}
        linkedWallet={loggedInUser?.activeEthAddress}
        currentRoleName={podRoleName}
        setOpenJoinRequestModal={setOpenJoinRequestModal}
        setClaimedOrRequestedRole={setClaimedOrRequestedRole}
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

                <HeaderTitleIcon>
                  <HeaderTitle>{podProfile?.name}</HeaderTitle>
                </HeaderTitleIcon>
                <HeaderButtons>
                  {permissions && podRoleName && (
                    <RoleButtonWrapper>
                      <RoleText>Your Role:</RoleText>
                      <RolePill
                        roleName={podRoleName}
                        onClick={() => {
                          setOpenCurrentRoleModal(true);
                        }}
                      />
                    </RoleButtonWrapper>
                  )}

                  <ToggleBoardPrivacyIcon
                    isPrivate={podBoard?.pod?.privacyLevel !== PRIVACY_LEVEL.public}
                    tooltipTitle={podBoard?.pod?.privacyLevel !== PRIVACY_LEVEL.public ? 'Private' : 'Public'}
                  />
                  {permissions === null && (
                    <>
                      {userJoinRequest?.id ? (
                        <HeaderButton style={{ pointerEvents: 'none' }}>Request sent</HeaderButton>
                      ) : (
                        <HeaderButton
                          reversed
                          onClick={() => {
                            setOpenCurrentRoleModal(true);
                          }}
                        >
                          Join Pod
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
                  isInPodPage
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
