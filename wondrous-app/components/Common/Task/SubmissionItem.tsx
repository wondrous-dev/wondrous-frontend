import { useRouter } from 'next/router';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { BOUNTY_TYPE, PAYMENT_STATUS, TASK_STATUS_DONE, TASK_TYPE } from 'utils/constants';
import { transformTaskToTaskCard } from 'utils/helpers';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { APPROVE_BOUNTY_SUBMISSION, APPROVE_SUBMISSION, REQUEST_CHANGE_SUBMISSION } from 'graphql/mutations';
import { GET_TASK_BY_ID } from 'graphql/queries';
import { KudosForm } from 'components/Common/KudosForm';
import {
  ActionButton,
  MediaLinkWrapper,
  TaskDescriptionText,
  TaskSectionDisplayDiv,
  TaskSectionDisplayLabel,
  TaskSectionDisplayText,
  TaskSectionInfoDiv,
  TaskSubmissionHeader,
  TaskSubmissionHeaderTextDiv,
  TaskSubmissionHeaderTimeText,
  TaskSubmissionItemDiv,
  TaskSubmissionLink,
} from 'components/Common/Task/styles';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import SubmissionStatusIcon from 'components/Common/Task/SubmissionStatusIcon';
import { formatDistance } from 'date-fns';
import { LinkIcon, NotesIcon } from 'components/Icons/taskModalIcons';
import { renderMentionString } from 'utils/common';
import FileIcon from 'components/Icons/files.svg';
import {
  CreateFormButtonsBlock,
  CreateFormFooterButtons,
  EditSubmissionButton,
  MediaUploadDiv,
} from 'components/CreateEntity/styles';
import { MediaLink } from 'components/Common/Task/modal';
import { CompletedIcon, InProgressIcon } from 'components/Icons/statusIcons';
import { PaymentButton } from 'components/Common/Task/paymentButton';

