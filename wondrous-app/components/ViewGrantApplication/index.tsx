import { useMe, withAuth } from 'components/Auth/withAuth';
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
import { DAOIcon } from 'components/Icons/dao';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
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
import { RichTextViewer } from 'components/RichText';
import { DescriptionWrapper } from 'components/ViewGrant/styles';
import { GrantAmount } from 'components/ViewGrant/Fields';
import { GrantApplicationStatusManager, WalletAddressViewer } from './Fields';
import { GrantAmountContainer, GrantSectionDisplayLabel, ModalCard } from './styles';
import { useQuery } from '@apollo/client';
import { GET_GRANT_APPLICATION_BY_ID } from 'graphql/queries';
import CreateGrantApplication from 'components/GrantApplications/CreateGrantApplication';

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

  const user = useMe();
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: grant?.orgId,
    podId: grant?.podId,
  });
  
  const canManage =
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    permissions.includes(PERMISSIONS.EDIT_TASK) ||
    grant?.createdBy === user?.id;

  const canArchive =
    permissions.includes(PERMISSIONS.MANAGE_BOARD) ||
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    grant?.createdBy === user?.id;

  const displayTitle = grant?.title?.slice(0, 10);

  const handleGrantClick = () => {
    const url = `${delQuery(router.asPath)}?grant=${grant?.id}`;
    location.push(url);
    document.body.setAttribute('style', `position: fixed; top: -${window.scrollY}px; left:0; right:0`);
  };

  if(isEditMode) {
    return (
      <CreateGrantApplication 
      isEditMode
      grantApplication={grantApplication}
      handleClose={() => setEditMode(false)}
      />
    )
  }
  return (
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
          <Menu canEdit={canManage} canArchive={canArchive} setEditTask={setEditMode} />

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
      </TaskModalTaskData>
    </ModalCard>
  );
};

export default withAuth(ViewGrantApplication);
