import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { DAOIcon } from 'components/Icons/dao';
import PodIcon from 'components/Icons/podIcon';
import { RichTextViewer } from 'components/RichText';
import Tooltip from 'components/Tooltip';
import { TASK_STATUS_SUBMISSION_REQUEST, TASK_STATUS_PROPOSAL_REQUEST, MEMBERSHIP_REQUESTS } from 'utils/constants';
import { ListViewItemBodyWrapper, ListViewItemDataContainer, ListViewItemActions } from 'components/ListView/styles';
import { NoLogoDAO } from 'components/SideBar/styles';
import { BoldName, Description } from './styles';
import { RequestDeclineButton, RequestApproveButton } from 'components/organization/members/styles';
interface Props {
  userProfilePicture: string;
  orgUsername: string;
  orgProfilePicture: string;
  podColor: string;
  podId: string;
  podName: string;
  userId: string;
  userUsername: string;
  id: string;
  creatorProfilePicture?: string;
  creatorUsername?: string;
  description?: string;
  message?: string;
  title?: string;
  type: string;
  commentCount?: number;
  taskId?: string;
}

function ColumnEntry(props: Props) {
  const {
    userProfilePicture,
    orgUsername,
    orgProfilePicture,
    podColor,
    podName,
    podId,
    userId,
    userUsername,
    id,
    creatorProfilePicture,
    creatorUsername,
    description,
    message,
    title,
    type,
    commentCount,
    taskId,
  } = props;

  // submissions have a creator while memberships have userProfilePicture, but it's the same type

  const userAvatar = userProfilePicture || creatorProfilePicture;
  const username = userUsername || creatorUsername;
  const entryMessage = message ? `"${message}"` : title;
  return (
    <ListViewItemBodyWrapper>
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
                  width: '26px',
                  height: '26px',
                  marginRight: '8px',
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
        <RequestDeclineButton>Decline</RequestDeclineButton>
        <RequestApproveButton>Approve</RequestApproveButton>
      </ListViewItemActions>
    </ListViewItemBodyWrapper>
  );
}

export default ColumnEntry;
