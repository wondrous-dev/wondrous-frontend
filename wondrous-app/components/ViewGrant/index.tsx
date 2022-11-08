import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { PERMISSIONS, PRIVACY_LEVEL } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useBoards, useFullScreen, useGlobalContext } from 'utils/hooks';
import { useMe } from 'components/Auth/withAuth';
import { TaskModal, TaskModalHeaderWrapperRight } from 'components/Common/Task/styles';
import {
  TaskCardOrgNoLogo,
  TaskCardOrgPhoto,
  TaskModalCard,
  TaskModalHeader,
  TaskModalHeaderArrow,
  TaskModalHeaderBackToList,
  TaskModalHeaderCloseModal,
  TaskModalHeaderIconWrapper,
  TaskModalHeaderOpenInFullIcon,
  TaskModalHeaderPrivacyIcon,
  TaskModalHeaderShare,
  TaskModalHeaderTypography,
  TaskModalHeaderWrapper,
  TaskModalTaskData,
  TaskModalTitleDescriptionMedia,
} from 'components/Common/TaskViewModal/styles';
import { LockedTaskMessage } from 'components/Common/TaskViewModal/helpers';
import { DAOIcon } from 'components/Icons/dao';
import { useRouter } from 'next/router';
import { canViewGrant } from './utils';
import { Description, PodField, Title } from './Fields';

const grant = {
  orgId: '46110468539940865',
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
  org: {
    profilePicture: 'org/profile/46110468539940865/6xP5sZ-WKjEbkA.jpeg',
    name: 'wonderverse staging',
    username: 'wonderverse',
    privacyLevel: 'public',
    shared: null,
    __typename: 'Org',
  },
};

const ViewGrant = ({ open, handleClose, grantId }) => {
  const board = useBoards();
  const { isFullScreen, toggleFullScreen } = useFullScreen(true);
  const [completeModal, setCompleteModal] = useState(false);
  const router = useRouter();
  const globalContext = useGlobalContext();
  const getUserPermissionContext = useCallback(() => globalContext?.userPermissionsContext, [globalContext]);
  const userPermissionsContext = getUserPermissionContext();

  const [activeTab, setActiveTab] = useState(null);
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: grant?.orgId,
    podId: grant?.podId,
  });

  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;

  const sectionRef = useRef(null);

  const user = useMe();

  const canView = useMemo(
    () => canViewGrant(grant, userPermissionsContext, permissions),
    [grant, userPermissionsContext, permissions]
  );

  const canEdit =
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    permissions.includes(PERMISSIONS.EDIT_TASK) ||
    grant?.createdBy === user?.id ||
    (grant?.assigneeId && grant?.assigneeId === user?.id);

  const canArchive =
    permissions.includes(PERMISSIONS.MANAGE_BOARD) ||
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    grant?.createdBy === user?.id;

  const canApproveProposal =
    permissions.includes(PERMISSIONS.FULL_ACCESS) || permissions.includes(PERMISSIONS.CREATE_TASK);

  return (
    <TaskModal open={open} onClose={handleClose}>
      <TaskModalCard fullScreen={isFullScreen}>
        {canView ? (
          <>
            <TaskModalHeader>
              <TaskModalHeaderWrapper>
                <TaskModalHeaderIconWrapper
                  onClick={() => {
                    handleClose();
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
                <PodField
                  podName={grant?.pod?.name}
                  podId={grant?.podId}
                  podColor={grant?.pod?.color}
                  handleClose={handleClose}
                  orgId={grant?.orgId}
                />
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
                <TaskModalHeaderCloseModal onClick={() => handleClose()} />
              </TaskModalHeaderWrapperRight>
            </TaskModalHeader>
            <TaskModalTaskData fullScreen={isFullScreen}>
              <TaskModalTitleDescriptionMedia fullScreen={isFullScreen}>
                <Title title={grant.title} />
                <Description orgId={grant?.orgId} description={grant?.description} onChange={() => {}} />
              </TaskModalTitleDescriptionMedia>
            </TaskModalTaskData>
          </>
        ) : (
          <LockedTaskMessage handleClose={handleClose} />
        )}
      </TaskModalCard>
    </TaskModal>
  );
};

export default ViewGrant;
