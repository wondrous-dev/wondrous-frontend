import { useMe, withAuth } from 'components/Auth/withAuth';
import { TaskModal, TaskModalHeaderWrapperRight } from 'components/Common/Task/styles';
import { LockedTaskMessage, Menu, TaskSectionLabel } from 'components/Common/TaskViewModal/helpers';
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
  TaskModalTaskData,
  TaskModalTitle,
  TaskModalTitleDescriptionMedia,
  TaskSectionDisplayData,
  TaskSectionDisplayDiv,
  TaskSectionDisplayDivWrapper,
} from 'components/Common/TaskViewModal/styles';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ENTITIES_TYPES, PERMISSIONS, PRIVACY_LABELS, PRIVACY_LEVEL } from 'utils/constants';
import { useBoards, useFullScreen, useGlobalContext } from 'utils/hooks';

import { useQuery } from '@apollo/client';
import { ArchiveTaskModal } from 'components/Common/ArchiveTaskModal';
import DeleteEntityModal from 'components/Common/DeleteEntityModal';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import CreateEntityDiscardTask from 'components/CreateEntityDiscardTask';
import CreateGrant from 'components/CreateGrant';
import { APPLY_POLICY_FIELDS } from 'components/CreateGrant/Fields/ApplyPolicy';
import { GrantModalCard } from 'components/CreateGrant/styles';
import CreateGrantApplication from 'components/GrantApplications/CreateGrantApplication';
import { DAOIcon } from 'components/Icons/dao';
import { RichTextViewer } from 'components/RichText';
import ViewGrantApplication from 'components/ViewGrantApplication';
import { GET_GRANT_BY_ID } from 'graphql/queries';
import { useRouter } from 'next/router';
import { TaskContext } from 'utils/contexts';
import { parseUserPermissionContext } from 'utils/helpers';
import { Categories, DataDisplay, Dates, GrantPaymentData } from './Fields';
import ViewGrantFooter from './Footer';
import GrantMenuStatus from './GrantMenuStatus';
import { DescriptionWrapper } from './styles';
import { canViewGrant } from './utils';

const FIELDS_CONFIG = [
  {
    label: 'Grant amount',
    component: ({ grant: { reward, numOfGrant } }) => <GrantPaymentData paymentData={reward} numOfGrant={numOfGrant} />,

    shouldDisplay: ({ grant: { reward } }): boolean => !!reward?.paymentMethodId,
  },
  {
    label: 'Dates',
    component: ({ grant: { startDate, endDate } }) => <Dates startDate={startDate} endDate={endDate} />,
    shouldDisplay: ({ grant: { startDate, endDate } }): boolean => !!(startDate || endDate),
  },
  {
    label: 'Eligibility',
    component: ({ grant: { applyPolicy } }) => (
      <DataDisplay label={APPLY_POLICY_FIELDS.find((policy) => policy.value === applyPolicy)?.name} />
    ),
  },
  {
    label: 'Visibility',
    component: ({ grant: { privacyLevel } }) => <DataDisplay label={PRIVACY_LABELS[privacyLevel] || 'Private'} />,
  },
  {
    label: 'Categories',
    component: ({ grant: { categories } }) => <Categories categories={categories} />,
    shouldDisplay: ({ grant: { categories } }): boolean => !!categories?.length,
  },
];

