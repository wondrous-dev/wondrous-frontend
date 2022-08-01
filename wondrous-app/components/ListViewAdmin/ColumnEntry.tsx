import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { DAOIcon } from 'components/Icons/dao';
import PodIcon from 'components/Icons/podIcon';
import Tooltip from 'components/Tooltip';
import { ListViewItemBodyWrapper, ListViewItemDataContainer, ListViewItemActions } from 'components/ListView/styles';
import { NoLogoDAO } from 'components/SideBar/styles';
import { BoldName, Description } from './styles';
import { RequestDeclineButton, RequestApproveButton } from 'components/organization/members/styles';
import { TASK_STATUS_SUBMISSION_REQUEST, PERMISSIONS, TASK_STATUS_DONE } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';

interface Props {
  userProfilePicture: string;
  orgUsername: string;
  orgProfilePicture: string;
  podColor: string;
  podId: string;
  podName: string;
  userUsername: string;
  id: string;
  creatorProfilePicture?: string;
  creatorUsername?: string;
  message?: string;
  title?: string;
  type: string;
  commentCount?: number;
  taskId?: string;
  selectTask: (id: string, type: string) => any;
  orgId?: string;
  userPermissionsContext?: any;
  status?: string;
}

function ColumnEntry(props: Props) {
  const {
    userProfilePicture,
    orgUsername,
    orgProfilePicture,
    podColor,
    podName,
    podId,
    userUsername,
    id,
    creatorProfilePicture,
    creatorUsername,
    message,
    title,
    type,
    taskId,
    selectTask,
    orgId,
    userPermissionsContext,
    status,
  } = props;

  const permissions = parseUserPermissionContext({
    userPermissionsContext: userPermissionsContext,
    orgId: orgId,
    podId: podId,
  });

  const canReview =
    (permissions.includes(PERMISSIONS.FULL_ACCESS) || permissions.includes(PERMISSIONS.REVIEW_TASK)) &&
    status !== TASK_STATUS_DONE;

  let Buttons = [
    {
      component: RequestDeclineButton,
      label: 'Decline',
    },
    {
      component: RequestApproveButton,
      label: 'Approve',
    },
  ];

  if (type === TASK_STATUS_SUBMISSION_REQUEST) {
    Buttons = canReview ? [{ component: RequestDeclineButton, label: 'Request changes' }, ...Buttons] : [];
  }
  // submissions have a creator while memberships have userProfilePicture, but it's the same type

  const userAvatar = userProfilePicture || creatorProfilePicture;
  const username = userUsername || creatorUsername;
  const entryMessage = message ? `"${message}"` : title;

  const handleItemClick = () => {
    //used for proposals
    const viewItemId = taskId || id;
    selectTask(viewItemId, type);
  };
  return (
    <>
      <ListViewItemBodyWrapper onClick={handleItemClick}>
        <ListViewItemDataContainer>
          <Tooltip title={orgUsername}>
            <div>
              {orgProfilePicture ? (
                <SafeImage
                  useNextImage={false}
                  src={orgProfilePicture}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '6px',
                  }}
                />
              ) : (
                <NoLogoDAO>
                  <DAOIcon />
                </NoLogoDAO>
              )}
            </div>
          </Tooltip>
          <Tooltip title={podName}>
            {podId ? (
              <div>
                <PodIcon
                  color={podColor}
                  style={{
                    width: '30px',
                    height: '30px',
                  }}
                />
              </div>
            ) : null}
          </Tooltip>
          <Tooltip title={username}>
            <div>
              {userAvatar ? (
                <SafeImage
                  useNextImage={false}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '13px',
                    marginRight: '4px',
                  }}
                  src={userAvatar}
                />
              ) : (
                <DefaultUserImage
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '13px',
                    marginRight: '4px',
                  }}
                />
              )}
            </div>
          </Tooltip>
          <BoldName>{username}</BoldName>

          <Description>{entryMessage}</Description>
        </ListViewItemDataContainer>
        <ListViewItemActions>
          {Buttons.map((btn, idx) => {
            const Button = btn.component;
            return <Button key={idx}> {btn.label}</Button>;
          })}
        </ListViewItemActions>
      </ListViewItemBodyWrapper>
    </>
  );
}

export default ColumnEntry;
