import { useCallback, useContext, useMemo, useRef, useState } from 'react';
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
  TaskModalHeaderBackToList,
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
import {
  LockedTaskMessage,
  Menu,
  TaskDescriptionTextWrapper,
  TaskSectionLabel,
} from 'components/Common/TaskViewModal/helpers';
import { DAOIcon } from 'components/Icons/dao';
import { useRouter } from 'next/router';
import { RichTextViewer } from 'components/RichText';
import CreateGrant from 'components/CreateGrant';
import { Categories, DataDisplay, Dates, GrantAmount, Reviewers } from './Fields';
import { canViewGrant } from './utils';
import { DescriptionWrapper } from './styles';
import ViewGrantFooter from './Footer';

const grant = {
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
};

const FIELDS_CONFIG = [
  {
    label: 'Reviewers',
    component: ({ grant: { reviewers } }) => <Reviewers reviewers={reviewers} />,
    shouldDisplay: ({ grant: { reviewers } }): boolean => !!reviewers?.length,
  },
  {
    label: 'Grant amount',
    component: ({ grant: { grantAmount } }) => <GrantAmount grantAmount={grantAmount} />,
    shouldDisplay: ({ grant: { grantAmount } }): boolean => !!grantAmount?.paymentMethodId,
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

const ViewGrant = ({ open, handleClose, grantId }) => {
  const [isEditMode, setEditMode] = useState(false);
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

  return (
    <TaskModal open={open} onClose={handleClose}>
      {isEditMode ? (
        <CreateGrant
          existingGrant={grant}
          entityType={ENTITIES_TYPES.GRANT}
          handleClose={handleClose}
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

                  <TaskModalHeaderCloseModal onClick={() => handleClose()} />
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
                <ViewGrantFooter isFullScreen={isFullScreen} />
              </TaskModalTaskData>
            </>
          ) : (
            <LockedTaskMessage handleClose={handleClose} />
          )}
        </TaskModalCard>
      )}
    </TaskModal>
  );
};

export default ViewGrant;
