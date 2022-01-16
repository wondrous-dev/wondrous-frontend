import React, { useCallback, useEffect, useRef, useState } from 'react'
import Modal from '@mui/material/Modal'
import { format, formatDistance } from 'date-fns'
import {
  PodNameTypography,
  TaskActionMenu,
  TaskModal,
  TaskModalHeader,
  TaskTitleDiv,
  TaskTitleTextDiv,
  TaskTitleText,
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
} from './styles'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import {
  GET_TASK_BY_ID,
  GET_TASK_REVIEWERS,
  GET_TASK_SUBMISSIONS_FOR_TASK,
} from '../../../graphql/queries/task'
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
  ENTITIES_TYPES,
  IMAGE_FILE_EXTENSIONS_TYPE_MAPPING,
  PERMISSIONS,
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
import { UPDATE_TASK_STATUS } from '../../../graphql/mutations/task'
import { CREATE_TASK_SUBMISSION } from '../../../graphql/mutations/taskSubmission'
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

const SubmissionStatusIcon = (submission) => {
  const iconStyle = {
    width: '20px',
    height: '20px',
    marginRight: '8px',
  }
  if (
    !submission?.approvedAt &&
    !submission?.changedRequested &&
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
  } else if (submission?.changedRequested || submission?.rejectedAt) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <RejectIcon style={iconStyle} />
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
  const { submission } = props
  const router = useRouter()
  const mediaUploads = submission?.media
  console.log('submission', submission)
  const imageStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    marginRight: '12px',
  }
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
            <TaskSubmissionHeaderTimeText>
              {formatDistance(new Date(submission.createdAt), new Date(), {
                addSuffix: true,
              })}
            </TaskSubmissionHeaderTimeText>
          </div>
          <SubmissionStatusIcon submission={submission} />
        </TaskSubmissionHeaderTextDiv>
      </TaskSubmissionHeader>
      <TaskSectionDisplayDiv>
        <TaskSectionDisplayLabel
          style={{
            marginRight: '8px',
          }}
        >
          <ImageIcon />
          <TaskSectionDisplayText>File</TaskSectionDisplayText>
        </TaskSectionDisplayLabel>
        <TaskSectionInfoDiv>
          {mediaUploads.length > 0 ? (
            <MediaUploadDiv>
              {mediaUploads.map((mediaItem) => (
                <MediaItem
                  key={mediaItem?.uploadSlug}
                  mediaUploads={mediaUploads}
                  mediaItem={mediaItem}
                  viewOnly={true}
                />
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
        {submission?.links[0]?.url ? (
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
    </TaskSubmissionItemDiv>
  )
}

const TaskSubmissionForm = (props) => {
  const {
    setFetchedTaskSubmissions,
    setMakeSubmission,
    fetchedTaskSubmissions,
    orgId,
    taskId,
    existingMediaUploads,
    existingDescriptionText,
    existingLink,
  } = props
  const [mediaUploads, setMediaUploads] = useState(existingMediaUploads || [])
  const [descriptionText, setDescriptionText] = useState(
    existingDescriptionText || ''
  )
  const [link, setLink] = useState(existingLink || '')
  const [createTaskSubmission] = useMutation(CREATE_TASK_SUBMISSION, {
    onCompleted: (data) => {
      const taskSubmission = data?.createTaskSubmission
      const transformedTaskSubmission =
        transformTaskSubmissionToTaskSubmissionCard(taskSubmission, {})
      setFetchedTaskSubmissions([
        transformedTaskSubmission,
        ...fetchedTaskSubmissions,
      ])
      setMakeSubmission(false)
    },
  })

  const { data: orgUsersData } = useQuery(GET_ORG_USERS, {
    variables: {
      orgId,
    },
  })

  const inputRef: any = useRef()
  return (
    <>
      <TaskSectionDisplayDiv>
        <TaskSectionDisplayLabel
          style={{
            marginRight: '8px',
          }}
        >
          <ImageIcon />
          <TaskSectionDisplayText>File</TaskSectionDisplayText>
        </TaskSectionDisplayLabel>
        <TaskSectionInfoDiv>
          {mediaUploads.length > 0 ? (
            <MediaUploadDiv>
              {mediaUploads.map((mediaItem) => (
                <MediaItem
                  key={mediaItem?.uploadSlug}
                  mediaUploads={mediaUploads}
                  setMediaUploads={setMediaUploads}
                  mediaItem={mediaItem}
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
            onChange={(event) =>
              handleAddFile({
                event,
                filePrefix: 'tmp/task_submission/new/',
                setMediaUploads,
                mediaUploads,
              })
            }
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
          <CreateFormCancelButton onClick={() => setMakeSubmission(false)}>
            Cancel
          </CreateFormCancelButton>
          <CreateFormPreviewButton
            onClick={() => {
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
            }}
          >
            Submit for approval
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
const TaskSubmissionContent = (props) => {
  const {
    taskSubmissionLoading,
    canSubmit,
    fetchedTask,
    updateTaskStatus,
    fetchedTaskSubmissions,
    orgBoard,
    canMoveProgress,
    setMakeSubmission,
    makeSubmission,
    orgId,
    setFetchedTaskSubmissions,
  } = props

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
                if (orgBoard?.setColumns && task?.orgId === orgBoard?.orgId) {
                  const transformedTask = transformTaskToTaskCard(task, {})

                  const columns = [...orgBoard?.columns]
                  columns[0].tasks = columns[0].tasks.filter((existingTask) => {
                    if (transformedTask?.id !== existingTask?.id) {
                      return existingTask
                    }
                  })
                  columns[1].tasks = [transformedTask, ...columns[1].tasks]
                  orgBoard.setColumns(columns)
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
            setMakeSubmission={setMakeSubmission}
            fetchedTaskSubmissions={fetchedTaskSubmissions}
            orgId={orgId}
            taskId={fetchedTask?.id}
          />
        ) : (
          <MakeSubmissionBlock
            fetchedTask={fetchedTask}
            setMakeSubmission={setMakeSubmission}
            prompt={'Make a submission'}
          />
        )}
      </>
    )
  }
  if (fetchedTaskSubmissions?.length > 0) {
    // display list of submissions
    return (
      <>
        <MakeSubmissionBlock
          fetchedTask={fetchedTask}
          setMakeSubmission={setMakeSubmission}
          prompt={'Make another submission'}
        />
        {fetchedTaskSubmissions?.map((taskSubmission) => {
          return (
            <SubmissionItem
              key={taskSubmission?.id}
              submission={transformTaskSubmissionToTaskSubmissionCard(
                taskSubmission,
                {}
              )}
            />
          )
        })}
      </>
    )
  }
  return null
}

export const TaskViewModal = (props) => {
  const { open, handleOpen, handleClose, task, taskId } = props
  const [fetchedTask, setFetchedTask] = useState(null)
  const [fetchedTaskSubmissions, setFetchedTaskSubmissions] = useState([])
  const [fetchedTaskComments, setFetchedTaskComments] = useState([])
  const [taskSubmissionLoading, setTaskSubmissionLoading] = useState(true)
  const [makeSubmission, setMakeSubmission] = useState(false)
  // const [orgBoard, setOrgBoard] = useState(null)
  // const [userBoard, setUserBoard] = useState(null)
  // const [podBoard, setPodBoard] = useState(null)
  const orgBoard = useOrgBoard()
  const userBoard = useUserBoard()
  const podBoard = usePodBoard()
  const [getTaskSubmissionsForTask] = useLazyQuery(
    GET_TASK_SUBMISSIONS_FOR_TASK,
    {
      onCompleted: (data) => {
        const taskSubmissions = data?.getTaskSubmissionsForTask
        setFetchedTaskSubmissions(taskSubmissions || [])
        setTaskSubmissionLoading(false)
      },
      fetchPolicy: 'network-only',
      onError: (err) => {
        console.log('err', err)
        setTaskSubmissionLoading(false)
      },
    }
  )
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS)
  const router = useRouter()
  const [canEdit, setCanEdit] = useState(false)
  const [canMoveProgress, setCanMoveProgress] = useState(false)
  const [editTask, setEditTask] = useState(false)
  const [submissionSelected, setSubmissionSelected] = useState(true)
  const [getReviewers, { data: reviewerData }] =
    useLazyQuery(GET_TASK_REVIEWERS)
  const user = useMe()
  const userPermissionsContext =
    orgBoard?.userPermissionsContext ||
    podBoard?.userPermissionsContext ||
    userBoard?.userPermissionsContext

  const [getTaskById] = useLazyQuery(GET_TASK_BY_ID, {
    onCompleted: (data) => {
      const taskData = data?.getTaskById
      if (taskData) {
        setFetchedTask(
          transformTaskToTaskCard(taskData, {
            orgProfilePicture: taskData?.org?.profilePicture,
            orgName: taskData?.org?.name,
            podName: taskData?.pod?.name,
          })
        )
      }
    },
  })

  useEffect(() => {
    if (!task && taskId) {
      getTaskById({
        variables: {
          taskId,
        },
      })
    } else if (task) {
      setFetchedTask(task)
    }

    if (fetchedTask) {
      const permissions = parseUserPermissionContext({
        userPermissionsContext,
        orgId: task?.orgId,
        podId: task?.podId,
      })

      const canEdit =
        permissions.includes(PERMISSIONS.FULL_ACCESS) ||
        fetchedTask?.createdBy === user?.id ||
        (fetchedTask?.assigneeId && fetchedTask?.assigneeId === user?.id)
      const canMoveProgress =
        (podBoard && permissions.includes(PERMISSIONS.MANAGE_BOARD)) ||
        permissions.includes(PERMISSIONS.FULL_ACCESS) ||
        fetchedTask?.createdBy === user?.id ||
        (fetchedTask?.assigneeId && fetchedTask?.assigneeId === user?.id)
      setCanEdit(canEdit)
      setCanMoveProgress(canMoveProgress)
      getReviewers({
        variables: {
          taskId: fetchedTask?.id,
        },
      })
      console.log('what the fudge')
      getTaskSubmissionsForTask({
        variables: {
          taskId: fetchedTask?.id,
        },
      })
    }
    // if (boardOrg) {
    //   setOrgBoard(boardOrg)
    // }
  }, [
    taskId,
    task,
    getTaskById,
    fetchedTask,
    userPermissionsContext,
    user?.id,
    getReviewers,
    getTaskSubmissionsForTask,
    // boardOrg,
    podBoard,
  ])
  if (editTask) {
    return (
      <CreateModalOverlay
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        open={open}
        onClose={() => {
          setEditTask(false)
          handleClose()
        }}
      >
        <EditLayoutBaseModal
          entityType={ENTITIES_TYPES.TASK}
          handleClose={() => {
            setEditTask(false)
            handleClose()
          }}
          cancelEdit={() => setEditTask(false)}
          existingTask={
            fetchedTask && {
              ...fetchedTask,
              reviewers: reviewerData?.getTaskReviewers || [],
            }
          }
          isTaskProposal={false}
        />
      </CreateModalOverlay>
    )
  }

  const canSubmit = fetchedTask?.assigneeId === user?.id

  return (
    <Modal open={open} onClose={handleClose}>
      <TaskModal>
        <TaskModalHeader>
          <SafeImage
            src={task?.orgProfilePicture || 'seed/wonder_logo.jpg'}
            style={{
              width: '29px',
              height: '28px',
              borderRadius: '4px',
              marginRight: '8px',
            }}
          />
          {fetchedTask?.podName && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <RightCaret
                style={{
                  marginRight: '12px',
                  marginLeft: '12px',
                }}
              />
              <CreatePodIcon
                style={{
                  marginRight: '2px',
                }}
              />
              <PodNameTypography>{fetchedTask?.podName}</PodNameTypography>
            </div>
          )}

          {canEdit && (
            <TaskActionMenu right="true">
              <DropDown DropdownHandler={TaskMenuIcon}>
                <DropDownItem
                  key={'task-menu-edit-' + fetchedTask?.id}
                  onClick={() => setEditTask(true)}
                  style={{
                    color: White,
                  }}
                >
                  Edit task
                </DropDownItem>
              </DropDown>
            </TaskActionMenu>
          )}
        </TaskModalHeader>
        <TaskTitleDiv>
          <GetStatusIcon
            status={fetchedTask?.status}
            style={{
              marginRight: '12px',
            }}
          />
          <TaskTitleTextDiv>
            <TaskTitleText>{fetchedTask?.title}</TaskTitleText>
            <TaskDescriptionText>
              {renderMentionString({
                content: fetchedTask?.description,
                router,
              })}
            </TaskDescriptionText>
          </TaskTitleTextDiv>
        </TaskTitleDiv>
        <TaskSectionDisplayDiv>
          <TaskSectionDisplayLabel>
            <ReviewerIcon />
            <TaskSectionDisplayText>Reviewer</TaskSectionDisplayText>
          </TaskSectionDisplayLabel>
          {reviewerData?.getTaskReviewers?.length > 0 ? (
            reviewerData?.getTaskReviewers.map((taskReviewer) => (
              <TaskSectionInfoDiv key={taskReviewer?.id}>
                {taskReviewer?.profilePicture ? (
                  <SafeImage
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '13px',
                      marginRight: '4px',
                    }}
                    src={taskReviewer?.profilePicture}
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
                <TaskSectionInfoText>
                  {taskReviewer?.username}
                </TaskSectionInfoText>
              </TaskSectionInfoDiv>
            ))
          ) : (
            <TaskSectionInfoText
              style={{
                marginTop: '8px',
                marginLeft: '16px',
              }}
            >
              None
            </TaskSectionInfoText>
          )}
        </TaskSectionDisplayDiv>
        <TaskSectionDisplayDiv>
          <TaskSectionDisplayLabel>
            <AssigneeIcon />
            <TaskSectionDisplayText>Assignee</TaskSectionDisplayText>
          </TaskSectionDisplayLabel>
          <TaskSectionInfoDiv key={fetchedTask?.assigneeUsername}>
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
                <TaskSectionInfoText>
                  {fetchedTask?.assigneeUsername}
                </TaskSectionInfoText>
              </>
            )}
            {!fetchedTask?.assigneeUsername && (
              <TaskSectionInfoText
                style={{
                  marginLeft: '4px',
                }}
              >
                None
              </TaskSectionInfoText>
            )}
          </TaskSectionInfoDiv>
        </TaskSectionDisplayDiv>
        <TaskSectionDisplayDiv>
          <TaskSectionDisplayLabel>
            <AssigneeIcon />
            <TaskSectionDisplayText>Due date</TaskSectionDisplayText>
          </TaskSectionDisplayLabel>
          <TaskSectionInfoText
            style={{
              marginTop: '8px',
              marginLeft: '16px',
            }}
          >
            {fetchedTask?.dueDate
              ? format(new Date(fetchedTask?.dueDate), 'MM/dd/yyyy')
              : 'None'}
          </TaskSectionInfoText>
        </TaskSectionDisplayDiv>
        <TaskModalFooter>
          <TaskSectionFooterTitleDiv>
            <TaskSubmissionTab
              style={{
                borderBottom: `2px solid ${
                  submissionSelected ? '#7427FF' : '#4B4B4B'
                }`,
              }}
              onClick={() => setSubmissionSelected(true)}
            >
              <TaskTabText
                style={{
                  fontWeight: `${submissionSelected ? '500' : '400'}`,
                }}
              >
                Submissions
              </TaskTabText>
            </TaskSubmissionTab>
            <TaskSubmissionTab
              style={{
                borderBottom: `2px solid ${
                  !submissionSelected ? '#7427FF' : '#4B4B4B'
                }`,
              }}
              onClick={() => setSubmissionSelected(false)}
            >
              <TaskTabText
                style={{
                  fontWeight: `${!submissionSelected ? '500' : '400'}`,
                }}
              >
                Discussion
              </TaskTabText>
            </TaskSubmissionTab>
          </TaskSectionFooterTitleDiv>
          <TaskSectionContent>
            {submissionSelected && (
              <TaskSubmissionContent
                taskId={fetchedTask?.id}
                taskSubmissionLoading={taskSubmissionLoading}
                canSubmit={canSubmit}
                fetchedTask={fetchedTask}
                updateTaskStatus={updateTaskStatus}
                fetchedTaskSubmissions={fetchedTaskSubmissions}
                orgBoard={orgBoard}
                canMoveProgress={canMoveProgress}
                assigneeUsername={fetchedTask?.assigneeUsername}
                assigneeProfilePicture={fetchedTask?.profilePicture}
                makeSubmission={makeSubmission}
                setMakeSubmission={setMakeSubmission}
                orgId={fetchedTask?.orgId}
                setFetchedTaskSubmissions={setFetchedTaskSubmissions}
              />
            )}
          </TaskSectionContent>
        </TaskModalFooter>
      </TaskModal>
    </Modal>
  )
}
