import React, { useEffect, useState } from 'react';
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
} from 'utils/constants';
import apollo from 'services/apollo';
import { Box } from '@mui/system';
import TypeSelector from 'components/TypeSelector';
import { parseUserPermissionContext } from 'utils/helpers';
import BoardsActivity from 'components/Common/BoardsActivity';
import DefaultBg from 'public/images/overview/background.png';

import usePrevious, { useOrgBoard, useTokenGating } from 'utils/hooks';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_USER_JOIN_ORG_REQUEST, GET_TASKS_PER_TYPE } from 'graphql/queries/org';
import { CREATE_JOIN_ORG_REQUEST } from 'graphql/mutations/org';
import { useRouter } from 'next/router';
import { LIT_PROTOCOL_MESSAGE } from 'utils/web3Constants';
import { useWonderWeb3 } from 'services/web3';
import {
  GET_TOKEN_GATED_ROLES_FOR_ORG,
  LIT_SIGNATURE_EXIST,
  GET_ORG_ROLES_CLAIMABLE_BY_DISCORD,
} from 'graphql/queries';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import {
  ExploreProjectsButton,
  ExploreProjectsButtonFilled,
} from 'components/Common/IntiativesModal/GR15DEIModal/styles';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import { CREATE_LIT_SIGNATURE } from 'graphql/mutations/tokenGating';
import { TokenGatedAndClaimableRoleModal } from 'components/organization/wrapper/TokenGatedAndClaimableRoleModal';
import { RichTextViewer } from 'components/RichText';
import { useHotkeys } from 'react-hotkeys-hook';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import CreateEntityModal from 'components/CreateEntity/CreateEntityModal/index';
import ChooseEntityToCreate from 'components/CreateEntity';
import BoardLock from 'components/BoardLock';
import { ExploreGr15TasksAndBountiesContext } from 'utils/contexts';
import { Snackbar } from 'components/Settings/Roles/styles';
import { TokenGatedBoard, ToggleBoardPrivacyIcon } from '../../Common/PrivateBoardIcon';
import { MembershipRequestModal } from './RequestModal';
import { DiscordIcon } from '../../Icons/discord';
import OpenSeaIcon from '../../Icons/openSea';
import LinkedInIcon from '../../Icons/linkedIn';
import { DAOEmptyIcon } from '../../Icons/dao';
import { MoreInfoModal } from '../../profile/modals';
import { OrgInviteLinkModal } from '../../Common/InviteLinkModal/OrgInviteLink';
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
  HeaderImage,
  HeaderImageWrapper,
  HeaderTag,
  BoardsSubheaderWrapper,
  RoleButtonWrapper,
  RoleText,
  RoleButton,
  Container,
  SettingsButton,
  InviteButton,
  HeaderGr15Sponsor,
} from './styles';
import { useMe } from '../../Auth/withAuth';
import TwitterPurpleIcon from '../../Icons/twitterPurple';

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

  const mainPath = isCollabWorkspace ? 'collaboration' : 'organization';

  const wonderWeb3 = useWonderWeb3();
  const loggedInUser = useMe();
  const [open, setOpen] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showPods, setShowPods] = useState(false);
  const orgBoard = useOrgBoard();

  const [createJoinOrgRequest] = useMutation(CREATE_JOIN_ORG_REQUEST);
  const [getPerTypeTaskCountForOrgBoard, { data: tasksPerTypeData }] = useLazyQuery(GET_TASKS_PER_TYPE);

  const userPermissionsContext = orgBoard?.userPermissionsContext;
  const [orgRoleName, setOrgRoleName] = useState(null);
  const [claimableDiscordRole, setClaimableDiscordRole] = useState(null);
  const [permissions, setPermissions] = useState(undefined);
  const [isCreateTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [tokenGatedRoles, setTokenGatedRoles] = useState([]);
  const [openInvite, setOpenInvite] = useState(false);
  const [joinRequestSent, setJoinRequestSent] = useState(false);
  const [openJoinRequestModal, setOpenJoinRequestModal] = useState(false);
  const [notLinkedWalletError, setNotLinkedWalletError] = useState(false);
  const [claimableRoleModalOpen, setClaimableRoleModalOpen] = useState(false);
  const [getExistingJoinRequest, { data: getUserJoinRequestData }] = useLazyQuery(GET_USER_JOIN_ORG_REQUEST);
  const [tokenGatingConditions, isLoading] = useTokenGating(orgBoard?.orgId);
  const [openGR15Modal, setOpenGR15Modal] = useState(false);
  const [exploreGr15TasksAndBounties, setExploreGr15TasksAndBounties] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
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

  const handleJoinOrgButtonClick = async () => {
    let claimableDiscordRoleFound = false;
    try {
      const { data: claimableDiscorRoles } = await apollo.query({
        query: GET_ORG_ROLES_CLAIMABLE_BY_DISCORD,
        variables: {
          orgId: orgBoard?.orgId,
        },
      });
      setClaimableDiscordRole(claimableDiscorRoles?.getOrgRolesClaimableByDiscord);
      if (
        claimableDiscorRoles?.getOrgRolesClaimableByDiscord &&
        claimableDiscorRoles?.getOrgRolesClaimableByDiscord.length > 0
      ) {
        claimableDiscordRoleFound = true;
      }
    } catch (e) {
      console.error('error getting cliamble discord roles', e);
    }

    if (loggedInUser && !loggedInUser?.activeEthAddress) {
      if (!claimableDiscordRoleFound && !permissions) {
        setOpenJoinRequestModal(true);
      }
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
      if (!claimableDiscordRoleFound && !permissions) {
        setOpenJoinRequestModal(true);
      }
      return;
    }

    const roles = apolloResult?.data?.getTokenGatedRolesForOrg;
    if (!roles || roles?.length === 0) {
      if (!claimableDiscordRoleFound && !permissions) {
        setOpenJoinRequestModal(true);
        return;
      }
    }
    if (
      wonderWeb3.address &&
      loggedInUser?.activeEthAddress &&
      wonderWeb3.toChecksumAddress(wonderWeb3.address) != wonderWeb3.toChecksumAddress(loggedInUser?.activeEthAddress)
    ) {
      if (!claimableDiscordRoleFound && !permissions) {
        setOpenJoinRequestModal(true);
        setNotLinkedWalletError(true);
        return;
      }
    }
    let litSignatureExistResult;
    try {
      litSignatureExistResult = await apollo.query({
        query: LIT_SIGNATURE_EXIST,
      });
    } catch (e) {
      console.error(e);
      if (!claimableDiscordRoleFound && !permissions) {
        setOpenJoinRequestModal(true);
        return;
      }
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
        if (!claimableDiscordRoleFound) {
          setOpenJoinRequestModal(true);
        }
        return;
      }
    }
    setTokenGatedRoles(roles);
    setClaimableRoleModalOpen(true);
  };
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

  useHotkeys('tab+t', () => {
    setCreateTaskModalOpen((prevState) => !prevState);
  });

  const handleInviteAction = () => (inviteButtonSettings ? inviteButtonSettings.inviteAction() : setOpenInvite(true));
  return (
    <>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={toast.show}
        onClose={() => setToast({ show: false, message: '' })}
        message={toast.message}
      />
      <OrgInviteLinkModal
        orgId={orgBoard?.orgId}
        open={openInvite}
        onClose={(isEmailInvitationSuccessful) => {
          setOpenInvite(false);
          if (isEmailInvitationSuccessful) {
            setToast({ ...toast, message: `Email invitations sent successfully.`, show: true });
          }
        }}
      />
      <MembershipRequestModal
        orgId={orgBoard?.orgId}
        setJoinRequestSent={setJoinRequestSent}
        sendRequest={createJoinOrgRequest}
        open={openJoinRequestModal}
        onClose={() => setOpenJoinRequestModal(false)}
        notLinkedWalletError={notLinkedWalletError}
        linkedWallet={loggedInUser?.activeEthAddress}
      />
      <ChooseEntityToCreate />
      <TokenGatedAndClaimableRoleModal
        open={claimableRoleModalOpen}
        onClose={() => setClaimableRoleModalOpen(false)}
        tokenGatedRoles={tokenGatedRoles}
        claimableDiscordRole={claimableDiscordRole}
        setOpenJoinRequestModal={setOpenJoinRequestModal}
        orgRoleName={orgRoleName}
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
      <CreateModalOverlay
        style={{
          height: '95vh',
        }}
        open={isCreateTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
      >
        <CreateEntityModal
          entityType={ENTITIES_TYPES.TASK}
          handleClose={() => setCreateTaskModalOpen(false)}
          resetEntityType={() => {}}
          setEntityType={() => {}}
          cancel={() => setCreateTaskModalOpen(false)}
        />
      </CreateModalOverlay>

      <HeaderImageWrapper>
        {orgProfile ? (
          <SafeImage
            src={orgProfile?.headerPicture || DefaultBg}
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
              {orgData?.shared && renderSharedHeader ? (
                renderSharedHeader({ parentOrgs: orgProfile?.parentOrgs })
              ) : (
                <Box sx={{ flex: '0 0 60px' }}>
                  <SafeImage
                    src={orgProfile?.profilePicture}
                    placeholderComp={
                      <TokenEmptyLogo>
                        <DAOEmptyIcon />
                      </TokenEmptyLogo>
                    }
                    width="60px"
                    height="60px"
                    useNextImage
                    style={{
                      borderRadius: '6px',
                    }}
                  />
                </Box>
              )}
              {isGr15Sponsor && (
                <div>
                  <GR15DEIModal open={openGR15Modal} onClose={() => setOpenGR15Modal(false)} />
                  <GR15DEILogo
                    width="42"
                    height="42"
                    style={{
                      marginLeft: '4px',
                    }}
                    onClick={() => setOpenGR15Modal(true)}
                  />
                </div>
              )}
              <HeaderTitleIcon>
                <HeaderTitle
                  style={{
                    ...(isGr15Sponsor && {
                      marginLeft: '12px',
                    }),
                  }}
                >
                  {orgProfile?.name}
                </HeaderTitle>
                <HeaderTag>@{orgProfile?.username}</HeaderTag>
              </HeaderTitleIcon>
              <HeaderButtons>
                {/* <Tooltip title="your permissions are:" > */}
                {permissions && orgRoleName && (
                  <RoleButtonWrapper>
                    <RoleText>Your Role:</RoleText>
                    <RoleButton onClick={handleJoinOrgButtonClick}>🔑 {orgRoleName}</RoleButton>
                  </RoleButtonWrapper>
                )}
                {/* </Tooltip> */}
                {!isLoading && (
                  <TokenGatedBoard
                    isPrivate={tokenGatingConditions?.getTokenGatingConditionsForOrg?.length > 0}
                    tooltipTitle="Token gating"
                  />
                )}
                <ToggleBoardPrivacyIcon
                  isPrivate={orgData?.privacyLevel !== PRIVACY_LEVEL.public}
                  tooltipTitle={orgData?.privacyLevel !== PRIVACY_LEVEL.public ? 'Private' : 'Public'}
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
            <HeaderText>
              <RichTextViewer text={orgProfile?.description} />
            </HeaderText>
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
