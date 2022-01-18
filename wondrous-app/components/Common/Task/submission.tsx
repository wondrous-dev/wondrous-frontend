import React, { useCallback, useEffect, useRef, useState } from 'react'
import { formatDistance } from 'date-fns'
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
} from './styles'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { SafeImage } from '../Image'
import {
  parseUserPermissionContext,
  transformTaskProposalToTaskProposalCard,
  transformTaskSubmissionToTaskSubmissionCard,
  transformTaskToTaskCard,
} from '../../../utils/helpers'
import { RightCaret } from '../Image/RightCaret'
import CreatePodIcon from '../../Icons/createPod'
import { useOrgBoard, usePodBoard, useUserBoard } from '../../../utils/hooks'
import {
  BOUNTY_TYPE,
  ENTITIES_TYPES,
  IMAGE_FILE_EXTENSIONS_TYPE_MAPPING,
  PERMISSIONS,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_TODO,
  VIDEO_FILE_EXTENSIONS_TYPE_MAPPING,
} from '../../../utils/constants'
import { DropDown, DropDownItem } from '../dropdown'
import { TaskMenuIcon } from '../../Icons/taskMenu'
import { White } from '../../../theme/colors'
import { useMe } from '../../Auth/withAuth'
import { GetStatusIcon, renderMentionString } from '../../../utils/common'
import {
  AssigneeIcon,
  ImageIcon,
  LinkIcon,
  NotesIcon,
  ProposerIcon,
  ReviewerIcon,
} from '../../Icons/taskModalIcons'
import { DefaultUserImage } from '../Image/DefaultImages'
import EditLayoutBaseModal from '../../CreateEntity/editEntityModal'
import {
  CreateFormButtonsBlock,
  CreateFormCancelButton,
  CreateFormFooterButtons,
  CreateFormPreviewButton,
  CreateModalOverlay,
  MediaUploadDiv,
  MultiMediaUploadButton,
  MultiMediaUploadButtonText,
  TextInputDiv,
} from '../../CreateEntity/styles'
import { useRouter } from 'next/router'
import { CircularProgress, Typography } from '@material-ui/core'
import {
  COMPLETE_TASK,
  UPDATE_TASK_STATUS,
} from '../../../graphql/mutations/task'
import {
  APPROVE_SUBMISSION,
  ATTACH_SUBMISSION_MEDIA,
  CREATE_TASK_SUBMISSION,
  REMOVE_SUBMISSION_MEDIA,
  REQUEST_CHANGE_SUBMISSION,
  UPDATE_TASK_SUBMISSION,
} from '../../../graphql/mutations/taskSubmission'
import UploadImageIcon from '../../Icons/uploadImage'
import {
  getFilenameAndType,
  handleAddFile,
  uploadMedia,
} from '../../../utils/media'
import { MediaItem } from '../../CreateEntity/MediaItem'
import { AddFileUpload } from '../../Icons/addFileUpload'
import { TextInputContext } from '../../../utils/contexts'
import { TextInput } from '../../TextInput'
import { filterOrgUsersForAutocomplete } from '../../CreateEntity/createEntityModal'
import { GET_ORG_USERS } from '../../../graphql/queries/org'
import InputForm from '../InputForm/inputForm'
import { PinDropSharp } from '@material-ui/icons'
import { CompletedIcon, InReviewIcon } from '../../Icons/statusIcons'
import { RejectIcon } from '../../Icons/decisionIcons'
import { GET_PREVIEW_FILE } from '../../../graphql/queries/media'
import { transformMediaFormat } from '../../CreateEntity/editEntityModal'
import { GET_TASK_PROPOSAL_BY_ID } from '../../../graphql/queries/taskProposal'
import { MediaLink } from './modal'

