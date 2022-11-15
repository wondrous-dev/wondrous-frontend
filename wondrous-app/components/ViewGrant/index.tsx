import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { ENTITIES_TYPES, PERMISSIONS, PRIVACY_LEVEL } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useBoards, useFullScreen, useGlobalContext } from 'utils/hooks';
import { useMe } from 'components/Auth/withAuth';
import { TaskModal, TaskModalHeaderWrapperRight } from 'components/Common/Task/styles';
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
  TaskModalTaskData,
  TaskModalTitle,
  TaskModalTitleDescriptionMedia,
  TaskSectionDisplayData,
  TaskSectionDisplayDiv,
  TaskSectionDisplayDivWrapper,
} from 'components/Common/TaskViewModal/styles';
import { LockedTaskMessage, Menu, TaskSectionLabel } from 'components/Common/TaskViewModal/helpers';
import { DAOIcon } from 'components/Icons/dao';
import { useRouter } from 'next/router';
import { RichTextViewer } from 'components/RichText';
import CreateGrant from 'components/CreateGrant';
import CreateGrantApplication from 'components/GrantApplications/CreateGrantApplication';
import { TaskContext } from 'utils/contexts';
import { useLocation } from 'utils/useLocation';
import ViewGrantApplication from 'components/ViewGrantApplication';
import { Categories, DataDisplay, Dates, GrantAmount } from './Fields';
import { canViewGrant } from './utils';
import { DescriptionWrapper } from './styles';
import ViewGrantFooter from './Footer';
import { useQuery } from '@apollo/client';
import { GET_GRANT_BY_ID } from 'graphql/queries';

const FIELDS_CONFIG = [
  {
    label: 'Grant amount',
    component: ({ grant: { reward, numOfGrant } }) => <GrantAmount grantAmount={reward} numOfGrant={numOfGrant}/>,

    shouldDisplay: ({ grant: { reward } }): boolean => !!reward?.paymentMethodId,
  },
  {
    label: 'Dates',
    component: ({ grant: { startDate, endDate } }) => <Dates startDate={startDate} endDate={endDate} />,
    shouldDisplay: ({ grant: { startDate, endDate } }): boolean => !!(startDate || endDate),
  },
  {
    label: 'Eligibility',
    component: ({ grant: { applyPolicy } }) => <DataDisplay label={applyPolicy} />,
  },
  {
    label: 'Visibility',
    component: ({ grant: { privacyLevel } }) => <DataDisplay label={privacyLevel} />,
  },
  {
    label: 'Categories',
    component: ({ grant: { categories } }) => <Categories categories={categories} />,
    shouldDisplay: ({ grant: { categories } }): boolean => !!categories?.length,
  },
];

const ViewGrant = ({ open, handleClose, grantId, isEdit = false}) => {
  console.log(isEdit, 'isEdit')
  const [isEditMode, setEditMode] = useState(isEdit);
  const board = useBoards();
  const { isFullScreen, toggleFullScreen } = useFullScreen(true);
  const [completeModal, setCompleteModal] = useState(false);
  const location = useLocation();

  
  const isViewApplication = !!location.params.grantApplicationId;

  const { data, loading } = useQuery(GET_GRANT_BY_ID, {
    variables: { grantId },
    skip: !grantId || isViewApplication,
  });

  const router = useRouter();
  const globalContext = useGlobalContext();
  const getUserPermissionContext = useCallback(() => globalContext?.userPermissionsContext, [globalContext]);
  const userPermissionsContext = getUserPermissionContext();

  const [isCreateApplicationModalVisible, setCreateApplicationModalVisible] = useState(false);

  const toggleCreateApplicationModal = () => setCreateApplicationModalVisible((prevState) => !prevState);

  useEffect(() => {
    if(isEdit !== isEditMode) {
      setEditMode(isEdit)
    }
  }, [isEdit])

  const [activeTab, setActiveTab] = useState(null);
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: data?.getGrantById?.org?.id,
    podId: data?.getGrantById?.pod?.id,
  });

  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;

  const sectionRef = useRef(null);

  const grant = data?.getGrantById
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
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    permissions.includes(PERMISSIONS.EDIT_TASK) ||
    grant?.createdBy === user?.id

  const canArchive =
    permissions.includes(PERMISSIONS.MANAGE_BOARD) ||
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    grant?.createdBy === user?.id;

  const GrantApplication = () => isCreateApplicationModalVisible && grantId && <CreateGrantApplication />;
  
  const Grant = () => {
    if(loading) return null
    if (isViewApplication) {
      return <ViewGrantApplication onClose={onClose} />;
    }
    if (isCreateApplicationModalVisible) return null;
    return isEditMode ? (
      <CreateGrant
        existingGrant={grant}
        entityType={ENTITIES_TYPES.GRANT}
        handleClose={onClose}
        cancel={() => setEditMode(false)}
      />
    ) : (
      <TaskModalCard fullScreen={isFullScreen}>
        {canView ? (
          <>
            <TaskModalHeader>
              <TaskModalHeaderWrapper>
                <TaskModalHeaderIconWrapper
                  onClick={() => {
                    onClose();
                    router.push(`/organization/${grant?.org?.username}/boards`, undefined, {
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
                  <TaskModalHeaderTypography>{grant?.org.name}</TaskModalHeaderTypography>
                </TaskModalHeaderIconWrapper>
                <TaskModalHeaderIconWrapper>
                  <TaskCardPodIcon color={grant?.pod?.color} />
                  <TaskModalHeaderTypography>{grant?.pod?.name}</TaskModalHeaderTypography>
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
                <Menu canArchive={canArchive} canEdit={canEdit} setEditTask={setEditMode} />

                <TaskModalHeaderCloseModal onClick={onClose} />
              </TaskModalHeaderWrapperRight>
            </TaskModalHeader>
            <TaskModalTaskData fullScreen={isFullScreen}>
              <TaskModalTitleDescriptionMedia fullScreen={isFullScreen}>
                <TaskModalTitle>{grant?.title}</TaskModalTitle>
                <DescriptionWrapper>
                  <RichTextViewer text={grant.description} />
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
              <ViewGrantFooter />
            </TaskModalTaskData>
          </>
        ) : (
          <LockedTaskMessage handleClose={onClose} />
        )}
      </TaskModalCard>
    );
  };
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
      <TaskModal open={open} onClose={onClose}>
      <>
      <GrantApplication />
          <Grant />
      </>

      </TaskModal>
    </TaskContext.Provider>
  );
};

export default ViewGrant;
