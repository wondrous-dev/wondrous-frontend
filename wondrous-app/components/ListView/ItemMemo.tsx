import { memo } from 'react';
import { TASK_STATUS_IN_REVIEW, TASK_STATUS_DONE } from 'utils/constants';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { SubtaskLightIcon } from 'components/Icons/subtask';
import { TaskCommentIcon } from 'components/Icons/taskComment';
import { Compensation } from 'components/Common/Compensation';
import { format } from 'date-fns';
import { DueDateText, ActionButton } from 'components/Common/Task/styles';
import Tooltip from 'components/Tooltip';
import palette from 'theme/palette';
import { Claim } from 'components/Icons/claimTask';
import SmartLink from 'components/Common/SmartLink';
import { MakePaymentModal } from 'components/Common/Payment/PaymentModal';
import { DropDown, DropDownItem } from 'components/Common/dropdown';
import { TaskMenuIcon } from 'components/Icons/taskMenu';
import { MoreOptions } from 'components/Table/styles';
import {
  ListViewItemBodyWrapper,
  ListViewItemDataContainer,
  ListViewItemIconsWrapper,
  ListViewItemActions,
} from './styles';

function ItemMemo({
  approvedSubmission,
  archiveTask,
  assigneeId,
  assigneeProfilePicture,
  canArchive,
  canDelete,
  claimAction,
  claimed,
  commentCount,
  deleteTask,
  displayPayButton,
  dueDate,
  editTask,
  getTaskSubmissionsForTask,
  handlePaymentModal,
  id,
  isTaskSubmissionLoading,
  onNavigate,
  rewards,
  setClaimed,
  setShowPaymentModal,
  showPaymentModal,
  task,
  title,
  totalSubtaskCount,
  viewUrl,
}) {
  return (
    <SmartLink href={viewUrl} preventLinkNavigation onNavigate={onNavigate}>
      {showPaymentModal && !isTaskSubmissionLoading ? (
        <MakePaymentModal
          getTaskSubmissionsForTask={getTaskSubmissionsForTask}
          open={showPaymentModal}
          approvedSubmission={approvedSubmission}
          handleClose={() => {}}
          setShowPaymentModal={setShowPaymentModal}
          fetchedTask={task}
        />
      ) : null}

      <ListViewItemBodyWrapper>
        <ListViewItemDataContainer>
          {assigneeProfilePicture ? (
            <SafeImage
              useNextImage={false}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '13px',
                marginRight: '4px',
              }}
              src={assigneeProfilePicture}
            />
          ) : (
            <DefaultUserImage
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '13px',
                marginRight: '4px',
              }}
            />
          )}
          {title}
          {!!totalSubtaskCount && (
            <ListViewItemIconsWrapper>
              <SubtaskLightIcon fill="none" stroke={palette.grey57} height="30" width="30" viewBox="0 3 20 20" />
              {totalSubtaskCount}
            </ListViewItemIconsWrapper>
          )}
          {!!commentCount && (
            <ListViewItemIconsWrapper>
              <TaskCommentIcon />
              {commentCount}
            </ListViewItemIconsWrapper>
          )}
        </ListViewItemDataContainer>
        <ListViewItemActions>
          {dueDate && <DueDateText>{format(new Date(dueDate), 'MMM d')}</DueDateText>}
          {rewards && rewards?.length > 0 && <Compensation pillStyle={{ padding: '10px' }} rewards={rewards} />}
          {displayPayButton && (
            <ActionButton
              onClick={(e) => {
                e.stopPropagation();
                handlePaymentModal();
              }}
            >
              Pay
            </ActionButton>
          )}
          {!assigneeId && status !== TASK_STATUS_DONE && (
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
                  style={{
                    marginRight: '8px',
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    claimAction(id);
                    setClaimed(true);
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
          {status === TASK_STATUS_IN_REVIEW && <ActionButton type="button">Review</ActionButton>}
          {canArchive && (
            <MoreOptions>
              <Tooltip title="More actions" placement="top">
                <div>
                  <DropDown DropdownHandler={TaskMenuIcon} fill="#1F1F1F">
                    <DropDownItem
                      onClick={editTask}
                      color="#C4C4C4"
                      fontSize="13px"
                      fontWeight="normal"
                      textAlign="left"
                    >
                      Edit task
                    </DropDownItem>
                    <DropDownItem
                      onClick={archiveTask}
                      color="#C4C4C4"
                      fontSize="13px"
                      fontWeight="normal"
                      textAlign="left"
                    >
                      Archive task
                    </DropDownItem>
                    {canDelete && (
                      <DropDownItem
                        key={`task-menu-delete-${task.id}`}
                        onClick={deleteTask}
                        color={palette.red800}
                        fontSize="13px"
                        fontWeight="normal"
                        textAlign="left"
                      >
                        Delete task
                      </DropDownItem>
                    )}
                  </DropDown>
                </div>
              </Tooltip>
            </MoreOptions>
          )}
        </ListViewItemActions>
      </ListViewItemBodyWrapper>
    </SmartLink>
  );
}

export default memo(ItemMemo, (prevProps, nextProps) => {
  const areEqual =
    prevProps.approvedSubmission === nextProps.approvedSubmission &&
    prevProps.assigneeId === nextProps.assigneeId &&
    prevProps.assigneeProfilePicture === nextProps.assigneeProfilePicture &&
    prevProps.canArchive === nextProps.canArchive &&
    prevProps.canDelete === nextProps.canDelete &&
    prevProps.claimed === nextProps.claimed &&
    prevProps.commentCount === nextProps.commentCount &&
    prevProps.displayPayButton === nextProps.displayPayButton &&
    prevProps.dueDate === nextProps.dueDate &&
    prevProps.getTaskSubmissionsForTask === nextProps.getTaskSubmissionsForTask &&
    prevProps.id === nextProps.id &&
    prevProps.isTaskSubmissionLoading === nextProps.isTaskSubmissionLoading &&
    prevProps.rewards === nextProps.rewards &&
    prevProps.showPaymentModal === nextProps.showPaymentModal &&
    prevProps.task === nextProps.task &&
    prevProps.title === nextProps.title &&
    prevProps.totalSubtaskCount === nextProps.totalSubtaskCount &&
    prevProps.viewUrl === nextProps.viewUrl;

  return areEqual;
});
