import { useMutation } from '@apollo/client';
import { CircularProgress, ClickAwayListener } from '@mui/material';
import { useMe } from 'components/Auth/withAuth';
import { UPDATE_TASK_STATUS } from 'graphql/mutations';
import { isEmpty, values } from 'lodash';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { delQuery } from 'utils';
import {
  ENTITIES_TYPES,
  PAYMENT_STATUS,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_TODO,
} from 'utils/constants';
import { transformTaskSubmissionToTaskSubmissionCard, transformTaskToTaskCard } from 'utils/helpers';

import {
  SubmissionButtonCreate,
  SubmissionButtonTextHelper,
  SubmissionButtonWrapperBackground,
  SubmissionButtonWrapperGradient,
  SubmissionFilterButtonIcon,
  SubmissionFilterSelectButton,
  SubmissionFilterSelectItem,
  SubmissionFilterSelectMenu,
  SubmissionFilterSelectPopper,
  SubmissionFilterSelectRender,
  SubmissionFilterStatusIcon,
  TaskSubmissionItemsWrapper,
  TaskSubmissionsFormInactiveWrapper,
} from './styles';
import { TaskSubmissionForm } from './submissionForm';
import { SubmissionItem } from './submissionItem';
import { SubmissionPayment } from './submissionPayment';

const SubmissionButtonWrapper = ({ onClick = null, buttonText = null, helperText = '' }) => {
  return (
    <SubmissionButtonWrapperGradient>
      <SubmissionButtonWrapperBackground>
        {buttonText && (
          <SubmissionButtonCreate onClick={onClick} show={buttonText}>
            {buttonText}
          </SubmissionButtonCreate>
        )}
        {helperText && <SubmissionButtonTextHelper>{helperText}</SubmissionButtonTextHelper>}
      </SubmissionButtonWrapperBackground>
    </SubmissionButtonWrapperGradient>
  );
};

const inProgressMoveCompleted = ({ handleClose, boardColumns, board }) => {
  return (data) => {
    const task = data?.updateTaskStatus;
    handleClose();
    if (boardColumns?.setColumns) {
      const transformedTask = transformTaskToTaskCard(task, {});
      if (board?.entityType && board?.entityType === ENTITIES_TYPES.BOUNTY) {
        const newColumns = boardColumns?.columns.map((col) => (col.id === transformedTask.id ? transformedTask : col));
        boardColumns?.setColumns(newColumns);
        return;
      }
      const columns = [...boardColumns?.columns];
      columns[0].tasks = columns[0].tasks.filter((existingTask) => {
        if (transformedTask?.id !== existingTask?.id) {
          return true;
        }
        return false;
      });
      columns[1].tasks = [transformedTask, ...columns[1].tasks];
      boardColumns?.setColumns(columns);
    }
  };
};

const TaskSubmissionsLoading = ({ loading }) => {
  if (!loading) return null;
  return <CircularProgress />;
};

const TaskSubmissionsTaskToDo = ({ handleTaskProgressStatus, canSubmit, canMoveProgress, taskStatus }) => {
  if (taskStatus === TASK_STATUS_TODO) {
    if (canSubmit || canMoveProgress) {
      return (
        <SubmissionButtonWrapper
          onClick={handleTaskProgressStatus}
          buttonText="Set Status to In-Progress"
          helperText="In order to submit, set this task to In-Progress."
        />
      );
    }
    return <SubmissionButtonWrapper helperText={`No submissions yet.`} />;
  }
  return null;
};

const TaskSubmissionsTaskInProgress = ({ canSubmit, taskStatus, setMakeSubmission, fetchedTaskSubmissions }) => {
  if (taskStatus === TASK_STATUS_IN_PROGRESS || taskStatus === TASK_STATUS_IN_REVIEW) {
    if (canSubmit) return <SubmissionButtonWrapper onClick={setMakeSubmission} buttonText="Make a submission" />;
    if (isEmpty(fetchedTaskSubmissions)) return <SubmissionButtonWrapper helperText={`No submissions yet.`} />;
  }
  return null;
};

