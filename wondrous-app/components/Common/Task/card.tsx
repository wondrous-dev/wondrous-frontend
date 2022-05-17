import { useState } from 'react';
import { TaskCommentIcon } from '../../Icons/taskComment';
import { TaskMenuIcon } from '../../Icons/taskMenu';
import { DropDown, DropDownItem } from '../dropdown';
import MilestoneIcon from '../../Icons/milestone';
import {
  TaskWrapper,
  TaskInner,
  TaskHeader,
  TaskContent,
  TaskTitle,
  TaskSeparator,
  TaskFooter,
  TaskAction,
  TaskActionAmount,
  TaskActionMenu,
  PodWrapper,
  PodName,
  TaskDivider,
  MilestoneProgressWrapper,
  TaskHeaderIconWrapper,
  SubtaskCountWrapper,
  SubtaskCount,
  TaskContentFooter,
  ClaimButton,
  TaskCardDescriptionText,
} from './styles';
import { transformTaskToTaskCard } from 'utils/helpers';
import { White, Red800 } from '../../../theme/colors';
import { TaskCreatedBy } from '../TaskCreatedBy';
import { MilestoneProgress } from '../MilestoneProgress';
import PodIcon from '../../Icons/podIcon';
import { SubtaskDarkIcon } from '../../Icons/subtask';
import { CheckedBoxIcon } from '../../Icons/checkedBox';
import { Compensation } from '../Compensation';
import { Claim } from '../../Icons/claimTask';
import { updateInProgressTask, updateTaskItem } from 'utils/board';
import { TaskBountyOverview } from '../TaskBountyOverview';
import { SafeImage } from '../Image';
import * as Constants from 'utils/constants';
import { AvatarList } from '../AvatarList';
import { useRouter } from 'next/router';
import { renderMentionString } from 'utils/common';
import {
  TodoWithBorder,
  InProgressWithBorder,
  DoneWithBorder,
  InReview,
  Requested,
  AwaitingPayment,
  Paid,
} from '../../Icons';
import { Archived } from '../../Icons/sections';
import { TaskMedia } from '../MediaPlayer';
import { useColumns } from 'utils/hooks';
import {
  BoardsCardSubheader,
  BoardsCardBody,
  BoardsCardHeader,
  BoardsCardBodyDescription,
  BoardsCardBodyTitle,
  BoardsPrivacyLabel,
  BoardsCardMedia,
} from 'components/Common/Boards/styles';
import {
  ProposalCardWrapper,
  ProposalCardType,
  ProposalCardIcon,
  ProposalFooterButton,
  ProposalCardFooter,
} from './styles';
import { PRIVACY_LEVEL } from 'utils/constants';
import { Red300, Green800 } from 'theme/colors';
export const TASK_ICONS = {
  [Constants.TASK_STATUS_TODO]: TodoWithBorder,
  [Constants.TASK_STATUS_IN_PROGRESS]: InProgressWithBorder,
  [Constants.TASK_STATUS_DONE]: DoneWithBorder,
  [Constants.TASK_STATUS_IN_REVIEW]: InReview,
  [Constants.TASK_STATUS_REQUESTED]: Requested,
  [Constants.TASK_STATUS_ARCHIVED]: Archived,
  [Constants.TASK_STATUS_AWAITING_PAYMENT]: AwaitingPayment,
  [Constants.TASK_STATUS_PAID]: Paid,
};

