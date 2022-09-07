/* eslint-disable import/no-named-as-default-member */
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import apollo from 'services/apollo';
import {
  ENTITIES_TYPES,
  PERMISSIONS,
  PRIVACY_LEVEL,
  SOCIAL_MEDIA_DISCORD,
  SOCIAL_MEDIA_LINKEDIN,
  SOCIAL_MEDIA_TWITTER,
  SOCIAL_OPENSEA,
} from 'utils/constants';

import BoardsActivity from 'components/Common/BoardsActivity';
import TypeSelector from 'components/TypeSelector';
import DefaultBg from 'public/images/overview/background.png';
import { parseUserPermissionContext } from 'utils/helpers';

import { useLazyQuery, useMutation } from '@apollo/client';
import ChooseEntityToCreate from 'components/CreateEntity';
import CreateEntityModal from 'components/CreateEntity/CreateEntityModal/index';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import { TokenGatedAndClaimableRoleModal } from 'components/organization/wrapper/TokenGatedAndClaimableRoleModal';
import { RichTextViewer } from 'components/RichText';
import { CREATE_JOIN_ORG_REQUEST } from 'graphql/mutations/org';
import { CREATE_LIT_SIGNATURE } from 'graphql/mutations/tokenGating';
import {
  GET_ORG_ROLES_CLAIMABLE_BY_DISCORD,
  GET_TOKEN_GATED_ROLES_FOR_ORG,
  LIT_SIGNATURE_EXIST,
} from 'graphql/queries';
import { GET_TASKS_PER_TYPE, GET_USER_JOIN_ORG_REQUEST } from 'graphql/queries/org';
import { useRouter } from 'next/router';
import { useHotkeys } from 'react-hotkeys-hook';
import { useWonderWeb3 } from 'services/web3';
import { useOrgBoard, useTokenGating } from 'utils/hooks';
import { HOTKEYS } from 'utils/hotkeyHelper';
import { LIT_PROTOCOL_MESSAGE } from 'utils/web3Constants';
import { useMe } from '../../Auth/withAuth';
import { SafeImage } from '../../Common/Image';
import { OrgInviteLinkModal } from '../../Common/InviteLinkModal/OrgInviteLink';
import { ToggleBoardPrivacyIcon, TokenGatedBoard } from '../../Common/PrivateBoardIcon';
import { DAOEmptyIcon } from '../../Icons/dao';
import { DiscordIcon } from '../../Icons/discord';
import LinkedInIcon from '../../Icons/linkedIn';
import OpenSeaIcon from '../../Icons/openSea';
import TwitterPurpleIcon from '../../Icons/twitterPurple';
import { MoreInfoModal } from '../../profile/modals';
import Tabs from '../tabs/tabs';
import { MembershipRequestModal } from './RequestModal';
import {
  BoardsSubheaderWrapper,
  Content,
  ContentContainer,
  HeaderActivity,
  HeaderActivityLink,
  HeaderActivityLinkIcon,
  HeaderButton,
  HeaderButtons,
  HeaderContributors,
  HeaderContributorsAmount,
  HeaderContributorsText,
  HeaderImageWrapper,
  HeaderMainBlock,
  HeaderPods,
  HeaderPodsAmount,
  HeaderPodsText,
  HeaderTag,
  HeaderText,
  HeaderTitle,
  HeaderTitleIcon,
  RoleButton,
  RoleButtonWrapper,
  RoleText,
  TokenEmptyLogo,
  TokenHeader,
  Container,
  SettingsButton,
  InviteButton,
} from './styles';

function Wrapper(props) {
  const { children, orgData, onSearch, filterSchema, onFilterChange, statuses, podIds, userId } = props;
  const wonderWeb3 = useWonderWeb3();
  const loggedInUser = useMe();
  const [open, setOpen] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showPods, setShowPods] = useState(false);
  const orgBoard = useOrgBoard();
  const ORG_PERMISSIONS = {
    MANAGE_SETTINGS: 'manageSettings',
    CONTRIBUTOR: 'contributor',
  };

  const [typeEntity, setTypeEntity] = useState(ENTITIES_TYPES.TASK);
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

  const orgProfile = orgData;
  const links = orgProfile?.links;
  const router = useRouter();
  const userJoinRequest = getUserJoinRequestData?.getUserJoinOrgRequest;
  const { search, entity } = router.query;
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

  useEffect(() => {
    if (!entity && !search) {
      const bountyCount = tasksPerTypeData?.getPerTypeTaskCountForOrgBoard?.bountyCount;
      const taskCount = tasksPerTypeData?.getPerTypeTaskCountForOrgBoard?.taskCount;
      if (taskCount === 0 && bountyCount > taskCount && finalPath === 'boards') {
        router.push(`/organization/${orgProfile?.username}/boards?entity=bounty`, undefined, {
          shallow: true,
        });
      }
    }
  }, [tasksPerTypeData, entity, finalPath]);

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

  useHotkeys(HOTKEYS.CREATE_TASK, () => {
    setTypeEntity(ENTITIES_TYPES.TASK);
    setCreateTaskModalOpen((prevState) => !prevState);
  });
  useHotkeys(HOTKEYS.CREATE_BOUNTY, () => {
    setTypeEntity(ENTITIES_TYPES.BOUNTY);
    setCreateTaskModalOpen((prevState) => !prevState);
  });
  useHotkeys(HOTKEYS.CREATE_MILESTONE, () => {
    setTypeEntity(ENTITIES_TYPES.MILESTONE);
    setCreateTaskModalOpen((prevState) => !prevState);
  });
  useHotkeys(HOTKEYS.CREATE_PROPOSAL, () => {
    setTypeEntity(ENTITIES_TYPES.PROPOSAL);
    setCreateTaskModalOpen((prevState) => !prevState);
  });

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
          entityType={typeEntity}
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

              <HeaderTitleIcon>
                <HeaderTitle>{orgProfile?.name}</HeaderTitle>
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
                        router.push(`/organization/settings/${orgBoard?.orgId}/general`);
                      }}
                    >
                      Settings
                    </SettingsButton>
                    <InviteButton onClick={() => setOpenInvite(true)}>Invite</InviteButton>
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
          </Container>
        </ContentContainer>
      </Content>
    </>
  );
}

export default Wrapper;
