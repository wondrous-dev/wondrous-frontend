import TaskActions from "components/TaskActions";
import React, { useEffect, useState, memo, Suspense } from 'react';
import dynamic from 'next/dynamic';

import {
  ENTITIES_TYPES,
  PERMISSIONS,
  PRIVACY_LEVEL,
  SOCIAL_MEDIA_DISCORD,
  SOCIAL_MEDIA_TWITTER,
  SOCIAL_OPENSEA,
  SOCIAL_MEDIA_LINKEDIN,
  GR15DEICategoryName,
  BOUNTY_TYPE,
  HEADER_ASPECT_RATIO,
} from 'utils/constants';
import apollo from 'services/apollo';
import { Box } from '@mui/material';
import TypeSelector from 'components/TypeSelector';
import { parseUserPermissionContext, removeUrlStart } from 'utils/helpers';
import BoardsActivity from 'components/Common/BoardsActivity';
import DEFAULT_HEADER from 'public/images/overview/background.png';
import { AspectRatio } from 'react-aspect-ratio';

import usePrevious, { useOrgBoard } from 'utils/hooks';
import { useLazyQuery } from '@apollo/client';
import { GET_USER_JOIN_ORG_REQUEST, GET_TASKS_PER_TYPE } from 'graphql/queries/org';
import { useRouter } from 'next/router';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import {
  ExploreProjectsButton,
  ExploreProjectsButtonFilled,
} from 'components/Common/IntiativesModal/GR15DEIModal/styles';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import { RichTextViewer } from 'components/RichText';
import RolePill from 'components/Common/RolePill';
import { ExploreGr15TasksAndBountiesContext } from 'utils/contexts';
import { ToggleBoardPrivacyIcon } from '../../Common/PrivateBoardIcon';
import { DiscordIcon } from '../../Icons/discord';
import OpenSeaIcon from '../../Icons/openSea';
import LinkedInIcon from '../../Icons/linkedIn';
import { DAOEmptyIcon } from '../../Icons/dao';
import { SafeImage } from '../../Common/Image';
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
  HeaderButton,
  HeaderPods,
  HeaderPodsAmount,
  HeaderPodsText,
  HeaderText,
  HeaderTitle,
  TokenHeader,
  TokenEmptyLogo,
  HeaderTitleIcon,
  HeaderImageWrapper,
  HeaderTag,
  BoardsSubheaderWrapper,
  RoleButtonWrapper,
  RoleText,
  Container,
  SettingsButton,
  InviteButton,
  HeaderGr15Sponsor,
} from './styles';
import { useMe } from '../../Auth/withAuth';
import TwitterPurpleIcon from '../../Icons/twitterPurple';

const OrgInviteLinkModal = dynamic(() => import('../../Common/InviteLinkModal/OrgInviteLink'), { suspense: true });
const MembershipRequestModal = dynamic(() => import('components/RoleModal/MembershipRequestModal'), { suspense: true });
const CurrentRoleModal = dynamic(() => import('components/RoleModal/CurrentRoleModal'), { suspense: true });
const ChooseEntityToCreate = dynamic(() => import('components/CreateEntity'), { suspense: true });
const MoreInfoModal = dynamic(() => import('components/profile/modals'), { suspense: true });

const ORG_PERMISSIONS = {
  MANAGE_SETTINGS: 'manageSettings',
  CONTRIBUTOR: 'contributor',
};

