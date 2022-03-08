import React, { useCallback, useEffect, useRef, useState } from 'react';
import { formatDistance } from 'date-fns';
import {
  TaskDescriptionText,
  TaskSectionDisplayDiv,
  TaskSectionDisplayLabel,
  TaskSectionDisplayText,
  TaskSectionInfoText,
  TaskSectionInfoDiv,
  TaskModalFooter,
  TaskSectionFooterTitleDiv,
  TaskSubmissionTab,
  TaskTabText,
  TaskSectionContent,
  MakeSubmissionDiv,
  TaskSubmissionItemDiv,
  TaskSubmissionHeader,
  TaskSubmissionHeaderTextDiv,
  TaskSubmissionHeaderCreatorText,
  TaskSubmissionHeaderTimeText,
  TaskStatusHeaderText,
  TaskSubmissionLink,
  TaskLink,
  TaskMediaContainer,
} from './styles';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { SafeImage } from '../Image';
import {
  parseUserPermissionContext,
  transformTaskProposalToTaskProposalCard,
  transformTaskSubmissionToTaskSubmissionCard,
  transformTaskToTaskCard,
} from '../../../utils/helpers';
import { RightCaret } from '../Image/RightCaret';
import CreatePodIcon from '../../Icons/createPod';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from '../../../utils/hooks';
import {
  BOUNTY_TYPE,
  ENTITIES_TYPES,
  IMAGE_FILE_EXTENSIONS_TYPE_MAPPING,
  PERMISSIONS,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_TODO,
  TASK_STATUS_ARCHIVED,
  VIDEO_FILE_EXTENSIONS_TYPE_MAPPING,
  PAYMENT_STATUS,
} from '../../../utils/constants';
import { White } from '../../../theme/colors';
import { useMe } from '../../Auth/withAuth';
import { GetStatusIcon, renderMentionString } from '../../../utils/common';
import { ImageIcon, LinkIcon, NotesIcon } from '../../Icons/taskModalIcons';
import DefaultUserImage from '../Image/DefaultUserImage';
import {
  CreateFormButtonsBlock,
  CreateFormCancelButton,
  CreateFormFooterButtons,
  CreateFormPreviewButton,
  MediaUploadDiv,
  MultiMediaUploadButton,
  MultiMediaUploadButtonText,
  TextInputDiv,
} from '../../CreateEntity/styles';
import { useRouter } from 'next/router';
import { CircularProgress } from '@material-ui/core';
import {
  APPROVE_SUBMISSION,
  ATTACH_SUBMISSION_MEDIA,
  CREATE_TASK_SUBMISSION,
  REMOVE_SUBMISSION_MEDIA,
  REQUEST_CHANGE_SUBMISSION,
  UPDATE_TASK_SUBMISSION,
} from '../../../graphql/mutations/taskSubmission';
import UploadImageIcon from '../../Icons/uploadImage';
import { handleAddFile } from '../../../utils/media';
import { MediaItem } from '../../CreateEntity/MediaItem';
import { AddFileUpload } from '../../Icons/addFileUpload';
import { TextInputContext } from '../../../utils/contexts';
import { TextInput } from '../../TextInput';
import { filterOrgUsersForAutocomplete } from '../../CreateEntity/createEntityModal';
import { GET_ORG_USERS } from '../../../graphql/queries/org';
import InputForm from '../InputForm/inputForm';
import { CompletedIcon, InReviewIcon } from '../../Icons/statusIcons';
import { RejectIcon } from '../../Icons/decisionIcons';
import { transformMediaFormat } from '../../CreateEntity/editEntityModal';
import { MediaLink } from './modal';
import { delQuery } from '../../../utils';
import { FileLoading } from '../FileUpload/FileUpload';
import { MakePaymentBlock } from './payment';
import { KudosForm } from '../KudosForm';
import { PaymentButton } from './paymentButton';

