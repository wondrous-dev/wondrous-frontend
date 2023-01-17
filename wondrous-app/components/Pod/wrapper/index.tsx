import TaskViewModalWatcher from 'components/Common/TaskViewModal/TaskViewModalWatcher';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useMutation } from '@apollo/client';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import palette from 'theme/palette';
import {
  ENTITIES_TYPES,
  GR15DEICategoryName,
  PERMISSIONS,
  PRIVACY_LEVEL,
  HEADER_ASPECT_RATIO,
  EMPTY_RICH_TEXT_STRING,
} from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { usePodBoard } from 'utils/hooks';
import { AspectRatio } from 'react-aspect-ratio';
import DEFAULT_HEADER from 'public/images/overview/background.png';
import { GET_USER_JOIN_POD_REQUEST, GET_ORG_BY_ID, GET_TASKS_PER_TYPE_FOR_POD } from 'graphql/queries';
import MembershipRequestModal from 'components/RoleModal/MembershipRequestModal';
import PodCurrentRoleModal from 'components/RoleModal/PodCurrentRoleModal';
import TypeSelector from 'components/TypeSelector';
import { SafeImage } from 'components/Common/Image';
import BoardsActivity from 'components/Common/BoardsActivity';
import { RichTextViewer } from 'components/RichText';
import ChooseEntityToCreate from 'components/CreateEntity';
import RolePill from 'components/Common/RolePill';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import {
  ExploreProjectsButton,
  ExploreProjectsButtonFilled,
} from 'components/Common/IntiativesModal/GR15DEIModal/styles';
import MoreInfoModal from 'components/profile/modals';
import MembersIcon from 'components/Icons/members';
import HeaderSocialLinks from 'components/organization/wrapper/HeaderSocialLinks';
import { Button as PrimaryButton } from 'components/Button';
import { IsLaptopContext, IsTabletContext } from 'utils/contexts';
import Box from '@mui/material/Box';
import { LogoWrapper, PodProfileImage } from './styles';
import { DAOEmptyIcon } from '../../Icons/dao';
import { ToggleBoardPrivacyIcon } from '../../Common/PrivateBoardIcon';
import {
  Content,
  ContentContainer,
  Container,
  HeaderTopRightContainer,
  HeaderContributors,
  HeaderContributorsAmount,
  HeaderContributorsText,
  HeaderMainBlock,
  HeaderText,
  HeaderTitle,
  RoleButtonWrapper,
  OverviewComponent,
  TokenHeader,
  HeaderTopLeftContainer,
  HeaderImageWrapper,
  TokenEmptyLogo,
  BoardsSubheaderWrapper,
  MemberPodIconBackground,
  PrivacyContainer,
  PrivacyText,
} from '../../organization/wrapper/styles';
import PodIcon from '../../Icons/podIcon';
import { PodInviteLinkModal } from '../../Common/InviteLinkModal/podInviteLink';
import { useMe } from '../../Auth/withAuth';

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
  const isTablet = useContext(IsTabletContext);
  const isLaptop = useContext(IsLaptopContext);
  const { entity, cause } = router.query;
  const loggedInUser = useMe();
  const [showUsers, setShowUsers] = useState(false);
  const [podRoleName, setPodRoleName] = useState(null);
  const [showPods, setShowPods] = useState(false);
  const [moreInfoModalOpen, setMoreInfoModalOpen] = useState(false);
  const [getExistingJoinRequest, { data: getUserJoinRequestData }] = useLazyQuery(GET_USER_JOIN_POD_REQUEST, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });
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

  return (
    <>
      <TaskViewModalWatcher />
      <PodInviteLinkModal podId={podBoard?.podId} open={openInvite} onClose={() => setOpenInvite(false)} />
      {openJoinRequestModal && (
        <MembershipRequestModal
          podId={podBoard?.podId}
          open={openJoinRequestModal}
          onClose={() => setOpenJoinRequestModal(false)}
          setOpenCurrentRoleModal={setOpenCurrentRoleModal}
          requestingRole={claimedOrRequestedRole}
        />
      )}
      {openCurrentRoleModal && (
        <PodCurrentRoleModal
          podId={podBoard?.podId}
          open={openCurrentRoleModal}
          onClose={() => setOpenCurrentRoleModal(false)}
          linkedWallet={loggedInUser?.activeEthAddress}
          currentRoleName={podRoleName}
          setOpenJoinRequestModal={setOpenJoinRequestModal}
          setClaimedOrRequestedRole={setClaimedOrRequestedRole}
        />
      )}
      {moreInfoModalOpen && (
        <MoreInfoModal
          open={moreInfoModalOpen && (showUsers || showPods)}
          handleClose={() => {
            document.body.setAttribute('style', '');
            setMoreInfoModalOpen(false);
          }}
          showUsers={showUsers}
          showPods={showPods}
          name={podProfile?.name}
          podId={podProfile?.id}
        />
      )}
      <ChooseEntityToCreate />
      <OverviewComponent>
        <HeaderImageWrapper>
          <AspectRatio ratio={HEADER_ASPECT_RATIO} style={{ maxHeight: 175 }}>
            {podProfile ? (
              <SafeImage
                src={podProfile?.headerPicture || DEFAULT_HEADER}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                }}
                fill
                useNextImage
                alt="Pod header"
              />
            ) : null}
          </AspectRatio>
        </HeaderImageWrapper>
        <Content>
          <ContentContainer>
            <TokenHeader>
              <HeaderMainBlock isTablet={isTablet}>
                <Box
                  sx={{
                    display: 'flex',
                    marginBottom: isTablet ? '10px' : 0,
                  }}
                >
                  <LogoWrapper>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`/organization/${orgData?.getOrgById?.username}/home`);
                      }}
                      style={{
                        position: 'relative',
                        cursor: 'pointer',
                        ...(isGr15Sponsor && {
                          marginRight: '15px',
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
                        width={36}
                        height={36}
                        useNextImage
                        alt="Org logo"
                        style={{
                          borderRadius: '6px',
                        }}
                      />
                      {isGr15Sponsor && (
                        <>
                          <GR15DEIModal open={openGR15Modal} onClose={() => setOpenGR15Modal(false)} />
                          <GR15DEILogo
                            width="25"
                            height="25"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenGR15Modal(true);
                            }}
                            style={{
                              top: '0',
                              right: '-10px',
                              position: 'absolute',
                              zIndex: '25',
                            }}
                          />
                        </>
                      )}
                    </div>

                    <ArrowForwardIosIcon style={{ color: palette.grey58 }} />
                    {podProfile?.profilePicture ? (
                      <PodProfileImage src={podProfile?.profilePicture} />
                    ) : (
                      <PodIcon
                        color={podProfile?.color}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 50,
                        }}
                      />
                    )}
                  </LogoWrapper>
                  {/* </Box> */}

                  <HeaderTopLeftContainer>
                    <HeaderTitle>{podProfile?.name}</HeaderTitle>
                    <PrivacyContainer>
                      <PrivacyText>{orgData?.privacyLevel !== PRIVACY_LEVEL.public ? 'Private' : 'Public'}</PrivacyText>
                    </PrivacyContainer>
                    {podIsGr15Sponsor && (
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
                    )}
                  </HeaderTopLeftContainer>
                </Box>

                <HeaderTopRightContainer>
                  <HeaderContributors
                    onClick={() => {
                      setMoreInfoModalOpen(true);
                      setShowUsers(true);
                    }}
                  >
                    <MemberPodIconBackground>
                      <MembersIcon stroke={palette.blue20} />
                    </MemberPodIconBackground>
                    <HeaderContributorsAmount>{podProfile?.contributorCount} </HeaderContributorsAmount>
                    <HeaderContributorsText>Members</HeaderContributorsText>
                  </HeaderContributors>

                  {permissions && podRoleName && (
                    <RoleButtonWrapper>
                      <RolePill
                        onClick={() => {
                          setOpenCurrentRoleModal(true);
                        }}
                        roleName={podRoleName}
                      />
                    </RoleButtonWrapper>
                  )}
                  {permissions === null && (
                    <>
                      {userJoinRequest?.id ? (
                        <PrimaryButton
                          height={36}
                          width="max-content"
                          variant="outlined"
                          color="purple"
                          succeeded
                          paddingX={15}
                          buttonTheme={{ fontWeight: '500', fontSize: '14px' }}
                        >
                          Request sent
                        </PrimaryButton>
                      ) : (
                        <PrimaryButton
                          height={36}
                          paddingX={15}
                          width="max-content"
                          buttonTheme={{ fontWeight: '500', fontSize: '14px' }}
                          onClick={() => {
                            setOpenCurrentRoleModal(true);
                          }}
                        >
                          Join pod
                        </PrimaryButton>
                      )}
                    </>
                  )}
                </HeaderTopRightContainer>
              </HeaderMainBlock>
              {/* <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px', gap: 10 }}> */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: isTablet ? '60px' : '15px',
                  gap: 10,
                  justifyContent: isTablet ? 'center' : 'flex-start',
                  textAlign: isTablet ? 'center' : 'left',
                }}
              >
                {podProfile?.description && podProfile?.description !== EMPTY_RICH_TEXT_STRING ? (
                  <HeaderText as="div">
                    <RichTextViewer text={podProfile?.description} />
                  </HeaderText>
                ) : (
                  <div style={{ height: 10 }} />
                )}
                <HeaderSocialLinks links={podProfile?.links} />
              </div>
            </TokenHeader>

            <Container>
              <BoardsSubheaderWrapper isLaptop={isLaptop}>
                {podBoard?.setEntityType && !search && (
                  <TypeSelector
                    tasksPerTypeData={tasksPerTypeData?.getPerTypeTaskCountForPodBoard}
                    setExploreGr15TasksAndBounties={setExploreGr15TasksAndBounties}
                  />
                )}
                {!!filterSchema && (
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
            </Container>
          </ContentContainer>
        </Content>
      </OverviewComponent>
    </>
  );
}

export default Wrapper;
