import { useMe, withAuth } from 'components/Auth/withAuth';
import {
  TaskCardOrgNoLogo,
  TaskCardOrgPhoto,
  TaskCardPodIcon,
  TaskModalCard,
  TaskModalHeader,
  TaskModalHeaderArrow,
  TaskModalHeaderCloseModal,
  TaskModalHeaderIconWrapper,
  TaskModalHeaderOpenInFullIcon,
  TaskModalHeaderPrivacyIcon,
  TaskModalHeaderShare,
  TaskModalHeaderTypography,
  TaskModalHeaderWrapper,
  TaskModalHeaderWrapperRight,
} from 'components/Common/TaskViewModal/styles';
import { DAOIcon } from 'components/Icons/dao';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { PERMISSIONS, PRIVACY_LEVEL } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useGlobalContext, useTaskContext } from 'utils/hooks';
import { Menu } from 'components/Common/TaskViewModal/helpers';
import GrantIcon from 'components/Icons/GrantIcon';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import { HeaderTypography } from 'components/GrantApplications/CreateGrantApplication/styles';
import { delQuery } from 'utils/index';
import { useLocation } from 'utils/useLocation';
import { GrantStatusNotStarted } from 'components/Icons/GrantStatusIcons';

const grantApplication = {
  id: '1',
  title: 'This is the application title',
  description:
    '[{"children":[{"text":"Overview","headingOne":true}],"type":"paragraph"},{"type":"paragraph","children":[{"headingOne":false,"text":""}]},{"type":"paragraph","children":[{"headingOne":false,"text":""}]},{"type":"paragraph","children":[{"headingOne":false,"text":""}]},{"type":"paragraph","children":[{"headingOne":true,"text":"Deliverables "}]}]',
  status: 'in_review',
  grant: {
    orgId: '46110468539940865',
    id: '46110468539940865GRANTID',
    podId: '63107746167259171',
    privacyLevel: PRIVACY_LEVEL.private,
    createdBy: '58937239456972909',
    description:
      '[{"children":[{"text":"Purpose","headingOne":true}],"type":"paragraph"},{"type":"paragraph","children":[{"headingOne":false,"text":""}]},{"type":"paragraph","children":[{"headingOne":false,"text":""}]},{"type":"paragraph","children":[{"headingOne":false,"text":""}]},{"type":"paragraph","children":[{"headingOne":true,"text":"Grant description "}]},{"type":"paragraph","children":[{"headingOne":false,"text":""}]},{"type":"paragraph","children":[{"headingOne":false,"text":""}]},{"type":"paragraph","children":[{"headingOne":false,"text":""}]},{"type":"paragraph","children":[{"headingOne":true,"text":"Requirements"}]}]',
    title: 'This is the grant title',
    assigneeId: '58937239456972909',
    orgUsername: 'wonderverse',
    orgProfilePicture: 'org/profile/46110468539940865/6xP5sZ-WKjEbkA.jpeg',
    pod: {
      name: 'adrian2 private pod',
      color: '#158FAD',
      privacyLevel: 'private',
      __typename: 'Pod',
    },
    grantAmount: {
      paymentMethodId: '56545357864108041',
      rewardAmount: '20',
      amount: '6',
      chain: 'ethereum',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=002',
      tokenName: 'eth',
      symbol: 'eth',
    },
    startDate: '2022-10-04T08:04:48.168815+00:00',
    endDate: '2022-10-06T08:04:48.168815+00:00',
    applyPolicy: 'anyone',
    visibility: 'members only',
    categories: [
      { name: 'memes', __typename: 'TaskCategory' },
      { name: 'memes', __typename: 'TaskCategory' },
      { name: 'memes', __typename: 'TaskCategory' },
    ],
    reviewerIds: ['58937239456972909', '58937239456972909'],
    reviewers: [
      {
        id: '58937239456972909',
        profilePicture: null,
        firstName: null,
        lastName: null,
        username: 'adrian2',
        __typename: 'User',
      },
      {
        id: '58937239456972909',
        profilePicture: null,
        firstName: null,
        lastName: null,
        username: 'adrian2',
        __typename: 'User',
      },
    ],
    org: {
      profilePicture: 'org/profile/46110468539940865/6xP5sZ-WKjEbkA.jpeg',
      name: 'wonderverse staging',
      username: 'wonderverse',
      privacyLevel: 'public',
      shared: null,
      __typename: 'Org',
    },
  },
  walletAddress: '0x6155f139cD692496F24BB127F54eAc3b38CB06EE',
};

