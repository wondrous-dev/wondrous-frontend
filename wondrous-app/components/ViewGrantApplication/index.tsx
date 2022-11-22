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
  TaskSectionDisplayLabelText,
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
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ENTITIES_TYPES, GRANT_APPLICATION_STATUSES, PERMISSIONS, PRIVACY_LEVEL } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useGlobalContext, useTaskContext } from 'utils/hooks';
import { delQuery } from 'utils/index';
import { useLocation } from 'utils/useLocation';

import { useQuery } from '@apollo/client';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { IconWrapper } from 'components/Common/Status/styles';
import { SubmissionItemStatusChangesRequestedIcon } from 'components/Common/TaskSubmission/styles';
import { GrantModalCard } from 'components/CreateGrant/styles';
import { ItemPill } from 'components/GrantsBoard/styles';
import { CompletedIcon, InReviewIcon, RejectedIcon, TodoIcon } from 'components/Icons/statusIcons';
import { selectApplicationStatus } from 'components/ViewGrant/utils';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { GrantApplicationStatusManager, PaymentHandler, WalletAddressViewer } from './Fields';
import { GrantSectionDisplayLabel } from './styles';

const GRANT_APPLICATION_STATUS_LABELS = {
  [GRANT_APPLICATION_STATUSES.APPROVED]: {
    icon: CompletedIcon,
    label: 'Approved',
  },
  [GRANT_APPLICATION_STATUSES.APPROVED_AND_PAID]: {
    icon: CompletedIcon,
    label: 'Approved and paid',
  },
  [GRANT_APPLICATION_STATUSES.APPROVED_AND_PROCESSING]: {
    icon: CompletedIcon,
    label: 'Approved and processing payment',
  },
  [GRANT_APPLICATION_STATUSES.CHANGE_REQUESTED]: {
    icon: SubmissionItemStatusChangesRequestedIcon,
    label: 'Request changes',
  },
  [GRANT_APPLICATION_STATUSES.REJECTED]: {
    icon: RejectedIcon,
    label: 'Reject',
  },
  [GRANT_APPLICATION_STATUSES.WAITING_FOR_REVIEW]: {
    icon: InReviewIcon,
    label: 'Waiting for review',
  },
  [GRANT_APPLICATION_STATUSES.OPEN]: {
    icon: TodoIcon,
    label: 'Open',
  },
};

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
    component: ({ grantApplication }) => <PaymentHandler grantApplication={grantApplication} />,
    shouldDisplay: ({ isApproved }) => isApproved,
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

  const canManage = permissions?.includes(PERMISSIONS.FULL_ACCESS) || permissions?.includes(PERMISSIONS.EDIT_TASK);

  const canEditAndComment = canManage || grantApplication?.createdBy === user?.id;

  const canArchive =
    permissions?.includes(PERMISSIONS.MANAGE_BOARD) ||
    permissions?.includes(PERMISSIONS.FULL_ACCESS) ||
    grantApplication?.createdBy === user?.id;

  const displayTitle = grant?.title?.slice(0, 10);

  const handleGrantClick = () => {
    const url = `${delQuery(router.asPath)}?grant=${grant?.id}`;
    location.push(url);
    document.body.setAttribute('style', `position: fixed; top: -${window.scrollY}px; left:0; right:0`);
  };

  const status = useMemo(() => selectApplicationStatus(grantApplication), [grantApplication]);

  if (isEditMode) {
    return (
      <CreateGrantApplication isEditMode grantApplication={grantApplication} handleClose={() => setEditMode(false)} />
    );
  }

  const statusAndIcon = GRANT_APPLICATION_STATUS_LABELS[status];
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

      <GrantModalCard fullScreen={isFullScreen}>
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
            <Menu
              canEdit={canEditAndComment}
              canDelete={canArchive}
              canArchive={canArchive}
              setEditTask={setEditMode}
            />

            <TaskModalHeaderCloseModal onClick={onClose} />
          </TaskModalHeaderWrapperRight>
        </TaskModalHeader>
        <TaskModalTaskData fullScreen={isFullScreen}>
          <TaskModalTitleDescriptionMedia fullScreen={isFullScreen}>
            <Grid display="flex" justifyContent="space-between" alignItems="center">
              <TaskModalTitle>{grantApplication?.title}</TaskModalTitle>
              <ItemPill>
                <IconWrapper>
                  <statusAndIcon.icon />
                </IconWrapper>
                <Typography color={palette.white} fontWeight={500} fontSize={14} fontFamily={typography.fontFamily}>
                  {statusAndIcon.label}
                </Typography>
              </ItemPill>
            </Grid>
            <DescriptionWrapper>
              <RichTextViewer text={grantApplication?.description} />
              <TaskMediaWrapper media={grantApplication?.media} />
            </DescriptionWrapper>
          </TaskModalTitleDescriptionMedia>
          <TaskSectionDisplayDivWrapper fullScreen={isFullScreen}>
            <TaskSectionDisplayData>
              {!!grantApplication &&
                FIELDS_CONFIG.map((field, idx) => {
                  if (
                    field?.shouldDisplay &&
                    !field?.shouldDisplay({
                      hasManageRights: canManage,
                      isApproved: status === GRANT_APPLICATION_STATUSES.APPROVED,
                    })
                  ) {
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
              showCommentBox: canEditAndComment,
              showComments: true,
            }}
          />
        </TaskModalTaskData>
      </GrantModalCard>
    </>
  );
};

export default withAuth(ViewGrantApplication);