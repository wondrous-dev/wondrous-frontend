import { useMutation, useQuery } from '@apollo/client';
import { useMe } from 'components/Auth/withAuth';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import SmartLink from 'components/Common/SmartLink';
import { TASK_ICONS_LABELS } from 'components/Common/TaskSubtask/TaskSubtasks';
import { Claim } from 'components/Icons/claimTask';
import { UPDATE_TASK_ASSIGNEE } from 'graphql/mutations';
import { GET_SUBTASKS_FOR_TASK } from 'graphql/queries';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { delQuery } from 'utils';
import { MEDIA_TYPES, PRIVACY_LEVEL, TASK_STATUS_DONE, ENTITIES_TYPES } from 'utils/constants';
import { useTaskActions } from 'utils/hooks';
import {
  TaskSubtaskClaimButtonWrapper,
  TaskSubtaskCoverImageSafeImage,
  TaskSubtaskCoverImageWrapper,
  TaskSubtaskEmptyStateContainer,
  TaskSubTaskEmptyStateText,
  TaskSubtaskEmptyStateIcon,
  TaskSubtaskImageWrapper,
  TaskSubtaskItemContent,
  TaskSubtaskItemHeader,
  TaskSubtaskItemWrapper,
  TaskSubtaskPrivacyIcon,
  TaskSubtaskRewardAmount,
  TaskSubtaskRewardIcon,
  TaskSubtaskRewardWrapper,
  TaskSubtaskStatus,
  TaskSubtaskStatusLabel,
  TaskSubtaskTitle,
  TaskSubtaskWrapper,
} from './styles';

const LIMIT = 5;

export const useGetSubtasksForTask = ({ taskId, status }) => {
  const [ref, inView] = useInView({});
  const [hasMore, setHasMore] = useState(true);
  const { data, fetchMore, loading } = useQuery(GET_SUBTASKS_FOR_TASK, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
    variables: {
      taskId,
      limit: LIMIT,
      offset: 0,
      status,
    },
    onCompleted: (data) => setHasMore(data?.getSubtasksForTask.length >= LIMIT),
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchMore({
        variables: {
          offset: data?.getSubtasksForTask.length,
        },
      }).then(({ data: any }) => setHasMore(data?.getSubtasksForTask.length >= LIMIT));
    }
  }, [inView, fetchMore, data?.getSubtasksForTask, hasMore, loading]);
  return {
    data: data?.getSubtasksForTask,
    loading,
    hasMore,
    ref,
  };
};

function TaskSubtaskUserImage({ assignee }) {
  if (!assignee) return null;
  const profilePicture = assignee?.profilePicture;
  return (
    <TaskSubtaskImageWrapper>
      {profilePicture ? (
        <SafeImage useNextImage={false} src={profilePicture} alt="Profile picture" />
      ) : (
        <DefaultUserImage />
      )}
    </TaskSubtaskImageWrapper>
  );
}

function TaskSubtaskReward({ rewards }) {
  if (isEmpty(rewards)) return null;
  return (
    <>
      {rewards.map((reward, index) => {
        const { rewardAmount, icon } = reward;
        return (
          <TaskSubtaskRewardWrapper key={index}>
            <TaskSubtaskRewardIcon src={icon} />
            <TaskSubtaskRewardAmount>{rewardAmount}</TaskSubtaskRewardAmount>
          </TaskSubtaskRewardWrapper>
        );
      })}
    </>
  );
}

function TaskSubTaskPrivacyIconWrapper({ privacyLevel }) {
  const isPrivate = privacyLevel !== PRIVACY_LEVEL.public;
  return <TaskSubtaskPrivacyIcon isPrivate={isPrivate} tooltipTitle={isPrivate ? 'Members only' : 'Public'} />;
}

function TaskSubtaskStatusIcon({ status }) {
  const { Icon, label } = TASK_ICONS_LABELS[status];
  return (
    <TaskSubtaskStatus>
      <Icon />
      <TaskSubtaskStatusLabel>{label}</TaskSubtaskStatusLabel>
    </TaskSubtaskStatus>
  );
}

function TaskSubtaskCoverImage({ media }) {
  const coverMedia = media?.filter((media) => media.type === MEDIA_TYPES.IMAGE).slice(0, 3);
  if (isEmpty(coverMedia)) return null;
  return (
    <TaskSubtaskCoverImageWrapper>
      {coverMedia.map(({ slug }) => (
        <TaskSubtaskCoverImageSafeImage key={slug} src={slug} />
      ))}
    </TaskSubtaskCoverImageWrapper>
  );
}