const TaskSubmissionMakePayment = ({ taskStatus, fetchedTask, setShowPaymentModal, fetchedTaskSubmissions }) => {
  if (taskStatus === TASK_STATUS_DONE && fetchedTask?.type === ENTITIES_TYPES.TASK) {
    if (isEmpty(fetchedTaskSubmissions)) return <SubmissionButtonWrapper helperText={`No submissions`} />;
    return (
      <SubmissionPayment
        fetchedTask={fetchedTask}
        setShowPaymentModal={setShowPaymentModal}
        taskSubmissions={fetchedTaskSubmissions}
      />
    );
  }
  return null;
};

const TaskSubmissionsForm = ({
  makeSubmission,
  handleCancelSubmission,
  fetchedTaskSubmissions,
  orgId,
  fetchedTask,
  submissionToEdit,
}) => {
  if (makeSubmission)
    return (
      <TaskSubmissionForm
        cancelSubmissionForm={handleCancelSubmission}
        fetchedTaskSubmissions={fetchedTaskSubmissions}
        orgId={orgId}
        taskId={fetchedTask?.id}
      />
    );
  if (submissionToEdit)
    return (
      <TaskSubmissionForm
        cancelSubmissionForm={handleCancelSubmission}
        orgId={orgId}
        submissionToEdit={submissionToEdit}
        taskId={fetchedTask?.id}
      />
    );
  return null;
};

const TaskSubmissionList = ({
  fetchedTaskSubmissions,
  setSubmissionToEdit,
  canReview,
  fetchedTask,
  handleClose,
  loggedInUser,
  getTaskSubmissionsForTask,
}) => {
  return (
    <TaskSubmissionItemsWrapper>
      {fetchedTaskSubmissions?.map((taskSubmission) => {
        return (
          <SubmissionItem
            setSubmissionToEdit={setSubmissionToEdit}
            key={taskSubmission?.id}
            canReview={canReview}
            fetchedTask={fetchedTask}
            handleClose={handleClose}
            fetchedTaskSubmissions={fetchedTaskSubmissions}
            submission={transformTaskSubmissionToTaskSubmissionCard(taskSubmission, {})}
            user={loggedInUser}
            getTaskSubmissionsForTask={getTaskSubmissionsForTask}
          />
        );
      })}
    </TaskSubmissionItemsWrapper>
  );
};

const TaskSubmissionsFilterSelected = ({ value }) => {
  const text = isEmpty(value) ? 'Status' : value;
  return (
    <SubmissionFilterSelectRender>
      <SubmissionFilterStatusIcon /> {text}
    </SubmissionFilterSelectRender>
  );
};

const filterOptions = {
  awaitingReview: 'Awaiting Review',
  changesRequested: 'Changes Requested',
  approved: 'Approved',
  approvedAndProcessingPayment: 'Approved And Processing Payment',
  approvedAndPaid: 'Approved and Paid',
};

const isSubmissionStatus = ({ submission, value }) => {
  const { awaitingReview, changesRequested, approved, approvedAndProcessingPayment, approvedAndPaid } = filterOptions;
  const conditions = {
    [awaitingReview]: !submission?.approvedAt && !submission?.changeRequestedAt && !submission.rejectedAt,
    [changesRequested]: submission?.changeRequestedAt || submission?.rejectedAt,
    [approved]: submission?.approvedAt,
    [approvedAndProcessingPayment]: submission?.approvedAt && submission?.paymentStatus === PAYMENT_STATUS.PROCESSING,
    [approvedAndPaid]: submission?.approvedAt && submission?.paymentStatus === PAYMENT_STATUS.PAID,
  };
  return conditions[value];
};

const TaskSubmissionsFilter = ({ fetchedTaskSubmissions, setFilteredSubmissions }) => {
  const [selected, setSelected] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(anchorEl ? null : event.currentTarget);
  const handleClosePopper = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const handleOnClick = (e) => {
    const value = e.target.getAttribute('value');
    setSelected(value);
    const handleFilterStatus = (submission) => isSubmissionStatus({ submission, value });
    setFilteredSubmissions(fetchedTaskSubmissions.filter(handleFilterStatus));
    handleClosePopper();
  };
  if (isEmpty(fetchedTaskSubmissions)) return null;
  return (
    <ClickAwayListener onClickAway={handleClosePopper}>
      <div>
        <SubmissionFilterSelectButton onClick={handleClick} open={open}>
          <TaskSubmissionsFilterSelected value={selected} />
          <SubmissionFilterButtonIcon open={open} />
        </SubmissionFilterSelectButton>
        <SubmissionFilterSelectPopper open={open} anchorEl={anchorEl} placement="bottom-start" disablePortal={true}>
          <SubmissionFilterSelectMenu>
            {values(filterOptions).map((i) => (
              <SubmissionFilterSelectItem key={i} value={i} onClick={handleOnClick}>
                <SubmissionFilterStatusIcon /> {i}
              </SubmissionFilterSelectItem>
            ))}
          </SubmissionFilterSelectMenu>
        </SubmissionFilterSelectPopper>
      </div>
    </ClickAwayListener>
  );
};