const SubmissionStatusIcon = (props) => {
  const { submission } = props
  const iconStyle = {
    width: '20px',
    height: '20px',
    marginRight: '8px',
  }
  if (
    !submission?.approvedAt &&
    !submission?.changeRequestedAt &&
    !submission.rejectedAt
  ) {
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
    )
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
    )
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
    )
  }
}

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
  } = props
  const router = useRouter()
  const user = useMe()
  const mediaUploads = submission?.media
  const imageStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    marginRight: '12px',
  }
  const isCreator = user?.id === submission?.createdBy
  const orgBoard = useOrgBoard()

  const podBoard = usePodBoard()
  const userBoard = useUserBoard()
  const board = orgBoard || podBoard || userBoard
  // TODO: add user board
  const completeTask = () => {
    const newTask = {
      ...fetchedTask,
      completedAt: new Date(),
      status: TASK_STATUS_DONE,
    }
    const transformedTask = transformTaskToTaskCard(newTask, {})
    if (board) {
      const columns = [...board?.columns]
      const newInProgress = columns[1].tasks.filter(
        (task) => task.id !== fetchedTask.id
      )
      const newDone = [transformedTask, ...columns[2].tasks]
      const newInReview = (columns[1].section.tasks =
        columns[1].section.tasks.filter(
          (taskSubmission) => taskSubmission.id !== submission?.id
        ))
      columns[1].tasks = newInProgress
      columns[1].section.tasks = newInReview
      columns[2].tasks = newDone
      board?.setColumns(columns)
    }
    //TODO: add pod board and user board
  }
  const [approveSubmission] = useMutation(APPROVE_SUBMISSION, {
    variables: {
      submissionId: submission?.id,
    },
    onCompleted: () => {
      // Change status of submission
      const newFetchedTaskSubmissions = fetchedTaskSubmissions.map(
        (taskSubmission) => {
          if (taskSubmission?.id === submission?.id) {
            return {
              ...taskSubmission,
              approvedAt: new Date(),
            }
          }
        }
      )
      setFetchedTaskSubmissions(newFetchedTaskSubmissions)
      if (fetchedTask.type !== BOUNTY_TYPE) {
        completeTask()
        handleClose()
        document.body.setAttribute('style', `position: relative;`)
        window?.scrollTo(0, window.scrollY)
      }
    },
  })
  const [requestChangeSubmission] = useMutation(REQUEST_CHANGE_SUBMISSION, {
    variables: {
      submissionId: submission?.id,
    },
    onCompleted: () => {
      // Change status of submission
      // Change status of submission
      const newFetchedTaskSubmissions = fetchedTaskSubmissions.map(
        (taskSubmission) => {
          if (taskSubmission?.id === submission?.id) {
            return {
              ...taskSubmission,
              changeRequestedAt: new Date(),
            }
          }
        }
      )
      setFetchedTaskSubmissions(newFetchedTaskSubmissions)
    },
  })

  return (
    <TaskSubmissionItemDiv>
      <TaskSubmissionHeader>
        {submission?.creatorProfilePicture ? (
          <SafeImage
            style={imageStyle}
            src={submission?.creatorProfilePicture}
          />
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
            <TaskSubmissionHeaderCreatorText
              style={{
                marginRight: '8px',
              }}
            >
              {submission.creatorUsername}
            </TaskSubmissionHeaderCreatorText>
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
                <MediaLink key={mediaItem?.slug} media={mediaItem} />
              ))}
            </MediaUploadDiv>
          ) : (
            <TaskDescriptionText
              style={{
                marginTop: '8px',
              }}
            >
              None
            </TaskDescriptionText>
          )}
        </TaskSectionInfoDiv>
      </TaskSectionDisplayDiv>
      <TaskSectionDisplayDiv>
        <TaskSectionDisplayLabel
          style={{
            marginRight: '8px',
          }}
        >
          <LinkIcon />
          <TaskSectionDisplayText>Link </TaskSectionDisplayText>
        </TaskSectionDisplayLabel>
        {submission?.links && submission?.links[0]?.url ? (
          <TaskSubmissionLink href={submission?.links[0]?.url}>
            {submission?.links[0]?.url}
          </TaskSubmissionLink>
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
                    setMakeSubmission(true)
                    setSubmissionToEdit(submission)
                  }}
                >
                  Edit submission
                </CreateFormPreviewButton>
              </CreateFormButtonsBlock>
            )}
            {canReview && (
              <>
                <CreateFormButtonsBlock>
                  {!submission.changeRequestedAt && !submission.approvedAt && (
                    <CreateFormCancelButton onClick={requestChangeSubmission}>
                      Request changes
                    </CreateFormCancelButton>
                  )}
                  {!submission.approvedAt && (
                    <CreateFormPreviewButton onClick={approveSubmission}>
                      Approve
                    </CreateFormPreviewButton>
                  )}
                </CreateFormButtonsBlock>
              </>
            )}
          </CreateFormFooterButtons>
        </>
      )}
    </TaskSubmissionItemDiv>
  )
}

