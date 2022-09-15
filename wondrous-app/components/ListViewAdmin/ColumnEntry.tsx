import { useMutation } from '@apollo/client';
import {
  TASK_STATUS_SUBMISSION_REQUEST,
  PERMISSIONS,
  TASK_STATUS_DONE,
  ORG_MEMBERSHIP_REQUESTS,
  POD_MEMBERSHIP_REQUESTS,
  TASK_STATUS_PROPOSAL_REQUEST,
} from 'utils/constants';
import { parseUserPermissionContext, deleteFromCache } from 'utils/helpers';
import { APPROVE_JOIN_ORG_REQUEST, REJECT_JOIN_ORG_REQUEST } from 'graphql/mutations/org';
import { APPROVE_JOIN_POD_REQUEST, REJECT_JOIN_POD_REQUEST } from 'graphql/mutations/pod';
import {
  APPROVE_TASK_PROPOSAL,
  CLOSE_TASK_PROPOSAL,
  APPROVE_SUBMISSION,
  REQUEST_CHANGE_SUBMISSION,
  REJECT_SUBMISSION,
} from 'graphql/mutations';
import palette from 'theme/palette';
import KudosForm from 'components/Common/KudosForm';
import { useContext, useState } from 'react';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { LinkIcon, DueDateIcon } from 'components/Icons/taskModalIcons';
import { Rewards } from 'components/Common/TaskViewModal/helpers';
import { ListViewItemBodyWrapper, ListViewItemDataContainer, ListViewItemActions } from 'components/ListView/styles';
import { NoLogoDAO } from 'components/Common/SidebarMain/styles';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { DAOIcon } from 'components/Icons/dao';
import PodIcon from 'components/Icons/podIcon';
import Tooltip from 'components/Tooltip';
import { format } from 'date-fns';
import { GET_JOIN_ORG_REQUESTS } from 'graphql/queries';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import {
  BoldName,
  Description,
  IconsWrapper,
  IconContainer,
  MediaIcon,
  ApproveButton,
  DeclineButton,
  RequestChangesButton,
  DueDateWrapper,
} from './styles';

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
  userId?: string;
  taskDueDate?: string;
  rewards?: any;
  links?: any;
  media?: any;
  taskStatus?: string;
  setKudosFormData: (data: any) => any;
  createdBy?: string;
  isGr15Contributor?: boolean;
}

export const ICON_TYPES = {
  MEDIA: 'media',
  LINK: 'link',
};