const TaskSubmissionsFormInactive = ({ makeSubmission, submissionToEdit, children }) => {
  if (makeSubmission || submissionToEdit) return null;
  return <TaskSubmissionsFormInactiveWrapper>{children}</TaskSubmissionsFormInactiveWrapper>;
};

export const TaskSubmissions = (props) => {
  const {
    board,
    boardColumns,
    canMoveProgress,
    canReview,
    canSubmit,
    fetchedTask,
    fetchedTaskSubmissions,
    getTaskSubmissionsForTask,
    handleClose,
    isBounty,
    orgId,
    setShowPaymentModal,
    taskSubmissionLoading,
  } = props;
  const router = useRouter();
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS, {
    onCompleted: inProgressMoveCompleted({ handleClose, boardColumns, board }),
  });
  const [makeSubmission, setMakeSubmission] = useState(false);
  const [submissionToEdit, setSubmissionToEdit] = useState(null);
  const [filteredSubmissions, setFilteredSubmissions] = useState();
  const listSubmissions = filteredSubmissions ?? fetchedTaskSubmissions;
  const taskStatus = fetchedTask?.status;
  const loggedInUser = useMe();
  const handleTaskProgressStatus = () => {
    router.push(`${delQuery(router.asPath)}`, undefined, {
      shallow: true,
    });
    handleClose();
    updateTaskStatus({
      variables: {
        taskId: fetchedTask?.id,
        input: {
          newStatus: TASK_STATUS_IN_PROGRESS,
        },
      },
    });
  };

  const handleCancelSubmission = () => {
    setMakeSubmission(false);
    setSubmissionToEdit(null);
  };

  return (
    <>
      <TaskSubmissionsLoading loading={taskSubmissionLoading} />
      <TaskSubmissionsForm
        makeSubmission={makeSubmission}
        handleCancelSubmission={handleCancelSubmission}
        fetchedTaskSubmissions={fetchedTaskSubmissions}
        orgId={orgId}
        fetchedTask={fetchedTask}
        submissionToEdit={submissionToEdit}
      />
      <TaskSubmissionsFormInactive submissionToEdit={submissionToEdit} makeSubmission={makeSubmission}>
        <TaskSubmissionsFilter
          fetchedTaskSubmissions={fetchedTaskSubmissions}
          setFilteredSubmissions={setFilteredSubmissions}
        />
        {isBounty && <SubmissionButtonWrapper onClick={setMakeSubmission} buttonText="Make a submission" />}
        {!isBounty && (
          <>
            <TaskSubmissionsTaskToDo
              canMoveProgress={canMoveProgress}
              canSubmit={canSubmit}
              handleTaskProgressStatus={handleTaskProgressStatus}
              taskStatus={taskStatus}
            />
            <TaskSubmissionsTaskInProgress
              canSubmit={canSubmit}
              fetchedTaskSubmissions={fetchedTaskSubmissions}
              setMakeSubmission={setMakeSubmission}
              taskStatus={taskStatus}
            />
            <TaskSubmissionMakePayment
              fetchedTask={fetchedTask}
              fetchedTaskSubmissions={fetchedTaskSubmissions}
              setShowPaymentModal={setShowPaymentModal}
              taskStatus={taskStatus}
            />
          </>
        )}
        <TaskSubmissionList
          fetchedTaskSubmissions={listSubmissions}
          setSubmissionToEdit={setSubmissionToEdit}
          canReview={canReview}
          fetchedTask={fetchedTask}
          handleClose={handleClose}
          loggedInUser={loggedInUser}
          getTaskSubmissionsForTask={getTaskSubmissionsForTask}
        />
      </TaskSubmissionsFormInactive>
    </>
  );
};
