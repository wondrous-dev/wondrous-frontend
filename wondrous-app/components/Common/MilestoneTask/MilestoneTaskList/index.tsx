import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import SmartLink from 'components/Common/SmartLink';
import { format } from 'date-fns';
import isEmpty from 'lodash/isEmpty';
import * as Constants from 'utils/constants';
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
  const hasProfileImage = assignee && assignee.profilePicture;
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
  if (isEmpty(data)) return <MilestoneEmpty>No tasks yet.</MilestoneEmpty>;
  return (
    <MilestoneTaskListWrapper>
      {data?.map((task) => {
        const { id, title, assignee, orgUsername, org, privacyLevel, dueDate, rewards, commentCount } = task;
        const isPrivate = privacyLevel !== Constants.PRIVACY_LEVEL.public;
        const viewUrl = `/organization/${orgUsername || org?.username}/boards?task=${id}`;
        return (
          <SmartLink href={viewUrl} key={id} asLink>
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