const ViewGrant = ({ open, handleClose, grantId, isEdit = false, existingGrant = null }) => {
  const [isEditMode, setEditMode] = useState(isEdit);
  const { isFullScreen, toggleFullScreen } = useFullScreen(true);
  const [deleteTask, setDeleteTask] = useState(false);
  const [archiveTask, setArchiveTask] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);

  const router = useRouter();
  const isViewApplication = !!router.query?.grantApplicationId;
  const { data, loading } = useQuery(GET_GRANT_BY_ID, {
    variables: { grantId },
    skip: !grantId || isViewApplication,
  });
  const globalContext = useGlobalContext();
  const getUserPermissionContext = useCallback(() => globalContext?.userPermissionsContext, [globalContext]);
  const userPermissionsContext = getUserPermissionContext();

  const [isCreateApplicationModalVisible, setCreateApplicationModalVisible] = useState(false);

  const toggleCreateApplicationModal = () => setCreateApplicationModalVisible((prevState) => !prevState);

  useEffect(() => {
    if (isEdit !== isEditMode) {
      setEditMode(isEdit);
    }
  }, [isEdit]);

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: data?.getGrantById?.org?.id,
    podId: data?.getGrantById?.pod?.id,
  });

  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;

  const sectionRef = useRef(null);

  const grant = useMemo(() => data?.getGrantById || existingGrant, [data?.getGrantById, existingGrant]);

  const user = useMe();

  const onClose = () => {
    if (isCreateApplicationModalVisible) setCreateApplicationModalVisible(false);
    if (isEditMode) setEditMode(false);
    handleClose();
  };

  const canView = useMemo(
    () => canViewGrant(grant, userPermissionsContext, permissions),
    [grant, userPermissionsContext, permissions]
  );

  const canEdit =
    permissions?.includes(PERMISSIONS.FULL_ACCESS) ||
    permissions?.includes(PERMISSIONS.EDIT_TASK) ||
    grant?.createdBy === user?.id;

  const canArchive =
    permissions?.includes(PERMISSIONS.MANAGE_BOARD) ||
    permissions?.includes(PERMISSIONS.FULL_ACCESS) ||
    grant?.createdBy === user?.id;

  const toggleDiscard = () => setIsDiscardOpen((prevState) => !prevState);

  return (
    <TaskContext.Provider
      value={{
        isCreateApplicationModalVisible,
        toggleCreateApplicationModal,
        toggleFullScreen,
        isFullScreen,
        grant,
        setEditMode,
      }}
    >
      <CreateEntityDiscardTask
        open={isDiscardOpen}
        onClose={isEditMode || isCreateApplicationModalVisible ? toggleDiscard : onClose}
        onCloseFormModal={onClose}
        entityType={isCreateApplicationModalVisible ? 'grant application' : 'grant'}
      />

      <TaskModal open={open} onClose={isEditMode || isCreateApplicationModalVisible ? toggleDiscard : onClose}>
        <>
          <ArchiveTaskModal
            open={archiveTask}
            onArchive={() => {
              setSnackbarAlertOpen(true);
              setSnackbarAlertMessage(`Archived successfully!`);
            }}
            onClose={() => setArchiveTask(false)}
            taskType={ENTITIES_TYPES.GRANT}
            taskId={grant?.id}
          />
          <DeleteEntityModal
            open={deleteTask}
            onClose={() => {
              setDeleteTask(false);
            }}
            entityType={ENTITIES_TYPES.GRANT}
            taskId={grant?.id}
            onDelete={() => {
              setSnackbarAlertOpen(true);
              setSnackbarAlertMessage(`Deleted successfully!`);
            }}
          />

          {isCreateApplicationModalVisible && grantId ? <CreateGrantApplication /> : null}
          {isViewApplication ? <ViewGrantApplication onClose={onClose} /> : null}
          {!isCreateApplicationModalVisible && !isViewApplication && isEditMode ? (
            <CreateGrant
              existingGrant={grant}
              entityType={ENTITIES_TYPES.GRANT}
              handleClose={onClose}
              isEdit={isEditMode}
              cancel={() => setEditMode(false)}
            />
          ) : null}
          {!isCreateApplicationModalVisible && !isViewApplication && !isEditMode ? (
            <TaskModalCard fullScreen={isFullScreen}>
              {canView ? (
                <>
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
                        {grant?.org?.profilePicture ? (
                          <TaskCardOrgPhoto src={grant?.org?.profilePicture} />
                        ) : (
                          <TaskCardOrgNoLogo>
                            <DAOIcon />
                          </TaskCardOrgNoLogo>
                        )}
                        <TaskModalHeaderTypography>{grant?.org?.name}</TaskModalHeaderTypography>
                      </TaskModalHeaderIconWrapper>
                      {grant?.pod ? (
                        <TaskModalHeaderIconWrapper>
                          <TaskCardPodIcon color={grant?.pod?.color} />
                          <TaskModalHeaderTypography>{grant?.pod?.name}</TaskModalHeaderTypography>
                        </TaskModalHeaderIconWrapper>
                      ) : null}
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
                      <Menu
                        canArchive={canArchive}
                        canEdit={canEdit}
                        setEditTask={setEditMode}
                        setArchiveTask={setArchiveTask}
                        setDeleteTask={setDeleteTask}
                        canDelete={canArchive}
                      />

                      <TaskModalHeaderCloseModal onClick={onClose} />
                    </TaskModalHeaderWrapperRight>
                  </TaskModalHeader>
                  <TaskModalTaskData fullScreen={isFullScreen}>
                    <TaskModalTitleDescriptionMedia fullScreen={isFullScreen}>
                      <TaskModalTitle>{grant?.title}</TaskModalTitle>
                      <GrantMenuStatus
                        canEdit={canEdit}
                        currentStatus={grant?.status}
                        onUpdateSuccess={() => {
                          setSnackbarAlertMessage('Grant status updated successfully');
                          setSnackbarAlertOpen(true);
                        }}
                        onUpdateError={() => {
                          setSnackbarAlertMessage('Grant status update failed');
                          setSnackbarAlertOpen(true);
                        }}
                      />

                      <DescriptionWrapper>
                        <RichTextViewer text={grant.description} />
                        <TaskMediaWrapper media={grant?.media} />
                      </DescriptionWrapper>
                    </TaskModalTitleDescriptionMedia>
                    <TaskSectionDisplayDivWrapper fullScreen={isFullScreen}>
                      <TaskSectionDisplayData>
                        {FIELDS_CONFIG.map((field, idx) => {
                          if (field?.shouldDisplay && !field?.shouldDisplay({ grant })) {
                            return null;
                          }
                          return (
                            <TaskSectionDisplayDiv key={idx}>
                              <TaskSectionLabel>{field.label}</TaskSectionLabel>
                              <field.component grant={grant} />
                            </TaskSectionDisplayDiv>
                          );
                        })}
                      </TaskSectionDisplayData>
                    </TaskSectionDisplayDivWrapper>
                    <ViewGrantFooter
                      entity={grant}
                      commentCount={grant?.commentCount}
                      applicationsCount={grant?.applicationsCount}
                      approvedApplicationsCount={grant?.approvedApplicationsCount}
                    />
                  </TaskModalTaskData>
                </>
              ) : (
                <LockedTaskMessage handleClose={onClose} entityType={ENTITIES_TYPES.GRANT} />
              )}
            </TaskModalCard>
          ) : null}
        </>
      </TaskModal>
    </TaskContext.Provider>
  );
};

export default withAuth(ViewGrant);
