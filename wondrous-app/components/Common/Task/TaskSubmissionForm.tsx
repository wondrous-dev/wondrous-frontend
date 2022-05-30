import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import React, { useRef, useState } from 'react';
import { transformMediaFormat } from 'components/CreateEntity/editEntityModal';
import { useMutation, useQuery } from '@apollo/client';
import {
  ATTACH_SUBMISSION_MEDIA,
  CREATE_TASK_SUBMISSION,
  REMOVE_SUBMISSION_MEDIA,
  UPDATE_TASK_SUBMISSION,
} from 'graphql/mutations';
import { transformTaskSubmissionToTaskSubmissionCard } from 'utils/helpers';
import { ENTITIES_TYPES, TASK_STATUS_IN_PROGRESS, TASK_STATUS_IN_REVIEW } from 'utils/constants';
import { addInReviewItem, removeInProgressTask } from 'utils/board';
import { GET_ORG_USERS } from 'graphql/queries';
import {
  ActionButton,
  SubmissionHeader,
  SubmissionHeaderWrapper,
  TaskSectionDisplayDiv,
  TaskSectionDisplayLabel,
  TaskSectionDisplayText,
  TaskSectionInfoDiv,
} from 'components/Common/Task/styles';
import FileIcon from 'components/Icons/files.svg';
import {
  CreateFormButtonsBlock,
  CreateFormCancelButton,
  CreateFormFooterButtons,
  MediaUploadDiv,
  MultiMediaUploadButton,
  MultiMediaUploadButtonText,
  TextInputDiv,
} from 'components/CreateEntity/styles';
import { MediaItem } from 'components/CreateEntity/MediaItem';
import { AddFileUpload } from 'components/Icons/addFileUpload';
import { FileLoading } from 'components/Common/FileUpload/FileUpload';
import UploadImageIcon from 'components/Icons/uploadImage';
import { handleAddFile } from 'utils/media';
import { LinkIcon, NotesIcon } from 'components/Icons/taskModalIcons';
import { TextInputContext } from 'utils/contexts';
import { filterOrgUsersForAutocomplete } from 'components/CreateEntity/createEntityModal';
import { TextInput } from 'components/TextInput';
import { White } from '../../../theme/colors';
import InputForm from 'components/Common/InputForm/inputForm';
import { InProgressIcon } from 'components/Icons/statusIcons';

const TaskSubmissionForm = (props) => {
  const {
    setFetchedTaskSubmissions,
    cancelSubmissionForm,
    fetchedTaskSubmissions,
    orgId,
    taskId,
    submissionToEdit,
    sendRequest,
  } = props;
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
            style={{ height: '40px', marginRight: '0', marginLeft: '12px' }}
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

export default TaskSubmissionForm;
