import { useMe, withAuth } from 'components/Auth/withAuth';
import { ArchiveTaskModal } from 'components/Common/ArchiveTaskModal';
import DeleteTaskModal from 'components/Common/DeleteTaskModal';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import { Menu } from 'components/Common/TaskViewModal/helpers';
import {
  TaskCardOrgNoLogo,
  TaskCardOrgPhoto,
  TaskCardPodIcon,
  TaskMediaWrapper,
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
  TaskModalTaskData,
  TaskModalTitle,
  TaskModalTitleDescriptionMedia,
  TaskSectionDisplayData,
  TaskSectionDisplayDiv,
  TaskSectionDisplayDivWrapper,
  TaskSectionDisplayLabelText
} from 'components/Common/TaskViewModal/styles';
import CreateGrantApplication from 'components/GrantApplications/CreateGrantApplication';
import { HeaderTypography } from 'components/GrantApplications/CreateGrantApplication/styles';
import { DAOIcon } from 'components/Icons/dao';
import GrantIcon from 'components/Icons/GrantIcon';
import { GrantStatusNotStarted } from 'components/Icons/GrantStatusIcons';
import { RichTextViewer } from 'components/RichText';
import { GrantAmount } from 'components/ViewGrant/Fields';
import ViewGrantFooter from 'components/ViewGrant/Footer';
import { DescriptionWrapper } from 'components/ViewGrant/styles';
import { GET_GRANT_APPLICATION_BY_ID } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ENTITIES_TYPES, PERMISSIONS, PRIVACY_LEVEL } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useGlobalContext, useTaskContext } from 'utils/hooks';
import { delQuery } from 'utils/index';
import { useLocation } from 'utils/useLocation';

import { useQuery } from '@apollo/client';

import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { GrantApplicationStatusManager, WalletAddressViewer } from './Fields';
import { GrantSectionDisplayLabel, ModalCard } from './styles';

const FIELDS_CONFIG = [
  {
    component: ({ grantApplication }) => <GrantApplicationStatusManager grantApplication={grantApplication} />,
    shouldDisplay: ({ hasManageRights }): boolean => hasManageRights,
  },
  {
    label: 'Grant amount',
    component: ({ grantApplication: { grant } }) => <GrantAmount grantAmount={grant?.reward || {}} />,
  },
  {
    label: 'Wallet Address',
    component: ({ grantApplication: { paymentAddress } }) => <WalletAddressViewer walletAddress={paymentAddress} />,
  },
];