const TaskSubmissionForm = (props) => {
  const {
    setFetchedTaskSubmissions,
    cancelSubmissionForm,
    fetchedTaskSubmissions,
    orgId,
    taskId,
    submissionToEdit,
  } = props
  const orgBoard = useOrgBoard()
  const podBoard = usePodBoard()
  const userBoard = useUserBoard()
  const board = orgBoard || podBoard || userBoard
  const [mediaUploads, setMediaUploads] = useState(
    transformMediaFormat(submissionToEdit?.media) || []
  )
  const [descriptionText, setDescriptionText] = useState(
    submissionToEdit?.description || ''
  )

  const [link, setLink] = useState(
    (submissionToEdit?.links && submissionToEdit?.links[0]?.url) || ''
  )
  const [createTaskSubmission] = useMutation(CREATE_TASK_SUBMISSION, {
    onCompleted: (data) => {
      const taskSubmission = data?.createTaskSubmission
      const transformedTaskSubmission =
        transformTaskSubmissionToTaskSubmissionCard(taskSubmission, {})
      setFetchedTaskSubmissions([
        transformedTaskSubmission,
        ...fetchedTaskSubmissions,
      ])
      if (board) {
        const columns = board?.columns
        const newColumns = [...columns]
        newColumns[1].section.tasks = [
          transformedTaskSubmission,
          ...newColumns[1].section.tasks,
        ]
        if (board?.setColumns) {
          board?.setColumns(newColumns)
        }
      }

      if (cancelSubmissionForm) {
        cancelSubmissionForm()
      }
    },
  })
  const [updateTaskSubmission] = useMutation(UPDATE_TASK_SUBMISSION, {
    onCompleted: (data) => {
      const taskSubmission = data?.updateTaskSubmission
      const transformedTaskSubmission =
        transformTaskSubmissionToTaskSubmissionCard(taskSubmission, {})
      const newFetchedTaskSubmissions = fetchedTaskSubmissions.map(
        (fetchedTaskSubmission) => {
          if (taskSubmission?.id === fetchedTaskSubmission?.id) {
            return transformedTaskSubmission
          }
          return fetchedTaskSubmission
        }
      )
      setFetchedTaskSubmissions(newFetchedTaskSubmissions)
      if (cancelSubmissionForm) {
        cancelSubmissionForm()
      }
    },
  })
  const [attachTaskSubmissionMedia] = useMutation(ATTACH_SUBMISSION_MEDIA)
  const [removeTaskSubmissionMedia] = useMutation(REMOVE_SUBMISSION_MEDIA)

  const { data: orgUsersData } = useQuery(GET_ORG_USERS, {
    variables: {
      orgId,
    },
  })

  const inputRef: any = useRef()
  let removeItem = null
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
                              const newFetchedTaskSubmissions =
                                fetchedTaskSubmissions.map(
                                  (fetchedTaskSubmission) => {
                                    if (
                                      fetchedTaskSubmission?.id ===
                                      submissionToEdit?.id
                                    ) {
                                      const newMedia = mediaUploads.filter(
                                        (mediaUpload) => {
                                          return (
                                            mediaUpload?.uploadSlug !==
                                            mediaItem?.uploadSlug
                                          )
                                        }
                                      )
                                      const newTaskSubmission = {
                                        ...fetchedTaskSubmission,
                                        media: newMedia,
                                      }
                                      return newTaskSubmission
                                    }
                                  }
                                )
                              setFetchedTaskSubmissions(
                                newFetchedTaskSubmissions
                              )
                            },
                          })
                        }
                      : null
                  }
                />
              ))}
              <AddFileUpload
                onClick={() => {
                  inputRef.current.click()
                }}
                style={{
                  cursor: 'pointer',
                  width: '24',
                  height: '24',
                  marginBottom: '8px',
                }}
              />
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
              <MultiMediaUploadButtonText>
                Upload file
              </MultiMediaUploadButtonText>
            </MultiMediaUploadButton>
          )}
          <input
            type="file"
            hidden
            ref={inputRef}
            onChange={async (event) => {
              const fileToAdd = await handleAddFile({
                event,
                filePrefix: 'tmp/task/new/',
                mediaUploads,
                setMediaUploads,
              })
              if (submissionToEdit) {
                attachTaskSubmissionMedia({
                  variables: {
                    submissionId: submissionToEdit?.id,
                    input: {
                      mediaUploads: [fileToAdd],
                    },
                  },
                  onCompleted: () => {
                    const newFetchedTaskSubmissions =
                      fetchedTaskSubmissions.map((fetchedTaskSubmission) => {
                        if (
                          fetchedTaskSubmission?.id === submissionToEdit?.id
                        ) {
                          const newTaskSubmission = {
                            ...fetchedTaskSubmission,
                            media: [...mediaUploads, fileToAdd],
                          }
                          return newTaskSubmission
                        }
                      })
                    setFetchedTaskSubmissions(newFetchedTaskSubmissions)
                  },
                })
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
          <CreateFormCancelButton onClick={cancelSubmissionForm}>
            Cancel
          </CreateFormCancelButton>
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
                })
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
                })
              }
            }}
          >
            {submissionToEdit ? 'Submit edits' : 'Submit for approval'}
          </CreateFormPreviewButton>
        </CreateFormButtonsBlock>
      </CreateFormFooterButtons>
    </>
  )
}