const SubmissionStatusIcon = (props) => {
  const { submission } = props;
  const iconStyle = {
    width: '20px',
    height: '20px',
    marginRight: '8px',
  };
  if (!submission?.approvedAt && !submission?.changeRequestedAt && !submission.rejectedAt) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <InReviewIcon style={iconStyle} />
        <TaskStatusHeaderText>Awaiting review</TaskStatusHeaderText>
      </div>
    );
  } else if (submission?.changeRequestedAt || submission?.rejectedAt) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <RejectIcon
          style={{
            width: '16px',
            height: '16px',
            marginRight: '8px',
          }}
        />
        <TaskStatusHeaderText>Changes requested</TaskStatusHeaderText>
      </div>
    );
  } else if (submission?.approvedAt && submission?.paymentStatus === PAYMENT_STATUS.PAID) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CompletedIcon style={iconStyle} />
        <TaskStatusHeaderText>Approved and Paid</TaskStatusHeaderText>
      </div>
    );
  } else if (submission?.approvedAt && submission?.paymentStatus === PAYMENT_STATUS.PROCESSING) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CompletedIcon style={iconStyle} />
        <TaskStatusHeaderText>Approved and Processing Payment</TaskStatusHeaderText>
      </div>
    );
  } else if (submission?.approvedAt) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CompletedIcon style={iconStyle} />
        <TaskStatusHeaderText>Approved</TaskStatusHeaderText>
      </div>
    );
  }
};

