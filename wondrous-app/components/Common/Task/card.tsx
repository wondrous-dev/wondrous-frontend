import { useState, useRef } from 'react';
import { TaskCommentIcon } from '../../Icons/taskComment';
import { TaskMenuIcon } from '../../Icons/taskMenu';
import { DropDown, DropDownItem } from '../dropdown';
import MilestoneIcon from '../../Icons/milestone';
import {
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
  ActionButton,
  TaskCardDescriptionText,
  CheckedIconWrapper,
} from './styles';
import { transformTaskToTaskCard } from 'utils/helpers';
import { White, Red800 } from '../../../theme/colors';
import { TaskCreatedBy } from '../TaskCreatedBy';
import { MilestoneProgress } from '../MilestoneProgress';
import PodIcon from '../../Icons/podIcon';
import { SubtaskDarkIcon, SubtaskLightIcon } from '../../Icons/subtask';
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
  Approved,
  Rejected,
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
  BoardsCardFooter,
} from 'components/Common/Boards/styles';
import { ProposalCardWrapper, ProposalCardType, ProposalCardIcon, ProposalFooterButton } from './styles';
import { PRIVACY_LEVEL } from 'utils/constants';
import { Red300, Green800, Grey57 } from 'theme/colors';
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
  const [displayActions, setDisplayActions] = useState(false);

  const router = useRouter();

  return (
    <ProposalCardWrapper
      onClick={openModal}
      onMouseEnter={() => canArchive && setDisplayActions(true)}
      onMouseLeave={() => canArchive && setDisplayActions(false)}
    >
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
            {isSubtask && <SubtaskLightIcon stroke="white" />}
            {!isSubtask && !isMilestone && totalSubtask > 0 && (
              <CheckedIconWrapper>
                {' '}
                <CheckedBoxIcon stroke="white" pathFill="none" />
              </CheckedIconWrapper>
            )}
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
                <ActionButton
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  Claimed
                </ActionButton>
              ) : (
                <ActionButton
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
                </ActionButton>
              )}
            </>
          )}
          {!isBounty && !isMilestone && task?.status === Constants.TASK_STATUS_IN_REVIEW && (
            <ActionButton onClick={openModal}>Review</ActionButton>
          )}
          {!isMilestone && (
            <TaskAction key={'task-comment-' + id}>
              <TaskCommentIcon />
              <TaskActionAmount>{commentCount}</TaskActionAmount>
            </TaskAction>
          )}
          {!isSubtask && !isMilestone && totalSubtask > 0 && (
            <SubtaskCountWrapper>
              <SubtaskLightIcon fill="none" stroke={Grey57} />
              <SubtaskCount>{totalSubtask}</SubtaskCount>
            </SubtaskCountWrapper>
          )}
          {canArchive && displayActions && (
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
    </ProposalCardWrapper>
  );
};

const PROPOSAL_STATUS_MAP = {
  [Constants.STATUS_APPROVED]: {
    labelsAndActions: [
      {
        title: 'Approved',
        borderColor: Green800,
        color: Green800,
      },
    ],
  },
  [Constants.STATUS_OPEN]: {
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
  [Constants.STATUS_CHANGE_REQUESTED]: {
    labelsAndActions: [
      {
        title: 'Rejected',
        borderColor: Red300,
        color: Red300,
      },
    ],
  },
};

const STATUS_ICONS = {
  [Constants.STATUS_APPROVED]: Approved,
  [Constants.STATUS_CHANGE_REQUESTED]: Rejected,
};

export function ProposalCard({ openModal, title, description, task }) {
  let proposalStatus = '';

  if (task.approvedAt) proposalStatus = Constants.STATUS_APPROVED;
  if (!task.approvedAt && !task.changeRequested) proposalStatus = Constants.STATUS_OPEN;
  if (task.changeRequestedAt) proposalStatus = Constants.STATUS_CHANGE_REQUESTED;

  const labelsAndActions = PROPOSAL_STATUS_MAP[proposalStatus]?.labelsAndActions;

  const HeaderIcon = STATUS_ICONS[proposalStatus];
  return (
    <ProposalCardWrapper onClick={openModal}>
      <BoardsCardHeader>
        <BoardsCardSubheader>
          <ProposalCardIcon />
          <ProposalCardType>Proposal</ProposalCardType>
          <BoardsPrivacyLabel>{task?.privacyLevel === PRIVACY_LEVEL.public ? 'Public' : 'Members'}</BoardsPrivacyLabel>
        </BoardsCardSubheader>
        {HeaderIcon ? <HeaderIcon /> : null}
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
      <BoardsCardFooter style={{ paddingBottom: '7px' }}>
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
      </BoardsCardFooter>
    </ProposalCardWrapper>
  );
}
export default function Card(props) {
  const { task } = props;

  return task.isProposal ? <ProposalCard {...props} /> : <TaskCard {...props} />;
}