export const TaskCard = ({
  openModal,
  id,
  task,
  isMilestone,
  userList,
  isSubtask,
  rewards,
  type,
  createdBy,
  isBounty,
  title,
  description,
  goToPod,
  media,
  assigneeId,
  updateTaskAssignee,
  user,
  commentCount,
  canArchive,
  setEditTask,
  setArchiveTask,
  canDelete,
  setDeleteTask,
}) => {
  let TaskIcon = TASK_ICONS[task.status];

  const boardColumns = useColumns();
  const [claimed, setClaimed] = useState(false);
  const totalSubtask = task?.totalSubtaskCount;
  const completedSubtask = task?.completedSubtaskCount;

  const router = useRouter();
  return (
    <TaskWrapper key={id} onClick={openModal}>
      <TaskInner>
        <TaskHeader>
          <TaskHeaderIconWrapper>
            <SafeImage
              src={task?.orgProfilePicture}
              style={{
                width: '29px',
                height: '28px',
                borderRadius: '4px',
                marginRight: '8px',
              }}
            />
            {isMilestone && <MilestoneIcon />}
            <AvatarList users={userList} id={'task-' + task?.id} />
            {isSubtask && <SubtaskDarkIcon />}
            {!isSubtask && !isMilestone && totalSubtask > 0 && <CheckedBoxIcon />}
            {task?.privacyLevel === Constants.PRIVACY_LEVEL.public && (
              <PodWrapper
                style={{
                  marginTop: '0',
                }}
              >
                <PodName
                  style={{
                    borderRadius: '8px',
                    marginLeft: '4px',
                  }}
                >
                  Public
                </PodName>
              </PodWrapper>
            )}
          </TaskHeaderIconWrapper>
          {rewards && rewards?.length > 0 && <Compensation rewards={rewards} taskIcon={<TaskIcon />} />}
        </TaskHeader>
        <TaskCreatedBy type={type} router={router} createdBy={createdBy} />
        {(isMilestone || isBounty) && <TaskDivider />}

        <TaskContent>
          <TaskTitle>{title}</TaskTitle>
          <TaskCardDescriptionText>
            {renderMentionString({
              content: description,
              router,
            })}
          </TaskCardDescriptionText>
          <TaskContentFooter>
            {task?.podName && (
              <PodWrapper
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToPod(task?.podId);
                }}
              >
                <PodIcon
                  color={task?.podColor}
                  style={{
                    width: '26px',
                    height: '26px',
                    marginRight: '8px',
                  }}
                />
                <PodName>{task?.podName}</PodName>
              </PodWrapper>
            )}
            {!isSubtask && !isMilestone && totalSubtask > 0 && (
              <SubtaskCountWrapper
                style={{
                  marginTop: '24px',
                }}
              >
                <SubtaskDarkIcon />
                <SubtaskCount>
                  {completedSubtask}/{totalSubtask}
                </SubtaskCount>
              </SubtaskCountWrapper>
            )}
          </TaskContentFooter>
          {isBounty && (
            <TaskBountyOverview
              totalSubmissionsCount={task?.totalSubmissionsCount}
              approvedSubmissionsCount={task?.approvedSubmissionsCount}
            />
          )}
          <MilestoneProgressWrapper>{isMilestone && <MilestoneProgress milestoneId={id} />}</MilestoneProgressWrapper>
          {media?.length > 0 ? <TaskMedia media={media[0]} /> : <TaskSeparator />}
        </TaskContent>
        <TaskFooter>
          {/* <TaskAction key={'task-like-' + id} onClick={toggleLike}>
      <TaskLikeIcon liked={liked} />
      <TaskActionAmount>{likes}</TaskActionAmount>
    </TaskAction> */}
          {!assigneeId && !isBounty && !isMilestone && (
            <>
              {claimed ? (
                <ClaimButton
                  style={{
                    borderColor: 'linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%)',
                    border: '1px solid #7427ff',
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  Claimed
                </ClaimButton>
              ) : (
                <ClaimButton
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateTaskAssignee({
                      variables: {
                        taskId: id,
                        assigneeId: user?.id,
                      },
                      onCompleted: (data) => {
                        setClaimed(true);
                        const task = data?.updateTaskAssignee;
                        const transformedTask = transformTaskToTaskCard(task, {});
                        if (boardColumns?.setColumns) {
                          let columns = [...boardColumns?.columns];
                          if (transformedTask.status === Constants.TASK_STATUS_IN_PROGRESS) {
                            columns = updateInProgressTask(transformedTask, columns);
                          } else if (transformedTask.status === Constants.TASK_STATUS_TODO) {
                            columns = updateTaskItem(transformedTask, columns);
                          }
                          boardColumns.setColumns(columns);
                        }
                      },
                    });
                  }}
                >
                  <Claim />
                  <span
                    style={{
                      marginLeft: '4px',
                    }}
                  >
                    Claim
                  </span>
                </ClaimButton>
              )}
            </>
          )}
          {!isMilestone && (
            <TaskAction key={'task-comment-' + id}>
              <TaskCommentIcon />
              <TaskActionAmount>{commentCount}</TaskActionAmount>
            </TaskAction>
          )}
          {/* <TaskAction key={'task-share-' + id}>
        <TaskShareIcon />
        <TaskActionAmount>{shares}</TaskActionAmount>
      </TaskAction> */}

          {canArchive && (
            <TaskActionMenu right="true">
              <DropDown DropdownHandler={TaskMenuIcon}>
                <DropDownItem
                  key={'task-menu-edit-' + id}
                  onClick={() => {
                    setEditTask(true);
                  }}
                  color={White}
                >
                  Edit {type}
                </DropDownItem>
                <DropDownItem
                  key={'task-menu-edit-' + id}
                  onClick={() => {
                    setArchiveTask(true);
                  }}
                  color={White}
                >
                  Archive {type}
                </DropDownItem>
                {canDelete && (
                  <DropDownItem
                    key={'task-menu-delete-' + id}
                    onClick={() => {
                      setDeleteTask(true);
                    }}
                    color={Red800}
                  >
                    Delete {type}
                  </DropDownItem>
                )}
              </DropDown>
            </TaskActionMenu>
          )}
        </TaskFooter>
      </TaskInner>
    </TaskWrapper>
  );
};