const ICONS = {
  [ICON_TYPES.MEDIA]: MediaIcon,
  [ICON_TYPES.LINK]: LinkIcon,
};
export const IconsList = ({ items = [], type = ICON_TYPES.LINK }) => {
  const Icon = ICONS[type];
  return (
    <IconsWrapper>
      {items.map((link, idx) => (
        <IconContainer key={idx}>{Icon ? <Icon stroke={palette.white} /> : null}</IconContainer>
      ))}
    </IconsWrapper>
  );
};

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
    userId,
    rewards,
    taskDueDate,
    links,
    media,
    taskStatus,
    isGr15Contributor,
    setKudosFormData,
    createdBy,
  } = props;
  const [isKudosModalOpen, setKudosModalOpen] = useState(false);
  const [openGR15Modal, setOpenGR15Modal] = useState(false);
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useContext(SnackbarAlertContext);
  const refetchQueries = ['getWorkFlowBoardReviewableItemsCount'];

  const onError = (e) => {
    setSnackbarAlertOpen(true);
    setSnackbarAlertMessage('Woops! Something went wrong');
  };
  const [approveJoinOrgRequest] = useMutation(APPROVE_JOIN_ORG_REQUEST, {
    update: (cache, { data }) => deleteFromCache(cache, data, 'approveJoinOrgRequest', 'getJoinOrgRequests', id),
    refetchQueries,
    onError,
  });
  const [rejectJoinOrgRequest] = useMutation(REJECT_JOIN_ORG_REQUEST, {
    update: (cache, { data }) => deleteFromCache(cache, data, 'rejectJoinOrgRequest', 'getJoinOrgRequests', id),
    refetchQueries,
    onError,
  });
  const [approveJoinPodRequest] = useMutation(APPROVE_JOIN_POD_REQUEST, {
    update: (cache, { data }) => deleteFromCache(cache, data, 'approveJoinPodRequest', 'getJoinPodRequests', id),
    refetchQueries,
    onError,
  });
  const [rejectJoinPodRequest] = useMutation(REJECT_JOIN_POD_REQUEST, {
    update: (cache, { data }) => deleteFromCache(cache, data, 'rejectJoinPodRequest', 'getJoinPodRequests', id),
    refetchQueries,
    onError,
  });
  const [approveTaskProposal] = useMutation(APPROVE_TASK_PROPOSAL, {
    update: (cache, { data }) => deleteFromCache(cache, data, 'approveProposal', 'getProposalsUserCanReview', id, true),
    refetchQueries,
    onError,
  });
  const [closeTaskProposal] = useMutation(CLOSE_TASK_PROPOSAL, {
    update: (cache, { data }) =>
      deleteFromCache(cache, data, 'closeTaskProposal', 'getProposalsUserCanReview', id, true),
    refetchQueries,
    onError,
  });
  const [approveTaskSubmission] = useMutation(APPROVE_SUBMISSION, {
    update: (cache, { data }) =>
      deleteFromCache(cache, data, 'approveTaskSubmission', 'getSubmissionsUserCanReview', id, true),
    refetchQueries,
    onError,
  });
  const [requestChangeTaskSubmission] = useMutation(REQUEST_CHANGE_SUBMISSION, {
    update: (cache, { data }) =>
      deleteFromCache(cache, data, 'requestChangeTaskSubmission', 'getSubmissionsUserCanReview', id, true),
    refetchQueries,
    onError,
  });
  const [rejectTaskSubmission] = useMutation(REJECT_SUBMISSION, {
    update: (cache, { data }) =>
      deleteFromCache(cache, data, 'rejectTaskSubmission', 'getSubmissionsUserCanReview', id, true),
    refetchQueries,
    onError,
  });
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId,
    podId,
  });

  const canReview =
    (permissions.includes(PERMISSIONS.FULL_ACCESS) || permissions.includes(PERMISSIONS.REVIEW_TASK)) &&
    status !== TASK_STATUS_DONE;

  const handleMemberships = () => {
    const positiveCallback = () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage('Member accepted!');
    };
    const negativeCallback = () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage('Request declined!');
    };
    const config = {
      accept: () =>
        approveJoinOrgRequest({
          variables: {
            userId,
            orgId,
          },
        }).then(() => positiveCallback()),
      decline: () =>
        rejectJoinOrgRequest({
          variables: {
            userId,
            orgId,
          },
        }).then(() => negativeCallback()),
    };
    if (podId) {
      config.accept = () => approveJoinPodRequest({ variables: { userId, podId } }).then(() => positiveCallback());
      config.decline = () => rejectJoinPodRequest({ variables: { userId, podId } }).then(() => negativeCallback());
    }
    return config;
  };

  const actionMapper: any = (e) => {
    e.preventDefault();
    if ([ORG_MEMBERSHIP_REQUESTS, POD_MEMBERSHIP_REQUESTS].includes(type)) {
      return handleMemberships();
    }
    if (type === TASK_STATUS_SUBMISSION_REQUEST) {
      return {
        accept: () => {
          approveTaskSubmission({ variables: { submissionId: id } }).then(() => {
            setSnackbarAlertMessage('Submission approved');
            setSnackbarAlertOpen(true);
            setKudosFormData({ id, podId, orgId, createdBy });
          });
        },
        decline: () =>
          rejectTaskSubmission({ variables: { submissionId: id } }).then(() => {
            setSnackbarAlertOpen(true);

            setSnackbarAlertMessage('Submission declined');
          }),
        requestChanges: () =>
          requestChangeTaskSubmission({ variables: { submissionId: id } }).then(() => {
            setSnackbarAlertOpen(true);
            setSnackbarAlertMessage('Changes requested');
          }),
      };
    }
    if (type === TASK_STATUS_PROPOSAL_REQUEST) {
      return {
        accept: () =>
          approveTaskProposal({ variables: { proposalId: id } }).then(() => {
            setSnackbarAlertOpen(true);

            setSnackbarAlertMessage('Proposal approved');
          }),
        decline: () =>
          closeTaskProposal({ variables: { proposalId: id } }).then(() => {
            setSnackbarAlertOpen(true);

            setSnackbarAlertMessage('Proposal rejected');
          }),
      };
    }
  };

  let Buttons: any = [
    {
      component: DeclineButton,
      label: 'Decline',
      action: (e) => actionMapper(e).decline(),
    },
    {
      component: ApproveButton,
      label: 'Approve',
      action: (e) => actionMapper(e).accept(),
      isCompleted: taskStatus === TASK_STATUS_DONE,
      isCompletedLabel: 'Task approved',
    },
  ];

  if (type === TASK_STATUS_SUBMISSION_REQUEST) {
    Buttons = canReview
      ? [
          {
            component: RequestChangesButton,
            label: 'Amends',
            action: (e) => actionMapper(e).requestChanges(),
          },
          ...Buttons,
        ]
      : [];
  }
  // submissions have a creator while memberships have userProfilePicture, but it's the same type

  const userAvatar = userProfilePicture || creatorProfilePicture;
  const username = userUsername || creatorUsername;
  const entryMessage = message ? `"${message}"` : title;

  const handleItemClick = () => {
    // used for proposals
    const viewItemId = taskId || id;
    selectTask(viewItemId, type);
  };

  return (
    <ListViewItemBodyWrapper>
      <ListViewItemDataContainer onClick={handleItemClick}>
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
        {isGr15Contributor && (
          <>
            <GR15DEIModal open={openGR15Modal} onClose={() => setOpenGR15Modal(false)} />
            <GR15DEILogo
              style={{
                marginLeft: '-8px',
              }}
              width="28"
              height="28"
              onClick={() => setOpenGR15Modal(true)}
            />
          </>
        )}
        <BoldName>{username}</BoldName>

        <Description>{entryMessage}</Description>
        {links ? <IconsList items={links} /> : null}
        {media ? <IconsList items={media} type={ICON_TYPES.MEDIA} /> : null}
      </ListViewItemDataContainer>
      <ListViewItemActions>
        {taskDueDate ? (
          <DueDateWrapper>
            <DueDateIcon />
            {format(new Date(taskDueDate), 'MMM dd')}
          </DueDateWrapper>
        ) : null}
        {rewards ? <Rewards user={null} withLabel={false} fetchedTask={{ rewards }} /> : null}
        {Buttons.map((btn, idx) => {
          const Button = btn.component;
          return (
            <Button
              type="button"
              isCompleted={btn.isCompleted}
              disabled={btn.isCompleted}
              onClick={btn.action}
              key={idx}
            >
              <span>{btn.isCompleted ? btn.isCompletedLabel : btn.label}</span>
            </Button>
          );
        })}
      </ListViewItemActions>
    </ListViewItemBodyWrapper>
  );
}

export default ColumnEntry;