const ExploreOrgGr15 = ({
  onTaskPage,
  onBountyPage,
  hasGr15Tasks,
  hasGr15Bounties,
  orgProfile,
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
          marginRight: '8px',
        }}
        onClick={() => {
          router.push(`/organization/${orgProfile?.username}/boards?entity=${BOUNTY_TYPE}`, undefined, {
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
          marginRight: '8px',
        }}
        onClick={() => {
          router.push(
            `/organization/${orgProfile?.username}/boards?entity=task&cause=${GR15DEICategoryName}`,
            undefined,
            {
              shallow: true,
            }
          );
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
          marginRight: '8px',
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
          marginRight: '8px',
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
  const {
    children,
    orgData,
    onSearch,
    filterSchema,
    onFilterChange,
    statuses,
    podIds,
    userId,
    renderSharedHeader = null,
    isCollabWorkspace = false,
    inviteButtonSettings = null,
  } = props;

  console.log('-----Wrapper:render');

  useEffect(() => {
    console.log('-----Wrapper:---->mounted');
    return () => console.log('-----Wrapper:<-----unmounted AAAA');
  }, []);

  const mainPath = isCollabWorkspace ? 'collaboration' : 'organization';

  const loggedInUser = useMe();
  const [moreInfoModalOpen, setMoreInfoModalOpen] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showPods, setShowPods] = useState(false);
  const orgBoard = useOrgBoard();

  const [getPerTypeTaskCountForOrgBoard, { data: tasksPerTypeData }] = useLazyQuery(GET_TASKS_PER_TYPE);

  const userPermissionsContext = orgBoard?.userPermissionsContext;
  const [orgRoleName, setOrgRoleName] = useState(null);
  const [permissions, setPermissions] = useState(undefined);
  const [openInvite, setOpenInvite] = useState(false);
  const [openJoinRequestModal, setOpenJoinRequestModal] = useState(false);
  const [openCurrentRoleModal, setOpenCurrentRoleModal] = useState(false);
  const [claimedOrRequestedRole, setClaimedOrRequestedRole] = useState(null);

  const [getExistingJoinRequest, { data: getUserJoinRequestData }] = useLazyQuery(GET_USER_JOIN_ORG_REQUEST);
  const [openGR15Modal, setOpenGR15Modal] = useState(false);
  const [exploreGr15TasksAndBounties, setExploreGr15TasksAndBounties] = useState(false);
  const orgProfile = orgData;
  const hasGr15Tasks = orgProfile?.hasGr15TasksAndBounties?.hasGr15Tasks;
  const hasGr15Bounties = orgProfile?.hasGr15TasksAndBounties?.hasGr15Bounties;

  const isGr15Sponsor = hasGr15Tasks || hasGr15Bounties;
  const links = orgProfile?.links;
  const router = useRouter();
  const userJoinRequest = getUserJoinRequestData?.getUserJoinOrgRequest;
  const { search, entity, cause } = router.query;
  const onTaskPage = entity === ENTITIES_TYPES.TASK || entity === undefined;
  const onBountyPage = entity === ENTITIES_TYPES.BOUNTY;
  const board = orgBoard;
  const boardFilters = board?.filters || {};
  const { asPath } = router;
  let finalPath = '';
  if (asPath) {
    const finalPathArr = asPath.split('/');
    finalPath = finalPathArr[finalPathArr.length - 1];
  }

  const previousEntity = usePrevious(entity);

  useEffect(() => {
    if (!entity && !search) {
      const bountyCount = tasksPerTypeData?.getPerTypeTaskCountForOrgBoard?.bountyCount;
      const taskCount = tasksPerTypeData?.getPerTypeTaskCountForOrgBoard?.taskCount;
      if (taskCount === 0 && bountyCount > taskCount && finalPath === 'boards') {
        router.push(`/${mainPath}/${orgProfile?.username}/boards?entity=bounty`, undefined, {
          shallow: true,
        });
      }
    }
  }, [tasksPerTypeData, entity, finalPath]);

  useEffect(() => {
    if (cause === GR15DEICategoryName) {
      onFilterChange({
        category: GR15DEICategoryName,
      });
      setExploreGr15TasksAndBounties(true);
    }
  }, [cause, setExploreGr15TasksAndBounties]);

  useEffect(() => {
    const orgPermissions = parseUserPermissionContext({
      userPermissionsContext,
      orgId: orgBoard?.orgId,
    });
    const role = userPermissionsContext?.orgRoles[orgBoard?.orgId];
    setOrgRoleName(role);
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

  const handleInviteAction = () => (inviteButtonSettings ? inviteButtonSettings.inviteAction() : setOpenInvite(true));
  return (
    <>
      <TaskActions />
      <Suspense>
        <OrgInviteLinkModal orgId={orgBoard?.orgId} open={openInvite} onClose={() => setOpenInvite(false)} />
      </Suspense>
      {openJoinRequestModal && (
        <Suspense>
          <MembershipRequestModal
            orgId={orgBoard?.orgId}
            open={openJoinRequestModal}
            onClose={() => setOpenJoinRequestModal(false)}
            setOpenCurrentRoleModal={setOpenCurrentRoleModal}
            requestingRole={claimedOrRequestedRole}
          />
        </Suspense>
      )}
      {openCurrentRoleModal && (
        <Suspense>
          <CurrentRoleModal
            orgId={orgBoard?.orgId}
            open={openCurrentRoleModal}
            onClose={() => setOpenCurrentRoleModal(false)}
            linkedWallet={loggedInUser?.activeEthAddress}
            currentRoleName={orgRoleName}
            setOpenJoinRequestModal={setOpenJoinRequestModal}
            setClaimedOrRequestedRole={setClaimedOrRequestedRole}
          />
        </Suspense>
      )}x
      <Suspense>
        <ChooseEntityToCreate />
      </Suspense>
      {moreInfoModalOpen && (
        <Suspense>
          <MoreInfoModal
            open={moreInfoModalOpen && (showUsers || showPods)}
            handleClose={() => {
              document.body.setAttribute('style', '');
              setShowPods(false);
              setShowUsers(false);
              setMoreInfoModalOpen(false);
            }}
            showUsers={showUsers}
            showPods={showPods}
            name={orgProfile?.name}
            orgId={orgBoard?.orgId}
          />
        </Suspense>
      )}

      <HeaderImageWrapper>
        <AspectRatio ratio={HEADER_ASPECT_RATIO} style={{ maxHeight: 175 }}>
          {orgProfile ? (
            <SafeImage
              src={orgProfile?.headerPicture || DEFAULT_HEADER}
              fill
              style={{
                objectFit: 'cover',
                width: '100%',
              }}
              useNextImage
              alt="Organization header"
            />
          ) : null}
        </AspectRatio>
      </HeaderImageWrapper>

      <Content>
        <ContentContainer>
          <TokenHeader>
            <HeaderMainBlock>
              {orgData?.shared && renderSharedHeader ? (
                renderSharedHeader({ parentOrgs: orgProfile?.parentOrgs })
              ) : (
                <Box sx={{ flex: '0 0 60px' }}>
                  <div
                    style={{
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                  >
                    <SafeImage
                      src={orgProfile?.profilePicture}
                      placeholderComp={
                        <TokenEmptyLogo>
                          <DAOEmptyIcon />
                        </TokenEmptyLogo>
                      }
                      width={60}
                      height={60}
                      useNextImage
                      style={{
                        borderRadius: '6px',
                      }}
                      alt="Organization logo"
                    />
                    {isGr15Sponsor && (
                      <>
                        <GR15DEIModal open={openGR15Modal} onClose={() => setOpenGR15Modal(false)} />
                        <GR15DEILogo
                          width="42"
                          height="42"
                          onClick={() => setOpenGR15Modal(true)}
                          style={{
                            top: '0',
                            right: '-20px',
                            position: 'absolute',
                            zIndex: '25',
                          }}
                        />
                      </>
                    )}
                  </div>
                </Box>
              )}
              <HeaderTitleIcon>
                <HeaderTitle
                  style={{
                    ...(isGr15Sponsor && {
                      marginLeft: '24px',
                    }),
                  }}
                >
                  {orgProfile?.name}
                </HeaderTitle>
                {!isCollabWorkspace && <HeaderTag>@{orgProfile?.username}</HeaderTag>}
              </HeaderTitleIcon>
              <HeaderButtons>
                {/* <Tooltip title="your permissions are:" > */}
                {permissions && orgRoleName && (
                  <RoleButtonWrapper>
                    <RoleText>Your Role:</RoleText>
                    <RolePill
                      onClick={() => {
                        setOpenCurrentRoleModal(true);
                      }}
                      roleName={orgRoleName}
                    >
                      🔑 {orgRoleName}
                    </RolePill>
                  </RoleButtonWrapper>
                )}
                <ToggleBoardPrivacyIcon
                  isPrivate={orgData?.privacyLevel !== PRIVACY_LEVEL.public}
                  tooltipTitle={orgData?.privacyLevel !== PRIVACY_LEVEL.public ? 'Private' : 'Public'}
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
                        Join org
                      </HeaderButton>
                    )}
                  </>
                )}
                {permissions === ORG_PERMISSIONS.MANAGE_SETTINGS && (
                  <>
                    <SettingsButton
                      onClick={() => {
                        router.push(`/${mainPath}/settings/${orgBoard?.orgId}/general`);
                      }}
                    >
                      Settings
                    </SettingsButton>
                    <InviteButton onClick={handleInviteAction}>{inviteButtonSettings?.label || 'Invite'}</InviteButton>
                  </>
                )}
              </HeaderButtons>
            </HeaderMainBlock>
            <HeaderText as="div">
              <RichTextViewer text={orgProfile?.description} />
            </HeaderText>
            <div>
              <HeaderActivity>
                <HeaderContributors
                  onClick={() => {
                    setMoreInfoModalOpen(true);
                    setShowUsers(true);
                  }}
                >
                  <HeaderContributorsAmount>{orgProfile?.contributorCount}</HeaderContributorsAmount>
                  <HeaderContributorsText>Contributors</HeaderContributorsText>
                </HeaderContributors>
                <HeaderPods
                  onClick={() => {
                    setMoreInfoModalOpen(true);
                    setShowPods(true);
                  }}
                >
                  <HeaderPodsAmount>{orgProfile?.podCount}</HeaderPodsAmount>
                  <HeaderPodsText>Pods</HeaderPodsText>
                </HeaderPods>
                {isGr15Sponsor && (
                  <HeaderGr15Sponsor>
                    <ExploreOrgGr15
                      onTaskPage={onTaskPage}
                      onBountyPage={onBountyPage}
                      hasGr15Bounties={hasGr15Bounties}
                      hasGr15Tasks={hasGr15Tasks}
                      onFilterChange={onFilterChange}
                      orgProfile={orgProfile}
                      filters={boardFilters}
                      exploreGr15TasksAndBounties={exploreGr15TasksAndBounties}
                      setExploreGr15TasksAndBounties={setExploreGr15TasksAndBounties}
                    />
                  </HeaderGr15Sponsor>
                )}
                {links?.map((link, index) => {
                  if (link.type === 'link') {
                    return (
                      <HeaderActivityLink href={link?.url} key={index} target="_blank">
                        <HeaderActivityLinkIcon />
                        {removeUrlStart(link?.name) || removeUrlStart(link?.url)}
                      </HeaderActivityLink>
                    );
                  }
                })}

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
                            fill="#ccbbff"
                          />
                        </HeaderActivityLink>
                      );
                    }
                    return null;
                  }
                })}
              </HeaderActivity>
            </div>
          </TokenHeader>
          <Container>
            <BoardsSubheaderWrapper>
              {orgBoard?.setEntityType && !search && (
                <TypeSelector
                  tasksPerTypeData={tasksPerTypeData?.getPerTypeTaskCountForOrgBoard}
                  setExploreGr15TasksAndBounties={setExploreGr15TasksAndBounties}
                />
              )}
              {!!filterSchema && (
                <ExploreGr15TasksAndBountiesContext.Provider value={exploreGr15TasksAndBounties}>
                  <BoardsActivity
                    onSearch={onSearch}
                    filterSchema={filterSchema}
                    onFilterChange={onFilterChange}
                    statuses={statuses}
                    podIds={podIds}
                    userId={userId}
                  />
                </ExploreGr15TasksAndBountiesContext.Provider>
              )}
            </BoardsSubheaderWrapper>
            {children}
          </Container>
        </ContentContainer>
      </Content>
    </>
  );
}

