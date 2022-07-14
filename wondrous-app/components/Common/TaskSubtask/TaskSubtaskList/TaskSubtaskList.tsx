import { useMutation, useQuery } from '@apollo/client';
import { useMe } from 'components/Auth/withAuth';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import SmartLink from 'components/Common/SmartLink';
import { TASK_ICONS_LABELS } from 'components/Common/TaskSubtask/TaskSubtasks';
import { Claim } from 'components/Icons/claimTask';
import { UPDATE_TASK_ASSIGNEE } from 'graphql/mutations';
import { GET_SUBTASKS_FOR_TASK } from 'graphql/queries';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { delQuery } from 'utils';
import { MEDIA_TYPES, PRIVACY_LEVEL, TASK_STATUS_DONE } from 'utils/constants';
import {
  SubtaskTaskListHasMore,
  TaskSubtaskClaimButtonWrapper,
  TaskSubtaskCoverImageSafeImage,
  TaskSubtaskCoverImageWrapper,
  TaskSubTaskEmpty,
  TaskSubtaskImageWrapper,
  TaskSubtaskItemContent,
  TaskSubtaskItemHeader,
  TaskSubtaskItemWrapper,
  TaskSubtaskPrivacyIcon,
  TaskSubtaskRewardAmount,
  TaskSubtaskRewardIcon,
  TaskSubtaskRewardWrapper,
  TaskSubtaskSafeImage,
  TaskSubtaskStatus,
  TaskSubtaskStatusLabel,
  TaskSubtaskTitle,
  TaskSubtaskWrapper,
} from './styles';

const LIMIT = 5;

const useGetSubtasksForTask = ({ taskId, status }) => {
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
      }).then(({ data }) => setHasMore(data?.getSubtasksForTask.length >= LIMIT));
    }
  }, [inView, fetchMore, data?.getSubtasksForTask, hasMore, loading]);
  return {
    data: data?.getSubtasksForTask,
    loading,
    hasMore,
    ref,
  };
};

const TaskSubtaskUserImage = ({ assignee }) => {
  if (!assignee) return null;
  const profilePicture = assignee?.profilePicture;
  return (
    <TaskSubtaskImageWrapper>
      {profilePicture ? <TaskSubtaskSafeImage src={profilePicture} /> : <DefaultUserImage />}
    </TaskSubtaskImageWrapper>
  );
};

const TaskSubtaskReward = ({ rewards }) => {
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
};

const TaskSubTaskPrivacyIconWrapper = ({ privacyLevel }) => {
  const isPrivate = privacyLevel !== PRIVACY_LEVEL.public;
  return <TaskSubtaskPrivacyIcon isPrivate={isPrivate} tooltipTitle={isPrivate ? 'Members only' : 'Public'} />;
};

const TaskSubtaskStatusIcon = ({ status }) => {
  const { Icon, label } = TASK_ICONS_LABELS[status];
  return (
    <TaskSubtaskStatus>
      <Icon />
      <TaskSubtaskStatusLabel>{label}</TaskSubtaskStatusLabel>
    </TaskSubtaskStatus>
  );
};

const TaskSubtaskCoverImage = ({ media }) => {
  const coverMedia = media?.filter((media) => media.type === MEDIA_TYPES.IMAGE).slice(0, 3);
  if (isEmpty(coverMedia)) return null;
  return (
    <TaskSubtaskCoverImageWrapper>
      {coverMedia.map(({ slug }) => (
        <TaskSubtaskCoverImageSafeImage key={slug} src={slug} />
      ))}
    </TaskSubtaskCoverImageWrapper>
  );
};

const TaskSubtaskSmartLink = ({ router, type, id, children }) => {
  const viewUrl = `${delQuery(router.asPath)}?${type}=${id}&view=${router.query.view || 'grid'}`;
  return <SmartLink href={viewUrl}>{children}</SmartLink>;
};

const TaskSubTaskHasMore = ({ hasMore, loading, innerRef }) => {
  if (hasMore && !loading) return <SubtaskTaskListHasMore ref={innerRef} />;
  return null;
};

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

const TaskSubtaskClaimButton = ({ id, userId, assignee, taskApplicationPermissions, status }) => {
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
};

export const TaskSubtaskList = ({ taskId, status }) => {
  const { hasMore, data, loading, ref } = useGetSubtasksForTask({ taskId, status });
  const router = useRouter();
  const { id: userId } = useMe();
  if (isEmpty(data)) return <TaskSubTaskEmpty>No subtask yet</TaskSubTaskEmpty>;
  return (
    <TaskSubtaskWrapper>
      {data.map((subtask) => {
        const { assignee, privacyLevel, rewards, status, title, id, type, media, taskApplicationPermissions } = subtask;
        return (
          <TaskSubtaskSmartLink key={id} router={router} type={type} id={id}>
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
              <TaskSubtaskTitle>{title}</TaskSubtaskTitle>
              <TaskSubtaskCoverImage media={media} />
            </TaskSubtaskItemWrapper>
          </TaskSubtaskSmartLink>
        );
      })}
      <TaskSubTaskHasMore hasMore={hasMore} loading={loading} innerRef={ref} />
    </TaskSubtaskWrapper>
  );
};