const SubmissionItem = (props) => {
  const {
    submission,
    setMakeSubmission,
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
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    marginRight: '12px',
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
    if (boardColumns) {
      const columns = [...boardColumns?.columns];
      const newInProgress = columns[1].tasks.filter((task) => task.id !== fetchedTask.id);
      const newDone = [transformedTask, ...columns[2].tasks];
      const newInReview = (columns[1].section.tasks = columns[1].section.tasks.filter(
        (taskSubmission) => taskSubmission.id !== submission?.id
      ));
      columns[1].tasks = newInProgress;
      columns[1].section.tasks = newInReview;
      columns[2].tasks = newDone;
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
    refetchQueries: ['getOrgTaskBoardSubmissions', 'getPerStatusTaskCountForOrgBoard'],
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
    },
    refetchQueries: ['getOrgTaskBoardSubmissions'],
  });
  const textStyle = {
    marginLeft: '0',
    maxWidth: '500px',
  };
  return (
    <>
      <KudosForm onClose={handleClose} open={isKudosModalOpen} submission={submission} />
      <TaskSubmissionItemDiv>
        <TaskSubmissionHeader>
          {submission?.creatorProfilePicture ? (
            <SafeImage style={imageStyle} src={submission?.creatorProfilePicture} />
          ) : (
            <DefaultUserImage style={imageStyle} />
          )}
          <TaskSubmissionHeaderTextDiv>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <TaskSubmissionHeaderCreatorText>{submission.creatorUsername}</TaskSubmissionHeaderCreatorText>
              {submission.createdAt && (
                <TaskSubmissionHeaderTimeText>
                  {formatDistance(new Date(submission.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </TaskSubmissionHeaderTimeText>
              )}
            </div>
            <SubmissionStatusIcon submission={submission} />
          </TaskSubmissionHeaderTextDiv>
        </TaskSubmissionHeader>
        <TaskSectionDisplayDiv>
          <TaskSectionDisplayLabel
            style={{
              marginRight: '4px',
            }}
          >
            <ImageIcon />
            <TaskSectionDisplayText>Files</TaskSectionDisplayText>
          </TaskSectionDisplayLabel>
          <TaskSectionInfoDiv>
            {mediaUploads?.length > 0 ? (
              <MediaUploadDiv>
                {mediaUploads.map((mediaItem) => (
                  <MediaLink style={textStyle} key={mediaItem?.slug} media={mediaItem} />
                ))}
              </MediaUploadDiv>
            ) : (
              <TaskDescriptionText>None</TaskDescriptionText>
            )}
          </TaskSectionInfoDiv>
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
            <TaskSubmissionLink href={submission?.links[0]?.url}>{submission?.links[0]?.url}</TaskSubmissionLink>
          ) : (
            <>
              <TaskDescriptionText
                style={{
                  marginTop: '8px',
                }}
              >
                None
              </TaskDescriptionText>
            </>
          )}
        </TaskSectionDisplayDiv>
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

        {(isCreator || canReview) && (
          <>
            <CreateFormFooterButtons>
              {isCreator && !submission.approvedAt && (
                <CreateFormButtonsBlock>
                  {/* <CreateFormCancelButton onClick={}>
                    TODO: this should be delete
                  </CreateFormCancelButton> */}
                  <CreateFormPreviewButton
                    onClick={() => {
                      setMakeSubmission(true);
                      setSubmissionToEdit(submission);
                    }}
                  >
                    Edit submission
                  </CreateFormPreviewButton>
                </CreateFormButtonsBlock>
              )}
              {canReview && fetchedTask?.status !== TASK_STATUS_DONE && (
                <>
                  <CreateFormButtonsBlock>
                    {!submission.changeRequestedAt && !submission.approvedAt && (
                      <CreateFormCancelButton onClick={requestChangeTaskSubmission}>
                        Request changes
                      </CreateFormCancelButton>
                    )}
                    {!submission.approvedAt && (
                      <CreateFormPreviewButton onClick={approveSubmission}>Approve</CreateFormPreviewButton>
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
                  />
                )}
            </CreateFormFooterButtons>
          </>
        )}
      </TaskSubmissionItemDiv>
    </>
  );
};

const TaskSubmissionForm = (props) => {
  const { setFetchedTaskSubmissions, cancelSubmissionForm, fetchedTaskSubmissions, orgId, taskId, submissionToEdit } =
    props;
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const boardColumns = useColumns();
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const board = orgBoard || podBoard || userBoard;
  const [mediaUploads, setMediaUploads] = useState(transformMediaFormat(submissionToEdit?.media) || []);
  const [descriptionText, setDescriptionText] = useState(submissionToEdit?.description || '');

  const [link, setLink] = useState((submissionToEdit?.links && submissionToEdit?.links[0]?.url) || '');
  const [createTaskSubmission] = useMutation(CREATE_TASK_SUBMISSION, {
    onCompleted: (data) => {
      const taskSubmission = data?.createTaskSubmission;
      const transformedTaskSubmission = transformTaskSubmissionToTaskSubmissionCard(taskSubmission, {});
      setFetchedTaskSubmissions([transformedTaskSubmission, ...fetchedTaskSubmissions]);
      if (boardColumns) {
        const columns = boardColumns?.columns;
        const newColumns = [...columns];
        newColumns[1].section.tasks = [transformedTaskSubmission, ...newColumns[1].section.tasks];
        if (boardColumns?.setColumns) {
          boardColumns?.setColumns(newColumns);
        }
      }

      if (cancelSubmissionForm) {
        cancelSubmissionForm();
      }
    },
    refetchQueries: ['getPerStatusTaskCountForOrgBoard'],
  });
  const [updateTaskSubmission] = useMutation(UPDATE_TASK_SUBMISSION, {
    onCompleted: (data) => {
      const taskSubmission = data?.updateTaskSubmission;
      const transformedTaskSubmission = transformTaskSubmissionToTaskSubmissionCard(taskSubmission, {});
      const newFetchedTaskSubmissions = fetchedTaskSubmissions.map((fetchedTaskSubmission) => {
        if (taskSubmission?.id === fetchedTaskSubmission?.id) {
          return transformedTaskSubmission;
        }
        return fetchedTaskSubmission;
      });
      setFetchedTaskSubmissions(newFetchedTaskSubmissions);
      if (cancelSubmissionForm) {
        cancelSubmissionForm();
      }
    },
  });
  const [attachTaskSubmissionMedia] = useMutation(ATTACH_SUBMISSION_MEDIA);
  const [removeTaskSubmissionMedia] = useMutation(REMOVE_SUBMISSION_MEDIA);

  const { data: orgUsersData } = useQuery(GET_ORG_USERS, {
    variables: {
      orgId,
    },
  });

  const inputRef: any = useRef();
  let removeItem = null;
  return (
    <>
      <TaskSectionDisplayDiv>
        <TaskSectionDisplayLabel
          style={{
            marginRight: '4px',
          }}
        >
          <ImageIcon />
          <TaskSectionDisplayText>Files</TaskSectionDisplayText>
        </TaskSectionDisplayLabel>
        <TaskSectionInfoDiv>
          {mediaUploads?.length > 0 ? (
            <MediaUploadDiv>
              {mediaUploads.map((mediaItem) => (
                <MediaItem
                  key={mediaItem?.uploadSlug}
                  mediaUploads={mediaUploads}
                  setMediaUploads={setMediaUploads}
                  mediaItem={mediaItem}
                  removeMediaItem={
                    submissionToEdit
                      ? () => {
                          removeTaskSubmissionMedia({
                            variables: {
                              submissionId: submissionToEdit?.id,
                              slug: mediaItem?.uploadSlug,
                            },
                            onCompleted: () => {
                              const newFetchedTaskSubmissions = fetchedTaskSubmissions.map((fetchedTaskSubmission) => {
                                if (fetchedTaskSubmission?.id === submissionToEdit?.id) {
                                  const newMedia = mediaUploads.filter((mediaUpload) => {
                                    return mediaUpload?.uploadSlug !== mediaItem?.uploadSlug;
                                  });
                                  const newTaskSubmission = {
                                    ...fetchedTaskSubmission,
                                    media: newMedia,
                                  };
                                  return newTaskSubmission;
                                }
                              });
                              setFetchedTaskSubmissions(newFetchedTaskSubmissions);
                            },
                          });
                        }
                      : null
                  }
                />
              ))}
              <AddFileUpload
                onClick={() => {
                  inputRef.current.click();
                }}
                style={{
                  cursor: 'pointer',
                  width: '24',
                  height: '24',
                  marginBottom: '8px',
                }}
              />
              {fileUploadLoading && <FileLoading />}
            </MediaUploadDiv>
          ) : (
            <MultiMediaUploadButton onClick={() => inputRef.current.click()}>
              <UploadImageIcon
                style={{
                  width: '13',
                  height: '17',
                  marginRight: '8px',
                }}
              />
              <MultiMediaUploadButtonText>Upload file</MultiMediaUploadButtonText>
              {fileUploadLoading && <FileLoading />}
            </MultiMediaUploadButton>
          )}
          <input
            type="file"
            hidden
            ref={inputRef}
            onChange={async (event) => {
              setFileUploadLoading(true);
              const fileToAdd = await handleAddFile({
                event,
                filePrefix: 'tmp/task/new/',
                mediaUploads,
                setMediaUploads: () => {},
              });
              if (submissionToEdit) {
                attachTaskSubmissionMedia({
                  variables: {
                    submissionId: submissionToEdit?.id,
                    input: {
                      mediaUploads: [fileToAdd],
                    },
                  },
                  onCompleted: (data) => {
                    const taskSubmission = data?.attachTaskSubmissionMedia;
                    setMediaUploads(transformMediaFormat(taskSubmission?.media));
                    setFileUploadLoading(false);
                    const newFetchedTaskSubmissions = fetchedTaskSubmissions.map((fetchedTaskSubmission) => {
                      if (fetchedTaskSubmission?.id === submissionToEdit?.id) {
                        const newTaskSubmission = {
                          ...fetchedTaskSubmission,
                          media: taskSubmission?.media,
                        };
                        return newTaskSubmission;
                      }
                    });
                    setFetchedTaskSubmissions(newFetchedTaskSubmissions);
                  },
                });
              } else {
                setMediaUploads([...mediaUploads, fileToAdd]);
                setFileUploadLoading(false);
              }
            }}
          />
        </TaskSectionInfoDiv>
      </TaskSectionDisplayDiv>
      <TaskSectionDisplayDiv
        style={{
          alignItems: 'flex-start',
        }}
      >
        <TaskSectionDisplayLabel
          style={{
            marginRight: '8px',
          }}
        >
          <LinkIcon />
          <TaskSectionDisplayText>Link </TaskSectionDisplayText>
        </TaskSectionDisplayLabel>
        <InputForm
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Enter link"
          search={false}
          style={{
            flex: 1,
            marginTop: '8px',
            marginLeft: '8px',
          }}
        />
      </TaskSectionDisplayDiv>
      <TaskSectionDisplayDiv
        style={{
          alignItems: 'flex-start',
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
        <TextInputDiv
          style={{
            flex: 1,
            marginTop: '8px',
          }}
        >
          <TextInputContext.Provider
            value={{
              content: descriptionText,
              onChange: (e) => setDescriptionText(e.target.value),
              list: filterOrgUsersForAutocomplete(orgUsersData?.getOrgUsers),
            }}
          >
            <TextInput
              placeholder="Enter description"
              // rows={5}
              // maxRows={5}
              style={{
                input: {
                  overflow: 'auto',
                  color: White,
                  height: '100px',
                  marginBottom: '16px',
                  borderRadius: '6px',
                  padding: '8px',
                },
              }}
            />
          </TextInputContext.Provider>
        </TextInputDiv>
      </TaskSectionDisplayDiv>
      <CreateFormFooterButtons>
        <CreateFormButtonsBlock>
          <CreateFormCancelButton onClick={cancelSubmissionForm}>Cancel</CreateFormCancelButton>
          <CreateFormPreviewButton
            onClick={() => {
              if (submissionToEdit) {
                updateTaskSubmission({
                  variables: {
                    submissionId: submissionToEdit?.id,
                    input: {
                      description: descriptionText,
                      links: [
                        {
                          url: link,
                          displayName: link,
                        },
                      ],
                    },
                  },
                });
              } else {
                createTaskSubmission({
                  variables: {
                    input: {
                      taskId,
                      description: descriptionText,
                      links: [
                        {
                          url: link,
                          displayName: link,
                        },
                      ],
                      mediaUploads,
                    },
                  },
                });
              }
            }}
          >
            {submissionToEdit ? 'Submit edits' : 'Submit for approval'}
          </CreateFormPreviewButton>
        </CreateFormButtonsBlock>
      </CreateFormFooterButtons>
    </>
  );
};

const MakeSubmissionBlock = (props) => {
  const { fetchedTask, setMakeSubmission, prompt, canSubmit, loggedInUser } = props;
  const user = fetchedTask?.assigneeId ? fetchedTask : canSubmit && loggedInUser;
  const profilePicture = user?.assigneeProfilePicture ?? user?.profilePicture;
  const username = user?.assigneeUsername ?? user?.username;

  return (
    <MakeSubmissionDiv>
      <TaskSectionInfoDiv
        style={{
          marginTop: 0,
          width: '100%',
        }}
      >
        {canSubmit && (
          <>
            {profilePicture ? (
              <SafeImage
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '13px',
                  marginRight: '4px',
                }}
                src={profilePicture}
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
            <TaskSectionInfoText
              style={{
                fontSize: '16px',
              }}
            >
              {username}
            </TaskSectionInfoText>
            <div
              style={{
                flex: 1,
              }}
            />
            <CreateFormPreviewButton onClick={() => setMakeSubmission(true)}>{prompt}</CreateFormPreviewButton>
          </>
        )}
      </TaskSectionInfoDiv>
    </MakeSubmissionDiv>
  );
};

export const TaskSubmissionContent = (props) => {
  const {
    taskSubmissionLoading,
    canSubmit,
    fetchedTask,
    setFetchedTask,
    updateTaskStatus,
    fetchedTaskSubmissions,
    board,
    boardColumns,
    canMoveProgress,
    canReview,
    setMakeSubmission,
    makeSubmission,
    orgId,
    setFetchedTaskSubmissions,
    handleClose,
    setShowPaymentModal,
    getTaskSubmissionsForTask,
  } = props;

  const router = useRouter();
  const [submissionToEdit, setSubmissionToEdit] = useState(null);
  const [moveProgressButton, setMoveProgressButton] = useState(true);
  const taskStatus = fetchedTask?.status;
  const fetchedTaskSubmissionsLength = fetchedTaskSubmissions?.length;
  const loggedInUser = useMe();
  if (taskSubmissionLoading) {
    return <CircularProgress />;
  }
  if ((canSubmit || canMoveProgress) && fetchedTask?.status === TASK_STATUS_TODO && moveProgressButton) {
    return (
      <div
      // style={{
      //   display: 'flex',
      //   alignItems: 'center',
      // }}
      >
        <TaskTabText>To submit task submissions please first move this to in progress</TaskTabText>
        <CreateFormPreviewButton
          style={{
            marginTop: '16px',
          }}
          onClick={() => {
            setMoveProgressButton(false);
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
              onCompleted: (data) => {
                const task = data?.updateTaskStatus;
                handleClose();
                if (
                  boardColumns?.setColumns &&
                  ((task?.orgId === board?.orgId && !board?.podId) ||
                    task?.podId === board?.podId ||
                    task?.assigneeId === board?.userId)
                ) {
                  const transformedTask = transformTaskToTaskCard(task, {});

                  const columns = [...boardColumns?.columns];
                  columns[0].tasks = columns[0].tasks.filter((existingTask) => {
                    if (transformedTask?.id !== existingTask?.id) {
                      return true;
                    }
                    return false;
                  });
                  columns[1].tasks = [transformedTask, ...columns[1].tasks];
                  boardColumns.setColumns(columns);
                }
              },
            });
          }}
        >
          Set to in progress
        </CreateFormPreviewButton>
      </div>
    );
  }
  if (!canSubmit && fetchedTaskSubmissionsLength === 0 && fetchedTask?.assigneeUsername) {
    return (
      <TaskTabText>None at the moment. Only @{fetchedTask?.assigneeUsername} can create a submission </TaskTabText>
    );
  }
  if (canSubmit && fetchedTaskSubmissionsLength === 0) {
    return (
      <>
        {makeSubmission ? (
          <TaskSubmissionForm
            setFetchedTaskSubmissions={setFetchedTaskSubmissions}
            cancelSubmissionForm={() => setMakeSubmission(false)}
            fetchedTaskSubmissions={fetchedTaskSubmissions}
            orgId={orgId}
            taskId={fetchedTask?.id}
          />
        ) : (
          <MakeSubmissionBlock
            fetchedTask={fetchedTask}
            prompt={'Make a submission'}
            setMakeSubmission={setMakeSubmission}
            canSubmit={canSubmit}
            loggedInUser={loggedInUser}
          />
        )}
      </>
    );
  }
  if (makeSubmission && submissionToEdit) {
    return (
      <TaskSubmissionForm
        setFetchedTaskSubmissions={setFetchedTaskSubmissions}
        isEdit={true}
        cancelSubmissionForm={() => {
          setMakeSubmission(false);
          setSubmissionToEdit(null);
        }}
        fetchedTaskSubmissions={fetchedTaskSubmissions}
        orgId={orgId}
        taskId={fetchedTask?.id}
        submissionToEdit={submissionToEdit}
      />
    );
  }

  if (fetchedTaskSubmissionsLength > 0) {
    // display list of submissions
    return (
      <>
        {makeSubmission ? (
          <TaskSubmissionForm
            setFetchedTaskSubmissions={setFetchedTaskSubmissions}
            cancelSubmissionForm={() => setMakeSubmission(false)}
            fetchedTaskSubmissions={fetchedTaskSubmissions}
            orgId={orgId}
            taskId={fetchedTask?.id}
          />
        ) : (
          <>
            {taskStatus !== TASK_STATUS_DONE && taskStatus !== TASK_STATUS_ARCHIVED && (
              <MakeSubmissionBlock
                fetchedTask={fetchedTask}
                setMakeSubmission={setMakeSubmission}
                prompt={'Make another submission'}
                canSubmit={canSubmit}
                loggedInUser={loggedInUser}
              />
            )}
            {taskStatus === TASK_STATUS_DONE && fetchedTask?.type === ENTITIES_TYPES.TASK && (
              <MakePaymentBlock
                fetchedTask={fetchedTask}
                setShowPaymentModal={setShowPaymentModal}
                taskSubmissions={fetchedTaskSubmissions}
              />
            )}
            {fetchedTaskSubmissions?.map((taskSubmission) => {
              return (
                <SubmissionItem
                  setMakeSubmission={setMakeSubmission}
                  setSubmissionToEdit={setSubmissionToEdit}
                  key={taskSubmission?.id}
                  canReview={canReview}
                  fetchedTask={fetchedTask}
                  setFetchedTask={setFetchedTask}
                  handleClose={handleClose}
                  setFetchedTaskSubmissions={setFetchedTaskSubmissions}
                  fetchedTaskSubmissions={fetchedTaskSubmissions}
                  submission={transformTaskSubmissionToTaskSubmissionCard(taskSubmission, {})}
                  user={loggedInUser}
                  setShowPaymentModal={setShowPaymentModal}
                  getTaskSubmissionsForTask={getTaskSubmissionsForTask}
                />
              );
            })}
          </>
        )}
      </>
    );
  }
  return null;
};