const ViewGrantApplication = ({ onClose }) => {
  const router = useRouter();
  const { isFullScreen, toggleFullScreen } = useTaskContext();
  const [isEditMode, setEditMode] = useState(false);
  const globalContext = useGlobalContext();
  const getUserPermissionContext = useCallback(() => globalContext?.userPermissionsContext, [globalContext]);
  const userPermissionsContext = getUserPermissionContext();
  const [deleteTask, setDeleteTask] = useState(false);
  const [archiveTask, setArchiveTask] = useState(false);
  const location = useLocation();
  const { data } = useQuery(GET_GRANT_APPLICATION_BY_ID, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: {
      grantApplicationId: location?.params?.grantApplicationId,
    },
    skip: !location?.params?.grantApplicationId,
  });

  const grantApplication = data?.getGrantApplicationById;
  const grant = grantApplication?.grant;

  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;

  useEffect(() => {
    if (location?.params?.edit && !isEditMode) {
      setEditMode(true);
    }
  }, [location?.params?.edit]);

  const user = useMe();
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: grant?.orgId,
    podId: grant?.podId,
  });

  const canManage =
    permissions?.includes(PERMISSIONS.FULL_ACCESS) ||
    permissions?.includes(PERMISSIONS.EDIT_TASK) ||
    grant?.createdBy === user?.id;

  const canArchive =
    permissions?.includes(PERMISSIONS.MANAGE_BOARD) ||
    permissions?.includes(PERMISSIONS.FULL_ACCESS) ||
    grant?.createdBy === user?.id;

  const displayTitle = grant?.title?.slice(0, 10);

  const handleGrantClick = () => {
    const url = `${delQuery(router.asPath)}?grant=${grant?.id}`;
    location.push(url);
    document.body.setAttribute('style', `position: fixed; top: -${window.scrollY}px; left:0; right:0`);
  };

  if (isEditMode) {
    return (
      <CreateGrantApplication isEditMode grantApplication={grantApplication} handleClose={() => setEditMode(false)} />
    );
  }
  return (
    <>
      <ArchiveTaskModal
        open={archiveTask}
        onArchive={() => {
          setSnackbarAlertOpen(true);
          setSnackbarAlertMessage(`Archived successfully!`);
        }}
        onClose={() => setArchiveTask(false)}
        taskType={ENTITIES_TYPES.GRANT_APPLICATION}
        taskId={grantApplication?.id}
      />
      <DeleteTaskModal
        open={deleteTask}
        onClose={() => {
          setDeleteTask(false);
        }}
        taskType={ENTITIES_TYPES.GRANT_APPLICATION}
        taskId={grantApplication?.id}
        onDelete={() => {
          setSnackbarAlertOpen(true);
          setSnackbarAlertMessage(`Deleted successfully!`);
        }}
      />

      <ModalCard fullScreen={isFullScreen}>
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
            {grant?.pod && (
              <TaskModalHeaderIconWrapper>
                <TaskCardPodIcon color={grant?.pod?.color} />
                <TaskModalHeaderTypography>{grant?.pod?.name}</TaskModalHeaderTypography>
              </TaskModalHeaderIconWrapper>
            )}
            <TaskModalHeaderIconWrapper onClick={handleGrantClick}>
              <TaskModalHeaderArrow />

              <ItemButtonIcon isActive>
                <GrantIcon />
              </ItemButtonIcon>
              <HeaderTypography>
                {`${displayTitle}${displayTitle?.length < grant?.title?.length ? '...' : ''}`}
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
            {grantApplication && <TaskModalHeaderShare fetchedTask={grantApplication} />}
            <TaskModalHeaderOpenInFullIcon isFullScreen={isFullScreen} onClick={toggleFullScreen} />
            <Menu canEdit={canManage} canDelete={canArchive} canArchive={canArchive} setEditTask={setEditMode} />

            <TaskModalHeaderCloseModal onClick={onClose} />
          </TaskModalHeaderWrapperRight>
        </TaskModalHeader>
        <TaskModalTaskData fullScreen={isFullScreen}>
          <TaskModalTitleDescriptionMedia fullScreen={isFullScreen}>
            <TaskModalTitle>{grantApplication?.title}</TaskModalTitle>
            <DescriptionWrapper>
              <RichTextViewer text={grantApplication?.description} />
              <TaskMediaWrapper media={grantApplication?.media} />
            </DescriptionWrapper>
          </TaskModalTitleDescriptionMedia>
          <TaskSectionDisplayDivWrapper fullScreen={isFullScreen}>
            <TaskSectionDisplayData>
              {!!grantApplication &&
                FIELDS_CONFIG.map((field, idx) => {
                  if (field?.shouldDisplay && !field?.shouldDisplay({ hasManageRights: canManage })) {
                    return null;
                  }
                  return (
                    <TaskSectionDisplayDiv key={idx} alignItems="start">
                      {!!field.label && (
                        <GrantSectionDisplayLabel>
                          <TaskSectionDisplayLabelText>{field.label}</TaskSectionDisplayLabelText>
                        </GrantSectionDisplayLabel>
                      )}
                      <field.component grantApplication={grantApplication} />
                    </TaskSectionDisplayDiv>
                  );
                })}
            </TaskSectionDisplayData>
          </TaskSectionDisplayDivWrapper>
          <ViewGrantFooter
            entityType={ENTITIES_TYPES.GRANT_APPLICATION}
            entity={grantApplication}
            commentCount={grantApplication?.commentCount}
            commentListProps={{
              showCommentBox: canManage,
              showComments: true,
            }}
          />
        </TaskModalTaskData>
      </ModalCard>
    </>
  );
};

export default withAuth(ViewGrantApplication);
