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
  SubmissionHeaderWrapper,
  SubmissionHeader,
  ActionButton,
  MediaLinkWrapper,
} from './styles';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { SafeImage } from '../Image';
import {
  parseUserPermissionContext,
  transformTaskProposalToTaskProposalCard,
  transformTaskSubmissionToTaskSubmissionCard,
  transformTaskToTaskCard,
} from 'utils/helpers';
import { RightCaret } from '../Image/RightCaret';
import CreatePodIcon from '../../Icons/createPod';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
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
  TASK_TYPE,
  TASK_STATUS_IN_REVIEW,
} from 'utils/constants';
import { White } from '../../../theme/colors';
import { useMe } from '../../Auth/withAuth';
import { GetStatusIcon, renderMentionString } from 'utils/common';
import { ImageIcon, LinkIcon, NotesIcon } from '../../Icons/taskModalIcons';
import DefaultUserImage from '../Image/DefaultUserImage';
import {
  CreateFormButtonsBlock,
  CreateFormCancelButton,
  CreateFormFooterButtons,
  CreateFormPreviewButton,
  EditSubmissionButton,
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
  APPROVE_BOUNTY_SUBMISSION,
} from 'graphql/mutations/taskSubmission';
import UploadImageIcon from '../../Icons/uploadImage';
import { handleAddFile } from 'utils/media';
import { MediaItem } from '../../CreateEntity/MediaItem';
import { AddFileUpload } from '../../Icons/addFileUpload';
import { TextInputContext } from 'utils/contexts';
import { TextInput } from '../../TextInput';
import { filterOrgUsersForAutocomplete } from '../../CreateEntity/createEntityModal';
import { GET_ORG_USERS } from 'graphql/queries/org';
import InputForm from '../InputForm/inputForm';
import { CompletedIcon, InReviewIcon, InProgressIcon } from '../../Icons/statusIcons';
import { RejectIcon } from '../../Icons/decisionIcons';
import { transformMediaFormat } from '../../CreateEntity/editEntityModal';
import { MediaLink } from './modal';
import { delQuery } from 'utils';
import { FileLoading } from '../FileUpload/FileUpload';
import { MakePaymentBlock } from './payment';
import { KudosForm } from '../KudosForm';
import { PaymentButton } from './paymentButton';
import FileIcon from 'components/Icons/files.svg';
import { GET_TASK_BY_ID } from 'graphql/queries';
import { addInReviewItem, removeInProgressTask } from 'utils/board';

