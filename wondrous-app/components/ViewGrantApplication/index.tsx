import { useMe, withAuth } from 'components/Auth/withAuth';
import { ArchiveTaskModal } from 'components/Common/ArchiveTaskModal';
import DeleteEntityModal from 'components/Common/DeleteEntityModal';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import { Menu } from 'components/Common/TaskViewModal/helpers';
import {
  TaskCardOrgNoLogo,
  TaskCardOrgPhoto,
  TaskCardPodIcon,
  TaskMediaWrapper,
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
import { GrantPaymentData } from 'components/ViewGrant/Fields';
import ViewGrantFooter from 'components/ViewGrant/Footer';
import { DescriptionWrapper } from 'components/ViewGrant/styles';
import { GET_GRANT_APPLICATION_BY_ID } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  ENTITIES_TYPES,
  GRANT_APPLICATION_DELETE_STATUSES,
  GRANT_APPLICATION_EDITABLE_STATUSES,
  GRANT_APPLICATION_STATUSES,
  PERMISSIONS,
  PRIVACY_LEVEL,
} from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useGlobalContext, useTaskContext } from 'utils/hooks';

import { useQuery } from '@apollo/client';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { IconWrapper } from 'components/Common/Status/styles';
import { SubmissionItemStatusChangesRequestedIcon } from 'components/Common/TaskSubmission/styles';
import { ItemPill } from 'components/GrantsBoard/styles';
import { CompletedIcon, InReviewIcon, RejectedIcon, TodoIcon } from 'components/Icons/statusIcons';
import { selectApplicationStatus } from 'components/ViewGrant/utils';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { GrantApplicationStatusManager, OrgViewer, PaymentHandler, PodViewer, WalletAddressViewer } from './Fields';
import { GrantSectionDisplayLabel } from './styles';
import { Project, WalletAddress } from './EditableFields';
import { TaskContext } from 'utils/contexts';

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
    component: ({ grantApplication }) => <PodViewer grantApplication={grantApplication} />,
    shouldDisplay: ({ isApproved }) => isApproved,
  },
  {
    component: ({ grantApplication }) => <GrantApplicationStatusManager grantApplication={grantApplication} />,
    shouldDisplay: ({ hasManageRights }) => hasManageRights,
  },
  {
    label: 'Grant amount',
    component: ({ grantApplication: { grant } }) => <GrantPaymentData paymentData={grant?.reward || {}} />,
  },
  {
    component: ({ grantApplication }) => <PaymentHandler grantApplication={grantApplication} />,
    shouldDisplay: ({ isApproved, hasManageRights }) => isApproved && hasManageRights,
  },
  {
    label: 'Wallet Address',
    component: ({ grantApplication: { paymentAddress }, canEdit }) => (
      <WalletAddress canEdit={canEdit} paymentAddress={paymentAddress} />
    ),
  },
  {
    label: 'Project',
    component: ({ grantApplication, canEdit }) => <Project grantApplication={grantApplication} canEdit={canEdit} />,
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
  const { data } = useQuery(GET_GRANT_APPLICATION_BY_ID, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: {
      grantApplicationId: router?.query?.grantApplicationId,
    },
    skip: !router?.query?.grantApplicationId,
  });

  const grantApplication = data?.getGrantApplicationById;
  const grant = grantApplication?.grant;

  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;

  useEffect(() => {
    if (router?.query?.edit && !isEditMode) {
      setEditMode(true);
    }
  }, [router?.query?.edit]);

  const user = useMe();
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: grant?.orgId,
    podId: grant?.podId,
  });

  const canManage =
    permissions?.includes(PERMISSIONS.FULL_ACCESS) ||
    permissions?.includes(PERMISSIONS.REVIEW_TASK) ||
    permissions?.includes(PERMISSIONS.MANAGE_GRANTS);

  const canEditAndComment = canManage || grantApplication?.createdBy === user?.id;

  const canArchive =
    permissions?.includes(PERMISSIONS.REVIEW_TASK) ||
    permissions?.includes(PERMISSIONS.FULL_ACCESS) ||
    permissions?.includes(PERMISSIONS.MANAGE_GRANTS) ||
    grantApplication?.createdBy === user?.id;

  const displayTitle = grant?.title?.slice(0, 10);

  const handleGrantClick = () => {
    const query = { ...router.query };
    delete query.grantApplicationId;

    router.push({ pathname: router.pathname, query }, undefined, { scroll: false, shallow: true });
  };

  const status = useMemo(() => selectApplicationStatus(grantApplication), [grantApplication]);

  const canDelete = canArchive && GRANT_APPLICATION_DELETE_STATUSES.includes(status);

  if (isEditMode) {
    return (
      <CreateGrantApplication isEditMode grantApplication={grantApplication} handleClose={() => setEditMode(false)} />
    );
  }

  const statusAndIcon = GRANT_APPLICATION_STATUS_LABELS[status];
  return (
    <TaskContext.Provider
      value={{
        grantApplication,
      }}
    >
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
      <DeleteEntityModal
        open={deleteTask}
        onClose={() => {
          setDeleteTask(false);
        }}
        entityType={ENTITIES_TYPES.GRANT_APPLICATION}
        taskId={grantApplication?.id}
        onDelete={() => {
          setSnackbarAlertOpen(true);
          setSnackbarAlertMessage(`Deleted successfully!`);
          const query = { ...router.query };
          delete query.grantApplicationId;

          router.push(
            {
              pathname: router.pathname,
              query,
            },
            undefined,
            {
              shallow: true,
            }
          );
        }}
      />

      <TaskModalCard fullScreen={isFullScreen}>
        <TaskModalHeader>
          <TaskModalHeaderWrapper>
            <TaskModalHeaderIconWrapper
              onClick={() => {
                onClose();
                router.push(`/organization/${grant?.org?.username}/home`, undefined, {
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
              canDelete={canDelete}
              canArchive={canArchive}
              setEditTask={setEditMode}
              setDeleteTask={setDeleteTask}
            />

            <TaskModalHeaderCloseModal onClick={onClose} />
          </TaskModalHeaderWrapperRight>
        </TaskModalHeader>
        <TaskModalTaskData fullScreen={isFullScreen}>
          <TaskModalTitleDescriptionMedia fullScreen={isFullScreen}>
            <Grid display="flex" justifyContent="space-between" alignItems="center">
              <TaskModalTitle>{grantApplication?.title}</TaskModalTitle>
              <ItemPill withIcon>
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
                      <field.component grantApplication={grantApplication} canEdit={canEditAndComment} />
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
      </TaskModalCard>
    </TaskContext.Provider>
  );
};

export default withAuth(ViewGrantApplication);
