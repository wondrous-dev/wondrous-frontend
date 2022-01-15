import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import { format } from 'date-fns'
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
} from './styles'
import { useLazyQuery, useQuery } from '@apollo/client'
import {
  GET_TASK_BY_ID,
  GET_TASK_REVIEWERS,
} from '../../../graphql/queries/task'
import { SafeImage } from '../Image'
import {
  parseUserPermissionContext,
  transformTaskProposalToTaskProposalCard,
  transformTaskToTaskCard,
} from '../../../utils/helpers'
import { RightCaret } from '../Image/RightCaret'
import CreatePodIcon from '../../Icons/createPod'
import { useOrgBoard, usePodBoard, useUserBoard } from '../../../utils/hooks'
import { ENTITIES_TYPES, PERMISSIONS } from '../../../utils/constants'
import { DropDown, DropDownItem } from '../dropdown'
import { TaskMenuIcon } from '../../Icons/taskMenu'
import { White } from '../../../theme/colors'
import { useMe } from '../../Auth/withAuth'
import { GetStatusIcon, renderMentionString } from '../../../utils/common'
import { AssigneeIcon, ReviewerIcon } from '../../Icons/taskModalIcons'
import { DefaultUserImage } from '../Image/DefaultImages'
import EditLayoutBaseModal from '../../CreateEntity/editEntityModal'
import { CreateModalOverlay } from '../../CreateEntity/styles'
import { useRouter } from 'next/router'

export const TaskViewModal = (props) => {
  const { open, handleOpen, handleClose, task, taskId } = props
  const [fetchedTask, setFetchedTask] = useState(null)
  const orgBoard = useOrgBoard()

  const userBoard = useUserBoard()
  const podBoard = usePodBoard()
  const router = useRouter()
  const [canEdit, setCanEdit] = useState(false)
  const [editTask, setEditTask] = useState(false)
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
        permissions.includes(PERMISSIONS.MANAGE_BOARD) ||
        permissions.includes(PERMISSIONS.FULL_ACCESS) ||
        fetchedTask?.createdBy === user?.id ||
        (fetchedTask?.assigneeId && fetchedTask?.assigneeId === user?.id)
      setCanEdit(canEdit)
      getReviewers({
        variables: {
          taskId: fetchedTask?.id,
        },
      })
    }
  }, [
    taskId,
    task,
    getTaskById,
    fetchedTask,
    userPermissionsContext,
    user?.id,
    getReviewers,
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
      </TaskModal>
    </Modal>
  )
}
