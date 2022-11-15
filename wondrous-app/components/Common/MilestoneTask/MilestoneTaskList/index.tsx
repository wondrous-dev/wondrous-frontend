import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { format } from 'date-fns';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import SmartLink from 'components/Common/SmartLink';
import { delQuery } from 'utils';
import * as Constants from 'utils/constants';
import { useLocation } from 'utils/useLocation';

import {
  MilestoneEmpty,
  MilestoneTaskCommentCount,
  MilestoneTaskCommentCountText,
  MilestoneTaskCommentIcon,
  MilestoneTaskDueDateIcon,
  MilestoneTaskDueDateText,
  MilestoneTaskDueDateWrapper,
  MilestoneTaskImageSafeImage,
  MilestoneTaskImageWrapper,
  MilestoneTaskInfo,
  MilestoneTaskItem,
  MilestoneTaskListWrapper,
  MilestoneTaskMenuStatus,
  MilestoneTaskPrivacyAndStatus,
  MilestoneTaskPrivacyIcon,
  MilestoneTaskRewardAmount,
  MilestoneTaskRewardIcon,
  MilestoneTaskRewardWrapper,
  MilestoneTaskTitle,
  MilestoneTaskTitleAndInfo,
} from './styles';

function MilestoneUserImage({ assignee }) {
  const hasProfileImage = assignee?.profilePicture;
  return (
    <MilestoneTaskImageWrapper>
      {hasProfileImage ? <MilestoneTaskImageSafeImage src={hasProfileImage} /> : <DefaultUserImage />}
    </MilestoneTaskImageWrapper>
  );
}

function MilestoneTaskDuDate({ dueDate }) {
  if (!dueDate) return null;
  return (
    <MilestoneTaskDueDateWrapper>
      <MilestoneTaskDueDateIcon />
      <MilestoneTaskDueDateText>{format(new Date(dueDate), 'MMM dd')}</MilestoneTaskDueDateText>
    </MilestoneTaskDueDateWrapper>
  );
}

function MilestoneTaskReward({ rewards }) {
  if (isEmpty(rewards)) return null;
  return (
    <>
      {rewards.map((reward) => {
        const { rewardAmount, icon, paymentMethodId } = reward;
        return (
          <MilestoneTaskRewardWrapper key={paymentMethodId}>
            <MilestoneTaskRewardIcon src={icon} />
            <MilestoneTaskRewardAmount>{rewardAmount}</MilestoneTaskRewardAmount>
          </MilestoneTaskRewardWrapper>
        );
      })}
    </>
  );
}

export default function MilestoneTaskList({ data }) {
  const { asPath, query } = useRouter();
  const location = useLocation();
  const taskUrl = (id) => `${delQuery(asPath)}?task=${id}&view=grid&entity=milestone`;

  const handleClick = (id) => {
    const url = `${delQuery(asPath)}?task=${id}&view=${query.view || 'grid'}&entity=${
      Constants.ENTITIES_TYPES.MILESTONE
    }`;
    location.push(url);
    document.body.setAttribute('style', `position: fixed; top: -${window.scrollY}px; left:0; right:0`);
  };
  // onNavigate={() => handleClick(id)}

  if (isEmpty(data)) return <MilestoneEmpty>No tasks yet.</MilestoneEmpty>;
  return (
    <MilestoneTaskListWrapper>
      {data?.map((task) => {
        const { id, title, assignee, privacyLevel, dueDate, rewards, commentCount } = task;
        const isPrivate = privacyLevel !== Constants.PRIVACY_LEVEL.public;
        return (
          <SmartLink href={taskUrl(id)} key={id} asLink>
            <MilestoneTaskItem>
              <MilestoneUserImage assignee={assignee} />
              <MilestoneTaskTitleAndInfo>
                <MilestoneTaskTitle>{title}</MilestoneTaskTitle>
                <MilestoneTaskInfo>
                  <MilestoneTaskDuDate dueDate={dueDate} />
                  <MilestoneTaskReward rewards={rewards} />
                  <MilestoneTaskCommentCount>
                    <MilestoneTaskCommentIcon />
                    <MilestoneTaskCommentCountText>{commentCount}</MilestoneTaskCommentCountText>
                  </MilestoneTaskCommentCount>
                </MilestoneTaskInfo>
              </MilestoneTaskTitleAndInfo>
              <MilestoneTaskPrivacyAndStatus>
                <MilestoneTaskPrivacyIcon isPrivate={isPrivate} tooltipTitle={isPrivate ? 'Members only' : 'Public'} />
                <MilestoneTaskMenuStatus task={task} />
              </MilestoneTaskPrivacyAndStatus>
            </MilestoneTaskItem>
          </SmartLink>
        );
      })}
    </MilestoneTaskListWrapper>
  );
}