const SubmissionItem = (props) => {
  const {
    submission,
    setMakeSubmission,
    setSendRequest,
    setSubmissionToEdit,
    canReview,
    fetchedTask,
    setFetchedTask,
    fetchedTaskSubmissions,
    setFetchedTaskSubmissions,
    handleClose,
    user,
    setShowPaymentModal,
    getTaskSubmissionsForTask,
  } = props;
  const router = useRouter();
  const mediaUploads = submission?.media;
  const imageStyle = {
    width: '28px',
    height: '28px',
    borderRadius: '20px',
    marginRight: '4px',
  };
  const isCreator = user?.id === submission?.createdBy;
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || podBoard || userBoard;
  const boardColumns = useColumns();
  // TODO: add user board
  const completeTask = () => {
    const newTask = {
      ...fetchedTask,
      completedAt: new Date(),
      status: TASK_STATUS_DONE,
    };
    const transformedTask = transformTaskToTaskCard(newTask, {});

    //TODO refactor this
    if (boardColumns) {
      const columns = [...boardColumns?.columns];
      const newInProgress = columns[1].tasks.filter((task) => task.id !== fetchedTask.id);
      const newDone = [transformedTask, ...columns[2].tasks];
      if (columns[1].section) {
        const newInReview = (columns[1].section.tasks = columns[1].section.tasks.filter(
          (taskSubmission) => taskSubmission.id !== submission?.id
        ));
        columns[1].tasks = newInProgress;
        columns[1].section.tasks = newInReview;
        columns[2].tasks = newDone;
      } else {
        const newInReview = (columns[2].tasks = columns[2].tasks.filter(
          (taskSubmission) => taskSubmission.id !== submission?.id
        ));
        columns[1].tasks = newInProgress;
        columns[2].tasks = newInReview;
        columns[3].tasks = newDone;
      }
      boardColumns?.setColumns(columns);
    }
    //TODO: add pod board and user board
  };
  const [isKudosModalOpen, setIsKudosForm] = useState(false);
  const [approveSubmission] = useMutation(APPROVE_SUBMISSION, {
    variables: {
      submissionId: submission?.id,
    },
    onCompleted: () => {
      // Change status of submission
      const newFetchedTaskSubmissions = fetchedTaskSubmissions.map((taskSubmission) => {
        if (taskSubmission?.id === submission?.id) {
          return {
            ...taskSubmission,
            approvedAt: new Date(),
          };
        }
      });
      setFetchedTaskSubmissions(newFetchedTaskSubmissions);
      if (fetchedTask?.type !== BOUNTY_TYPE) {
        completeTask();
        setIsKudosForm(true);
      }
    },
    refetchQueries: [
      'getOrgTaskBoardTasks',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      GET_TASK_BY_ID,
    ],
  });
  const [approveBountySubmission] = useMutation(APPROVE_BOUNTY_SUBMISSION, {
    variables: {
      submissionId: submission?.id,
    },
    onCompleted: () => {
      // Change status of submission
      const newFetchedTaskSubmissions = fetchedTaskSubmissions.map((taskSubmission) => {
        if (taskSubmission?.id === submission?.id) {
          return {
            ...taskSubmission,
            approvedAt: new Date(),
          };
        }
      });
      setFetchedTaskSubmissions(newFetchedTaskSubmissions);
      if (fetchedTask?.type !== BOUNTY_TYPE) {
        completeTask();
        setIsKudosForm(true);
      }
      if (fetchedTask?.type === BOUNTY_TYPE && (orgBoard || podBoard)) {
        const columns = board?.columns.map((col) =>
          col.id === submission.taskId
            ? {
                ...col,
                approvedSubmissionsCount:
                  (Number.isInteger(col.approvedSubmissionsCount) ? col.approvedSubmissionsCount : 0) + 1,
              }
            : col
        );
        board?.setColumns(columns);
      }
    },
  });
  const [requestChangeTaskSubmission] = useMutation(REQUEST_CHANGE_SUBMISSION, {
    variables: {
      submissionId: submission?.id,
    },
    onCompleted: () => {
      // Change status of submission
      // Change status of submission
      const newFetchedTaskSubmissions = fetchedTaskSubmissions.map((taskSubmission) => {
        if (taskSubmission?.id === submission?.id) {
          return {
            ...taskSubmission,
            changeRequestedAt: new Date(),
          };
        }
      });
      setFetchedTaskSubmissions(newFetchedTaskSubmissions);
      if (fetchedTask?.type === BOUNTY_TYPE && (orgBoard || podBoard)) {
        const columns = board?.columns.map((col) =>
          col.id === submission.taskId ? { ...col, approvedSubmissionsCount: col.approvedSubmissionsCount + 1 } : col
        );
        board?.setColumns(columns);
      }
    },
  });
  const textStyle = {
    marginLeft: '0',
    maxWidth: '500px',
    textAlign: 'left',
  };

  const styleActionButton = {
    height: '40px',
    marginRight: '0',
    marginLeft: '12px',
  };

  return (
    <>
      <KudosForm onClose={handleClose} open={isKudosModalOpen} submission={submission} />
      <TaskSubmissionItemDiv>
        <TaskSubmissionHeader>
          <TaskSubmissionHeaderTextDiv>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {submission?.creatorProfilePicture ? (
                <SafeImage style={imageStyle} src={submission?.creatorProfilePicture} />
              ) : (
                <DefaultUserImage style={imageStyle} />
              )}
              <SubmissionStatusIcon submission={submission} />
              {submission.createdAt && (
                <TaskSubmissionHeaderTimeText>
                  {formatDistance(new Date(submission.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </TaskSubmissionHeaderTimeText>
              )}
            </div>
          </TaskSubmissionHeaderTextDiv>
        </TaskSubmissionHeader>
        <TaskSectionDisplayDiv
          style={{
            alignItems: 'flex-start',
            flexWrap: 'nowrap',
            textAlign: 'left',
          }}
        >
          <TaskSectionDisplayLabel
            style={{
              marginRight: '8px',
            }}
          >
            <NotesIcon />
            <TaskSectionDisplayText>Notes </TaskSectionDisplayText>
          </TaskSectionDisplayLabel>
          <TaskDescriptionText
            style={{
              marginTop: '12px',
              ...textStyle,
            }}
          >
            {renderMentionString({
              content: submission?.description,
              router,
            })}
          </TaskDescriptionText>
        </TaskSectionDisplayDiv>
        <TaskSectionDisplayDiv>
          <TaskSectionDisplayLabel
            style={{
              marginRight: '20px',
            }}
          >
            <LinkIcon />
            <TaskSectionDisplayText>Link </TaskSectionDisplayText>
          </TaskSectionDisplayLabel>
          {submission?.links && submission?.links[0]?.url ? (
            <TaskSubmissionLink href={submission?.links[0]?.url} target="_blank">
              {submission?.links[0]?.url}
            </TaskSubmissionLink>
          ) : (
            <>
              <TaskDescriptionText
                style={{
                  marginTop: '13px',
                }}
              >
                None
              </TaskDescriptionText>
            </>
          )}
        </TaskSectionDisplayDiv>
        <TaskSectionDisplayDiv>
          <TaskSectionDisplayLabel
            style={{
              marginRight: '4px',
            }}
          >
            <FileIcon />
            <TaskSectionDisplayText>Files</TaskSectionDisplayText>
          </TaskSectionDisplayLabel>
          <TaskSectionInfoDiv>
            {mediaUploads?.length > 0 ? (
              <MediaUploadDiv>
                {mediaUploads.map((mediaItem, index) => (
                  <div key={mediaItem?.slug}>
                    <MediaLinkWrapper>
                      <div>{index + 1}.</div>
                      <MediaLink style={textStyle} media={mediaItem} />
                    </MediaLinkWrapper>
                    <SafeImage
                      style={{
                        width: '100%',
                        borderRadius: '6px',
                        border: '0.5px solid #B8B8B8',
                      }}
                      src={mediaItem?.slug}
                    />
                  </div>
                ))}
              </MediaUploadDiv>
            ) : (
              <TaskDescriptionText style={{ marginTop: '5px' }}>None</TaskDescriptionText>
            )}
          </TaskSectionInfoDiv>
        </TaskSectionDisplayDiv>

        {(isCreator || canReview) && (
          <>
            <CreateFormFooterButtons
              style={{
                borderTop: '1px solid #363636',
                paddingTop: '14px',
                marginTop: '14px',
              }}
            >
              {isCreator && !submission.approvedAt && (
                <CreateFormButtonsBlock>
                  {/* <CreateFormCancelButton onClick={}>
                    TODO: this should be delete
                  </CreateFormCancelButton> */}
                  <EditSubmissionButton
                    onClick={() => {
                      setMakeSubmission(true);
                      setSubmissionToEdit(submission);
                    }}
                  >
                    Edit submission
                  </EditSubmissionButton>
                </CreateFormButtonsBlock>
              )}
              {canReview && fetchedTask?.status !== TASK_STATUS_DONE && (
                <>
                  <CreateFormButtonsBlock>
                    {!submission.changeRequestedAt && !submission.approvedAt && (
                      <ActionButton
                        style={styleActionButton}
                        onClick={() => {
                          setMakeSubmission(true);
                          setSendRequest(submission);
                        }}
                      >
                        Request changes
                        {
                          <InProgressIcon
                            style={{
                              width: '28px',
                              height: '28px',
                              marginLeft: '6px',
                            }}
                            noStroke
                          />
                        }
                      </ActionButton>
                    )}
                    {!submission.approvedAt && !submission.changeRequestedAt && fetchedTask?.type === TASK_TYPE && (
                      <ActionButton style={styleActionButton} onClick={approveSubmission}>
                        Approve
                        {
                          <CompletedIcon
                            style={{
                              width: '28px',
                              height: '28px',
                              marginLeft: '6px',
                            }}
                            noStroke
                          />
                        }
                      </ActionButton>
                    )}
                    {!submission.approvedAt && !submission.changeRequestedAt && fetchedTask?.type === BOUNTY_TYPE && (
                      <ActionButton style={styleActionButton} onClick={approveBountySubmission}>
                        Approve
                        {
                          <CompletedIcon
                            style={{
                              width: '28px',
                              height: '28px',
                              marginLeft: '6px',
                            }}
                          />
                        }
                      </ActionButton>
                    )}
                  </CreateFormButtonsBlock>
                </>
              )}
              {fetchedTask?.type === BOUNTY_TYPE &&
                submission.approvedAt &&
                (submission?.paymentStatus !== PAYMENT_STATUS.PAID ||
                  submission?.paymentStatus !== PAYMENT_STATUS.PROCESSING) && (
                  <PaymentButton
                    fetchedTask={fetchedTask}
                    taskSubmissions={fetchedTaskSubmissions}
                    handleClose={handleClose}
                    getTaskSubmissionsForTask={getTaskSubmissionsForTask}
                    submission={submission}
                  />
                )}
            </CreateFormFooterButtons>
          </>
        )}
      </TaskSubmissionItemDiv>
    </>
  );
};

export default SubmissionItem;