function TaskSubTaskHasMore({ hasMore, loading, innerRef }) {
  if (hasMore && !loading) return <div ref={innerRef} />;
  return null;
}

const useUpdateTaskAssignee = () => {
  const [updateTaskAssignee] = useMutation(UPDATE_TASK_ASSIGNEE, {
    refetchQueries: [GET_SUBTASKS_FOR_TASK],
  });
  const handleUpdateTaskAssignee = ({ id, userId }) => {
    updateTaskAssignee({
      variables: {
        taskId: id,
        assigneeId: userId,
      },
    });
  };
  return handleUpdateTaskAssignee;
};

function TaskSubtaskClaimButton({ id, userId, assignee, taskApplicationPermissions, status }) {
  const canClaim = taskApplicationPermissions?.canClaim && status !== TASK_STATUS_DONE;
  const handleUpdateTaskAssignee = useUpdateTaskAssignee();
  const handleClaim = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleUpdateTaskAssignee({ id, userId });
  };
  if (assignee || !canClaim) return null;
  return (
    <TaskSubtaskClaimButtonWrapper onClick={handleClaim}>
      <Claim />
      Claim
    </TaskSubtaskClaimButtonWrapper>
  );
}

function TaskSubtaskEmptyState() {
  return (
    <TaskSubtaskEmptyStateContainer>
      <TaskSubtaskEmptyStateIcon />
      <TaskSubTaskEmptyStateText>No subtasks yet</TaskSubTaskEmptyStateText>
    </TaskSubtaskEmptyStateContainer>
  );
}

export const TaskSubtaskItem = (props) => {
  const router = useRouter();
  const { openTaskViewModal } = useTaskActions();
  const { query } = router;
  const { assignee, privacyLevel, rewards, status, title, id, media, taskApplicationPermissions, userId } = props;
  const subtaskUrl = `${delQuery(router.asPath)}?task=${id}&view=${query.view || 'grid'}&entity=task`;

  return (
    <div>
      <SmartLink href={subtaskUrl} preventLinkNavigation onNavigate={() => openTaskViewModal({ id })}>
        <TaskSubtaskItemWrapper>
          <TaskSubtaskItemHeader>
            <TaskSubtaskItemContent>
              <TaskSubtaskClaimButton
                id={id}
                userId={userId}
                assignee={assignee}
                taskApplicationPermissions={taskApplicationPermissions}
                status={status}
              />
              <TaskSubtaskUserImage assignee={assignee} />
              <TaskSubTaskPrivacyIconWrapper privacyLevel={privacyLevel} />
            </TaskSubtaskItemContent>
            <TaskSubtaskItemContent>
              <TaskSubtaskReward rewards={rewards} />
              <TaskSubtaskStatusIcon status={status} />
            </TaskSubtaskItemContent>
          </TaskSubtaskItemHeader>
          <TaskSubtaskTitle>
            <a href={subtaskUrl}>{title}</a>
          </TaskSubtaskTitle>
          <TaskSubtaskCoverImage media={media} />
        </TaskSubtaskItemWrapper>
      </SmartLink>
    </div>
  );
};

export function TaskSubtaskList({ taskId, status }) {
  const { hasMore, data, loading, ref } = useGetSubtasksForTask({ taskId, status });
  const loggedInUser = useMe();
  const userId = loggedInUser?.id;
  if (isEmpty(data)) return <TaskSubtaskEmptyState />;
  return (
    <TaskSubtaskWrapper>
      {data.map((subtask) => {
        const {
          assignee,
          privacyLevel,
          rewards,
          status: subTaskStatus,
          title,
          id,
          type,
          media,
          taskApplicationPermissions,
        } = subtask;
        return (
          <TaskSubtaskItem
            userId={userId}
            assignee={assignee}
            privacyLevel={privacyLevel}
            rewards={rewards}
            status={subTaskStatus}
            title={title}
            id={id}
            type={type}
            media={media}
            taskApplicationPermissions={taskApplicationPermissions}
          />
        );
      })}
      <TaskSubTaskHasMore hasMore={hasMore} loading={loading} innerRef={ref} />
    </TaskSubtaskWrapper>
  );
}