const MakeSubmissionBlock = (props) => {
  const { fetchedTask, setMakeSubmission, prompt } = props

  return (
    <MakeSubmissionDiv>
      <TaskSectionInfoDiv
        style={{
          marginTop: 0,
          width: '100%',
        }}
      >
        {fetchedTask?.assigneeUsername && (
          <>
            {fetchedTask?.assigneeProfilePicture ? (
              <SafeImage
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '13px',
                  marginRight: '4px',
                }}
                src={fetchedTask?.assigneeProfilePicture}
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
              {fetchedTask?.assigneeUsername}
            </TaskSectionInfoText>
            <div
              style={{
                flex: 1,
              }}
            />
            <CreateFormPreviewButton onClick={() => setMakeSubmission(true)}>
              {prompt}
            </CreateFormPreviewButton>
          </>
        )}
      </TaskSectionInfoDiv>
    </MakeSubmissionDiv>
  )
}

export const TaskSubmissionContent = (props) => {
  const {
    taskSubmissionLoading,
    canSubmit,
    fetchedTask,
    setFetchedTask,
    updateTaskStatus,
    fetchedTaskSubmissions,
    board,
    canMoveProgress,
    canReview,
    setMakeSubmission,
    makeSubmission,
    orgId,
    setFetchedTaskSubmissions,
    handleClose,
  } = props

  const [submissionToEdit, setSubmissionToEdit] = useState(null)

  if (taskSubmissionLoading) {
    return <CircularProgress />
  }
  if (
    (canSubmit || canMoveProgress) &&
    fetchedTask?.status === TASK_STATUS_TODO
  ) {
    return (
      <div
      // style={{
      //   display: 'flex',
      //   alignItems: 'center',
      // }}
      >
        <TaskTabText>
          To submit task submissions please first move this to in progress
        </TaskTabText>
        <CreateFormPreviewButton
          style={{
            marginTop: '16px',
          }}
          onClick={() => {
            updateTaskStatus({
              variables: {
                taskId: fetchedTask?.id,
                input: {
                  newStatus: TASK_STATUS_IN_PROGRESS,
                },
              },
              onCompleted: (data) => {
                const task = data?.updateTaskStatus
                if (board?.setColumns && task?.orgId === board?.orgId) {
                  const transformedTask = transformTaskToTaskCard(task, {})

                  const columns = [...board?.columns]
                  columns[0].tasks = columns[0].tasks.filter((existingTask) => {
                    if (transformedTask?.id !== existingTask?.id) {
                      return existingTask
                    }
                  })
                  columns[1].tasks = [transformedTask, ...columns[1].tasks]
                  board.setColumns(columns)
                }
              },
            })
          }}
        >
          Set to in progress
        </CreateFormPreviewButton>
      </div>
    )
  }
  if (
    !canSubmit &&
    fetchedTaskSubmissions?.length === 0 &&
    fetchedTask?.assigneeUsername
  ) {
    return (
      <TaskTabText>
        None at the moment. Only @{fetchedTask?.assigneeUsername} can create a
        submission{' '}
      </TaskTabText>
    )
  }
  if (canSubmit && fetchedTaskSubmissions?.length === 0) {
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
          />
        )}
      </>
    )
  }
  if (makeSubmission && submissionToEdit) {
    return (
      <TaskSubmissionForm
        setFetchedTaskSubmissions={setFetchedTaskSubmissions}
        isEdit={true}
        cancelSubmissionForm={() => {
          setMakeSubmission(false)
          setSubmissionToEdit(null)
        }}
        fetchedTaskSubmissions={fetchedTaskSubmissions}
        orgId={orgId}
        taskId={fetchedTask?.id}
        submissionToEdit={submissionToEdit}
      />
    )
  }

  if (fetchedTaskSubmissions?.length > 0) {
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
            <MakeSubmissionBlock
              fetchedTask={fetchedTask}
              setMakeSubmission={setMakeSubmission}
              prompt={'Make another submission'}
            />
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
                  submission={transformTaskSubmissionToTaskSubmissionCard(
                    taskSubmission,
                    {}
                  )}
                />
              )
            })}
          </>
        )}
      </>
    )
  }
  return null
}
