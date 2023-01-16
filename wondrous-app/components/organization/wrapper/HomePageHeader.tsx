import React, { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';

import { PERMISSIONS, PRIVACY_LEVEL, HEADER_ASPECT_RATIO, EMPTY_RICH_TEXT_STRING } from 'utils/constants';
import MembersIcon from 'components/Icons/members';
import { Button as PrimaryButton } from 'components/Button';
import TaskViewModalWatcher from 'components/Common/TaskViewModal/TaskViewModalWatcher';
import { parseUserPermissionContext } from 'utils/helpers';
import DEFAULT_HEADER from 'public/images/overview/background.png';
import { AspectRatio } from 'react-aspect-ratio';

import usePrevious, { useOrgBoard } from 'utils/hooks';
import { useLazyQuery } from '@apollo/client';
import { GET_USER_JOIN_ORG_REQUEST, GET_TASKS_PER_TYPE } from 'graphql/queries/org';
import { useRouter } from 'next/router';
import { RichTextViewer } from 'components/RichText';
import RolePill from 'components/Common/RolePill';
import HeaderSocialLinks from 'components/organization/wrapper/HeaderSocialLinks';
import { PodIconThin } from 'components/Icons/podIcon';
import palette from 'theme/palette';
import { DAOEmptyIcon } from '../../Icons/dao';
import { SafeImage } from '../../Common/Image';
import {
  ContentContainer,
  RolePodMemberContainer,
  HeaderContributors,
  HeaderContributorsAmount,
  HeaderContributorsText,
  HeaderMainBlock,
  HeaderText,
  HeaderTitle,
  TokenHeader,
  TokenEmptyLogo,
  HeaderTopLeftContainer,
  HeaderImageWrapper,
  MemberPodIconBackground,
  RoleButtonWrapper,
  Container,
  InviteButton,
  PrivacyContainer,
  PrivacyText,
} from './styles';
import { useMe } from '../../Auth/withAuth';

const OrgInviteLinkModal = dynamic(() => import('../../Common/InviteLinkModal/OrgInviteLink'), { suspense: true });
const MembershipRequestModal = dynamic(() => import('components/RoleModal/MembershipRequestModal'), { suspense: true });
const CurrentRoleModal = dynamic(() => import('components/RoleModal/CurrentRoleModal'), { suspense: true });
const ChooseEntityToCreate = dynamic(() => import('components/CreateEntity'), { suspense: true });
const MoreInfoModal = dynamic(() => import('components/profile/modals'), { suspense: true });

const ORG_PERMISSIONS = {
  MANAGE_SETTINGS: 'manageSettings',
  CONTRIBUTOR: 'contributor',
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

  const [getExistingJoinRequest, { data: getUserJoinRequestData }] = useLazyQuery(GET_USER_JOIN_ORG_REQUEST, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });
  const orgProfile = orgData;

  const router = useRouter();
  const userJoinRequest = getUserJoinRequestData?.getUserJoinOrgRequest;
  const { search, entity, cause } = router.query;
  const board = orgBoard;
  const boardFilters = board?.filters || {};
  const { asPath } = router;
  let finalPath = '';
  if (asPath) {
    const finalPathArr = asPath.split('/');
    finalPath = finalPathArr[finalPathArr.length - 1];
  }

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
      orgProfile?.id in userPermissionsContext.orgPermissions &&
      orgPermissions
    ) {
      // Normal contributor with no access to admin settings
      setPermissions(ORG_PERMISSIONS.CONTRIBUTOR);
    } else if (
      orgBoard?.orgId &&
      userPermissionsContext?.orgPermissions &&
      !(orgProfile?.id in userPermissionsContext.orgPermissions)
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
      <TaskViewModalWatcher />
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
      )}
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
      <ContentContainer>
        <TokenHeader>
          <HeaderMainBlock>
            {orgData?.shared && renderSharedHeader ? (
              renderSharedHeader({ parentOrgs: orgProfile?.parentOrgs })
            ) : (
              <div
                style={{
                  height: '100%',
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
                  width={36}
                  height={36}
                  useNextImage
                  style={{
                    borderRadius: '6px',
                  }}
                  alt="Organization logo"
                />
              </div>
            )}
            <HeaderTopLeftContainer>
              <HeaderTitle>{orgProfile?.name}</HeaderTitle>
              <PrivacyContainer>
                <PrivacyText>{orgData?.privacyLevel !== PRIVACY_LEVEL.public ? 'Private' : 'Public'}</PrivacyText>
              </PrivacyContainer>
            </HeaderTopLeftContainer>
            <RolePodMemberContainer>
              {permissions === ORG_PERMISSIONS.MANAGE_SETTINGS && inviteButtonSettings && (
                <InviteButton onClick={handleInviteAction}>{inviteButtonSettings?.label || 'Invite'}</InviteButton>
              )}

              <HeaderContributors
                onClick={() => {
                  setMoreInfoModalOpen(true);
                  setShowPods(true);
                }}
              >
                <MemberPodIconBackground>
                  <PodIconThin />
                </MemberPodIconBackground>
                <HeaderContributorsAmount>{orgProfile?.podCount} </HeaderContributorsAmount>
                <HeaderContributorsText>Pods</HeaderContributorsText>
              </HeaderContributors>
              <HeaderContributors
                onClick={() => {
                  setMoreInfoModalOpen(true);
                  setShowUsers(true);
                }}
              >
                <MemberPodIconBackground>
                  <MembersIcon stroke={palette.blue20} />
                </MemberPodIconBackground>
                <HeaderContributorsAmount>{orgProfile?.contributorCount} </HeaderContributorsAmount>
                <HeaderContributorsText>Members</HeaderContributorsText>
              </HeaderContributors>

              {permissions && orgRoleName && (
                <RoleButtonWrapper>
                  <RolePill
                    onClick={() => {
                      setOpenCurrentRoleModal(true);
                    }}
                    roleName={orgRoleName}
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
                      Join org
                    </PrimaryButton>
                  )}
                </>
              )}
            </RolePodMemberContainer>
          </HeaderMainBlock>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px', gap: 10 }}>
            {orgProfile?.description && orgProfile?.description !== EMPTY_RICH_TEXT_STRING ? (
              <HeaderText as="div">
                <RichTextViewer text={orgProfile?.description} />
              </HeaderText>
            ) : (
              <div style={{ height: 10 }} />
            )}
            <HeaderSocialLinks links={orgProfile?.links} />
          </div>
        </TokenHeader>
        <Container>{children}</Container>
      </ContentContainer>
    </>
  );
}

export default Wrapper;