export default Wrapper;

//
// const WrapperMemo = memo(Wrapper, (prevProps, nextProps) => {
//   if (!nextProps.orgBoard?.orgId) {
//     return true;
//   }
//
//   const areEqual =
//     prevProps.routerQuery === nextProps.routerQuery &&
//     prevProps.orgBoard?.orgId === nextProps.orgBoard?.orgId &&
//     prevProps.routerPath === nextProps.routerPath &&
//     prevProps.loading === nextProps.loading &&
//     prevProps.podIds === nextProps.podIds &&
//     prevProps.statuses === nextProps.statuses &&
//     prevProps.filterSchema === nextProps.filterSchema &&
//     prevProps.orgData === nextProps.orgData &&
//     prevProps.activeEthAddress === nextProps.activeEthAddress;
//   //
//   // console.log(
//   //   '---------',
//   //   prevProps.routerQuery === nextProps.routerQuery,
//   //   prevProps.orgBoard?.orgId === nextProps.orgBoard?.orgId,
//   //   prevProps.routerPath === nextProps.routerPath,
//   //   prevProps.loading === nextProps.loading,
//   //   prevProps.podIds === nextProps.podIds,
//   //   prevProps.statuses === nextProps.statuses,
//   //   prevProps.filterSchema === nextProps.filterSchema,
//   //   prevProps.orgData === nextProps.orgData,
//   //   prevProps.activeEthAddress === nextProps.activeEthAddress
//   // );
//   //
//   // console.log('-------', prevProps, nextProps);
//
//   return areEqual;
// });
//
// export default (props) => {
//   const loggedInUser = useMe();
//   const orgBoard = useOrgBoard();
//   const router = useRouter();
//
//   return (
//     <WrapperMemo
//       {...props}
//       routerQuery={router.query}
//       routerPath={router.asPath}
//       orgBoard={orgBoard}
//       activeEthAddress={loggedInUser?.activeEthAddress}
//       onNavigate={router.push}
//     />
//   );
// };