const PROPOSAL_STATUS_MAP = {
  approved: {
    labelsAndActions: [
      {
        title: 'Approved',
        borderColor: Green800,
        color: Green800,
      },
    ],
  },
  open: {
    labelsAndActions: [
      {
        title: 'Open',
      },
      {
        title: 'Request edit',
        action: () => {},
      },
    ],
  },
  rejected: {
    labelsAndActions: [
      {
        title: 'Rejected',
        borderColor: Red300,
        color: Red300,
      },
    ],
  },
};

export function ProposalCard({ openModal, title, description, task }) {
  let proposalStatus = '';

  if (task.approvedAt) proposalStatus = 'approved';
  if (!task.approvedAt && !task.changeRequested) proposalStatus = 'open';
  if (task.changeRequestedAt) proposalStatus = 'rejected';

  const labelsAndActions = PROPOSAL_STATUS_MAP[proposalStatus]?.labelsAndActions;

  return (
    <ProposalCardWrapper onClick={openModal}>
      <BoardsCardHeader>
        <BoardsCardSubheader>
          <ProposalCardIcon />
          <ProposalCardType>Proposal</ProposalCardType>
          <BoardsPrivacyLabel>
            {PRIVACY_LEVEL[task.privacyLevel] === PRIVACY_LEVEL.private ? 'Members' : 'Public'}
          </BoardsPrivacyLabel>
        </BoardsCardSubheader>
      </BoardsCardHeader>
      <BoardsCardBody>
        <BoardsCardBodyTitle>{title}</BoardsCardBodyTitle>
        <BoardsCardBodyDescription>{description}</BoardsCardBodyDescription>
        {task?.media?.[0] ? (
          <BoardsCardMedia>
            <SafeImage
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              src={task?.media[0].slug}
            />
          </BoardsCardMedia>
        ) : null}
      </BoardsCardBody>
      <ProposalCardFooter>
        {labelsAndActions?.map((label, idx) => (
          <ProposalFooterButton
            isAction={!!label.action}
            onClick={(label) => label.action ?? label.action()}
            borderColor={label?.borderColor}
            key={idx}
            color={label?.color}
          >
            {label?.title}
          </ProposalFooterButton>
        ))}
      </ProposalCardFooter>
    </ProposalCardWrapper>
  );
}
export default function Card(props) {
  const { task } = props;

  return task.isProposal ? <ProposalCard {...props} /> : <TaskCard {...props} />;
}