const ViewGrantApplication = ({ onClose }) => {
  const router = useRouter();
  const { isFullScreen, toggleFullScreen, setEditMode } = useTaskContext();
  const globalContext = useGlobalContext();
  const getUserPermissionContext = useCallback(() => globalContext?.userPermissionsContext, [globalContext]);
  const userPermissionsContext = getUserPermissionContext();

  const location = useLocation();
  const { grant } = grantApplication;

  const user = useMe();
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: grant?.orgId,
    podId: grant?.podId,
  });

  const canEdit =
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    permissions.includes(PERMISSIONS.EDIT_TASK) ||
    grant?.createdBy === user?.id ||
    (grant?.assigneeId && grant?.assigneeId === user?.id);

  const canArchive =
    permissions.includes(PERMISSIONS.MANAGE_BOARD) ||
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    grant?.createdBy === user?.id;

  const { grantApplicationId } = router.query;

  const displayTitle = grant?.title?.slice(0, 10);

  const handleGrantClick = () => {
    const url = `${delQuery(router.asPath)}?grant=${grant?.id}`;
    location.push(url);
    document.body.setAttribute('style', `position: fixed; top: -${window.scrollY}px; left:0; right:0`);
  };

  return (
    <TaskModalCard fullScreen={isFullScreen}>
      <TaskModalHeader>
        <TaskModalHeaderWrapper>
          <TaskModalHeaderIconWrapper
            onClick={() => {
              onClose();
              router.push(`/organization/${grant?.orgUsername}/boards`, undefined, {
                shallow: true,
              });
            }}
          >
            {grant?.orgProfilePicture ? (
              <TaskCardOrgPhoto src={grant?.orgProfilePicture} />
            ) : (
              <TaskCardOrgNoLogo>
                <DAOIcon />
              </TaskCardOrgNoLogo>
            )}
            <TaskModalHeaderTypography>{grant?.org.name}</TaskModalHeaderTypography>
          </TaskModalHeaderIconWrapper>
          <TaskModalHeaderIconWrapper>
            <TaskCardPodIcon color={grant?.pod?.color} />
            <TaskModalHeaderTypography>{grant?.pod?.name}</TaskModalHeaderTypography>
          </TaskModalHeaderIconWrapper>
          <TaskModalHeaderIconWrapper onClick={handleGrantClick}>
            <TaskModalHeaderArrow />

            <ItemButtonIcon isActive>
              <GrantIcon />
            </ItemButtonIcon>
            <HeaderTypography>
              {`${displayTitle}${displayTitle.length < grant?.title?.length ? '...' : ''}`}
            </HeaderTypography>
          </TaskModalHeaderIconWrapper>
          <TaskModalHeaderIconWrapper>
            <TaskModalHeaderArrow />

            <ItemButtonIcon isActive>
              <GrantStatusNotStarted />
            </ItemButtonIcon>
            <HeaderTypography>Application</HeaderTypography>
          </TaskModalHeaderIconWrapper>

          {grant?.privacyLevel !== PRIVACY_LEVEL.public && (
            <>
              <TaskModalHeaderArrow />
              <TaskModalHeaderPrivacyIcon
                isPrivate={grant?.privacyLevel !== PRIVACY_LEVEL.public}
                tooltipTitle={grant?.privacyLevel !== PRIVACY_LEVEL.public ? 'Members only' : 'Public'}
              />
            </>
          )}
        </TaskModalHeaderWrapper>
        <TaskModalHeaderWrapperRight>
          <TaskModalHeaderShare fetchedTask={grant} />
          <TaskModalHeaderOpenInFullIcon isFullScreen={isFullScreen} onClick={toggleFullScreen} />
          <Menu canEdit={canEdit} canArchive={canArchive} setEditTask={setEditMode} />

          <TaskModalHeaderCloseModal onClick={onClose} />
        </TaskModalHeaderWrapperRight>
      </TaskModalHeader>
    </TaskModalCard>
  );
};

export default withAuth(ViewGrantApplication);
