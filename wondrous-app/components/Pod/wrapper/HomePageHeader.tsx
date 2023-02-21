import TaskViewModalWatcher from 'components/Common/TaskViewModal/TaskViewModalWatcher';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import palette from 'theme/palette';
import {
  ENTITIES_TYPES,
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
import { SafeImage } from 'components/Common/Image';
import ChooseEntityToCreate from 'components/CreateEntity';
import RolePill from 'components/Common/RolePill';
import MoreInfoModal from 'components/Common/MoreInfoModal';
import MembersIcon from 'components/Icons/members';
import HeaderSocialLinks from 'components/organization/wrapper/HeaderSocialLinks';
import { Button as PrimaryButton } from 'components/Button';
import PlateRichTextViewer from 'components/PlateRichEditor/PlateRichTextViewer';
import { LogoWrapper, PodProfileImage } from './styles';
import { DAOEmptyIcon } from '../../Icons/dao';
import {
  ContentContainer,
  Container,
  RolePodMemberContainer,
  HeaderContributors,
  HeaderContributorsAmount,
  HeaderContributorsText,
  HeaderMainBlock,
  HeaderText,
  HeaderTitle,
  RoleButtonWrapper,
  TokenHeader,
  HeaderTopLeftContainer,
  HeaderImageWrapper,
  TokenEmptyLogo,
  MemberPodIconBackground,
  PrivacyContainer,
  PrivacyText,
} from '../../organization/wrapper/styles';
import PodIcon from '../../Icons/podIcon';
import { PodInviteLinkModal } from '../../Common/InviteLinkModal/podInviteLink';
import { useMe } from '../../Auth/withAuth';

function HomePageHeader(props) {
  const { children, onSearch, filterSchema, onFilterChange, statuses, userId } = props;

  const router = useRouter();
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

  const { search } = router.query;

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
      <ContentContainer>
        <TokenHeader>
          <HeaderMainBlock>
            <LogoWrapper>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/organization/${orgData?.getOrgById?.username}/home`);
                }}
                style={{
                  position: 'relative',
                  cursor: 'pointer',
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
              </div>

              <ArrowForwardIosIcon style={{ color: palette.grey58, marginLeft: 3 }} />
              <PodIcon
                color={podProfile?.color}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 50,
                }}
              />
            </LogoWrapper>

            <HeaderTopLeftContainer>
              <HeaderTitle>{podProfile?.name}</HeaderTitle>
              <PrivacyContainer>
                <PrivacyText>{podProfile?.privacyLevel !== PRIVACY_LEVEL.public ? 'Private' : 'Public'}</PrivacyText>
              </PrivacyContainer>
            </HeaderTopLeftContainer>

            <RolePodMemberContainer>
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
                      height={32}
                      width="max-content"
                      variant="outlined"
                      color="purple"
                      succeeded
                      disabled
                      paddingX={15}
                      buttonTheme={{ fontWeight: '500', fontSize: '14px' }}
                    >
                      Request sent
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton
                      height={32}
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
            </RolePodMemberContainer>
          </HeaderMainBlock>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px', gap: 10 }}>
            {podProfile?.description && podProfile?.description !== EMPTY_RICH_TEXT_STRING ? (
              <HeaderText as="div">
                <PlateRichTextViewer text={podProfile?.description} />
              </HeaderText>
            ) : (
              <div style={{ height: 10 }} />
            )}
            <HeaderSocialLinks links={podProfile?.links} />
          </div>
        </TokenHeader>
        <Container>{children}</Container>
      </ContentContainer>
    </>
  );
}

export default HomePageHeader;
