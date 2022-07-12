import { useQuery } from '@apollo/client';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import SmartLink from 'components/Common/SmartLink';
import { Done, InProgress, InReview, ToDo } from 'components/Icons';
import { ArchivedIcon } from 'components/Icons/statusIcons';
import { GET_SUBTASKS_FOR_TASK } from 'graphql/queries';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { delQuery } from 'utils';
import {
  MEDIA_TYPES,
  PRIVACY_LEVEL,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_TODO,
} from 'utils/constants';
import {
  SubtaskTaskListHasMore,
  TaskSubtaskCoverImageSafeImage,
  TaskSubtaskCoverImageWrapper,
  TaskSubtaskFilterStatusIcon,
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

export const TASK_ICONS_LABELS = {
  '': { Icon: TaskSubtaskFilterStatusIcon, label: 'All Tasks' },
  [TASK_STATUS_TODO]: { Icon: ToDo, label: 'To Do' },
  [TASK_STATUS_IN_PROGRESS]: { Icon: InProgress, label: 'In Progress' },
  [TASK_STATUS_IN_REVIEW]: { Icon: InReview, label: 'In Review' },
  [TASK_STATUS_DONE]: { Icon: Done, label: 'Completed' },
  [TASK_STATUS_ARCHIVED]: { Icon: ArchivedIcon, label: 'Archived' },
};

const useGetSubtasksForTask = ({ taskId, inView }) => {
  const [hasMore, setHasMore] = useState(true);
  const { data, fetchMore, loading } = useQuery(GET_SUBTASKS_FOR_TASK, {
    fetchPolicy: 'cache-and-network',
    variables: {
      taskId,
      limit: LIMIT,
      offset: 0,
    },
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
    data: data?.getSubtasksForTask.filter((i) => i.status !== TASK_STATUS_ARCHIVED),
    loading,
    hasMore,
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

export const TaskSubtaskList = ({ taskId }) => {
  const [ref, inView] = useInView({});
  const { hasMore, data, loading } = useGetSubtasksForTask({ taskId, inView });
  const router = useRouter();
  if (!data) return null;
  return (
    <TaskSubtaskWrapper>
      {data.map((subtask) => {
        const { assignee, privacyLevel, rewards, status, title, id, type, media } = subtask;
        return (
          <TaskSubtaskSmartLink key={id} router={router} type={type} id={id}>
            <TaskSubtaskItemWrapper>
              <TaskSubtaskItemHeader>
                <TaskSubtaskItemContent>
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