const SubmissionStatusIcon = (props) => {
  const { submission } = props;
  const iconStyle = {
    width: '28px',
    height: '28px',
    marginRight: '10px',
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
        <TaskSubmissionHeaderCreatorText>{submission.creatorUsername}</TaskSubmissionHeaderCreatorText>
        <TaskStatusHeaderText>Awaiting review</TaskStatusHeaderText>
      </div>
    );
  } else if (submission?.changeRequestedAt) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <InProgressIcon style={iconStyle} />
        <TaskSubmissionHeaderCreatorText>{submission.creatorUsername}</TaskSubmissionHeaderCreatorText>
        <TaskStatusHeaderText>requested changes</TaskStatusHeaderText>
      </div>
    );
  } else if (submission?.rejectedAt) {
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
        <TaskSubmissionHeaderCreatorText>{submission.creatorUsername}</TaskSubmissionHeaderCreatorText>
        <TaskStatusHeaderText>rejected</TaskStatusHeaderText>
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
        <TaskSubmissionHeaderCreatorText>{submission.creatorUsername}</TaskSubmissionHeaderCreatorText>
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
        <TaskSubmissionHeaderCreatorText>{submission.creatorUsername}</TaskSubmissionHeaderCreatorText>
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
        <TaskSubmissionHeaderCreatorText>{submission.creatorUsername}</TaskSubmissionHeaderCreatorText>
        <TaskStatusHeaderText>Approved</TaskStatusHeaderText>
      </div>
    );
  }
};

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
    marginLeft: '12px'
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
                      <div>{index + 1 }.</div>
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
              <TaskDescriptionText style={{marginTop: '5px'}}>None</TaskDescriptionText>
            )}
          </TaskSectionInfoDiv>
        </TaskSectionDisplayDiv>

        {(isCreator || canReview) && (
          <>
            <CreateFormFooterButtons
              style={{
                borderTop: '1px solid #363636',
                paddingTop: '14px',
                marginTop: '14px'
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
                      <ActionButton style={styleActionButton} onClick={() => {
                        setMakeSubmission(true);
                        setSendRequest(submission);
                      }}>
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

const TaskSubmissionForm = (props) => {
  const { setFetchedTaskSubmissions, cancelSubmissionForm, fetchedTaskSubmissions, orgId, taskId, submissionToEdit, sendRequest } =
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

  const isValidIndex = (index) => {
    if (index >= 0) return index;
    return false;
  };

  const [createTaskSubmission] = useMutation(CREATE_TASK_SUBMISSION, {
    onCompleted: (data) => {
      const taskSubmission = data?.createTaskSubmission;
      const transformedTaskSubmission = transformTaskSubmissionToTaskSubmissionCard(taskSubmission, {});
      setFetchedTaskSubmissions([transformedTaskSubmission, ...fetchedTaskSubmissions]);
      if (boardColumns && (!board?.entityType || board?.entityType !== ENTITIES_TYPES.BOUNTY)) {
        const columns = boardColumns?.columns;
        let newColumns = [...columns];

        const inProgressColumnIndex =
          isValidIndex(newColumns.findIndex((column) => column.status === TASK_STATUS_IN_PROGRESS)) ||
          isValidIndex(newColumns.findIndex((column) => column.section?.filter?.taskType === TASK_STATUS_IN_PROGRESS));

        const inProgressColumn = newColumns[inProgressColumnIndex];

        const taskSubmissionTask = inProgressColumn?.tasks.find((element) => element?.id === taskSubmission?.taskId);
        newColumns = addInReviewItem(
          {
            ...taskSubmissionTask,
            status: TASK_STATUS_IN_REVIEW,
          },
          columns
        );
        newColumns = removeInProgressTask(taskSubmissionTask?.id, columns);
        if (boardColumns?.setColumns) {
          boardColumns?.setColumns(newColumns);
        }
      }
      if (boardColumns && board?.entityType === ENTITIES_TYPES.BOUNTY) {
        const newColumns = board?.columns.map((col) =>
          col.id === transformedTaskSubmission.taskId
            ? {
              ...col,
              totalSubmissionsCount:
                (Number.isInteger(col.totalSubmissionsCount) ? col.totalSubmissionsCount : 0) + 1,
            }
            : col
        );
        boardColumns?.setColumns(newColumns);
      }
      if (cancelSubmissionForm) {
        cancelSubmissionForm();
      }
    },
    refetchQueries: ['getPerStatusTaskCountForOrgBoard', 'getOrgTaskBoardTasks', 'getPodTaskBoardTasks'],
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
      <SubmissionHeaderWrapper>
        <SubmissionHeader>
          {submissionToEdit ? 'Edit submission' : sendRequest ? 'Request changes' : 'Make a submission'}
        </SubmissionHeader>
      </SubmissionHeaderWrapper>
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
                  marginRight: '12px',
                }}
              />
              <MultiMediaUploadButtonText>Upload file(s)</MultiMediaUploadButtonText>
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
      <CreateFormFooterButtons>
        <CreateFormButtonsBlock>
          <CreateFormCancelButton onClick={cancelSubmissionForm}>Cancel</CreateFormCancelButton>
          <ActionButton
            style={{height: '40px', marginRight: '0', marginLeft: '12px'}}
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
            {submissionToEdit ? 'Submit edits' : sendRequest ? 'Send request' : 'Submit for approval'}
            {sendRequest && (
              <InProgressIcon
                style={{
                  width: '28px',
                  height: '28px',
                  marginLeft: '6px',
                }}
                noStroke
              />
            )}
          </ActionButton>
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
            <ActionButton style={{height: '40px'}} onClick={() => setMakeSubmission(true)}>
              {prompt}
              <InReviewIcon
                style={{
                  width: '28px',
                  height: '28px',
                  marginLeft: '10px',
                }}
                none={'none'}
              />
            </ActionButton>
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
    isBounty,
  } = props;

  const router = useRouter();
  const [submissionToEdit, setSubmissionToEdit] = useState(null);
  const [sendRequest, setSendRequest] = useState(null);
  const [moveProgressButton, setMoveProgressButton] = useState(true);
  const taskStatus = fetchedTask?.status;
  const fetchedTaskSubmissionsLength = fetchedTaskSubmissions?.length;
  const loggedInUser = useMe();

  const handleTaskProgressStatus = () => {
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
        if (boardColumns?.setColumns) {
          const transformedTask = transformTaskToTaskCard(task, {});
          if (board?.entityType && board?.entityType === ENTITIES_TYPES.BOUNTY) {
            const newColumns = boardColumns?.columns.map((col) =>
              col.id === transformedTask.id ? transformedTask : col
            );
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
      },
    });
  };

  if (taskSubmissionLoading) {
    return <CircularProgress />;
  }
  if ((canSubmit || canMoveProgress) && fetchedTask?.status === TASK_STATUS_TODO && moveProgressButton && !isBounty) {
    return (
      <div
      // style={{
      //   display: 'flex',
      //   alignItems: 'center',
      // }}
      >
        <TaskTabText>To submit tasask submissions please first move this to in progress</TaskTabText>
        <CreateFormPreviewButton
          style={{
            marginTop: '16px',
          }}
          onClick={handleTaskProgressStatus}
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
            prompt={'Submit deliverables'}
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
  if (makeSubmission && sendRequest) {
    return (
      <TaskSubmissionForm
        setFetchedTaskSubmissions={setFetchedTaskSubmissions}
        cancelSubmissionForm={() => {
          setMakeSubmission(false);
          setSendRequest(null);
        }}
        fetchedTaskSubmissions={fetchedTaskSubmissions}
        orgId={orgId}
        taskId={fetchedTask?.id}
        sendRequest={sendRequest}
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
                  setSendRequest={setSendRequest}
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
