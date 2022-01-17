import React, { useState } from 'react'
import { LogoButton } from '../logo'
import { AvatarList } from '../AvatarList'
import { Compensation } from '../Compensation'
import { delQuery } from '../../../utils'

import {
  TaskHeader,
  TaskContent,
  TaskTitle,
  TaskFooter,
  TaskStatusHeaderText,
  PodWrapper,
  PodName,
  TaskAction,
  TaskActionAmount,
} from '../Task/styles'

import { TASK_ICONS } from '../Task/index'

import {
  TaskSummaryWrapper,
  TaskSummaryMedia,
  TaskSummaryInner,
  TaskSummaryAction,
  OrgProfilePicture,
} from './styles'
import { Arrow, Media } from '../../Icons/sections'
import { useOrgBoard, usePodBoard, useUserBoard } from '../../../utils/hooks'
import { useRouter } from 'next/router'
import { TaskViewModal } from '../Task/modal'
import {
  PERMISSIONS,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
} from '../../../utils/constants'
import { parseUserPermissionContext } from '../../../utils/helpers'
import {
  CreateFormButtonsBlock,
  CreateFormFooterButtons,
  CreateFormPreviewButton,
} from '../../CreateEntity/styles'
import { useMutation } from '@apollo/client'
import {
  APPROVE_TASK_PROPOSAL,
  REQUEST_CHANGE_TASK_PROPOSAL,
} from '../../../graphql/mutations/taskProposal'
import {
  APPROVE_SUBMISSION,
  REQUEST_CHANGE_SUBMISSION,
} from '../../../graphql/mutations/taskSubmission'
import { RejectIcon } from '../../Icons/taskModalIcons'
import { CompletedIcon } from '../../Icons/statusIcons'
import {
  addTaskItem,
  removeProposalItem,
  updateProposalItem,
  updateSubmissionItem,
} from '../../../utils/board'
import { TaskCommentIcon } from '../../Icons/taskComment'

let windowOffset

export const TaskSummary = ({ task, setTask, action, taskType }) => {
  const {
    compensation = {},
    description = '',
    id,
    media,
    status,
    title = '',
    users = [],
  } = task

  let TaskIcon = TASK_ICONS[status]
  const [modalOpen, setModalOpen] = useState(false)
  const [approveTaskProposal] = useMutation(APPROVE_TASK_PROPOSAL)
  const [requestChangeTaskProposal] = useMutation(REQUEST_CHANGE_TASK_PROPOSAL)
  const [approveTaskSubmission] = useMutation(APPROVE_SUBMISSION)
  const [requestChangeTaskSubmission] = useMutation(REQUEST_CHANGE_SUBMISSION)

  const router = useRouter()
  const goToPod = (podId) => {
    // router query into pod
    const { username } = router.query
    router.push(`/organization/${username}/pod/${podId}`)
  }
  const openModal = () => {
    if (taskType === TASK_STATUS_REQUESTED) {
      router.replace(`${delQuery(router.asPath)}?taskProposal=${task?.id}`)
    } else if (taskType === TASK_STATUS_IN_REVIEW) {
      router.replace(`${delQuery(router.asPath)}?task=${task?.taskId}`)
    } else if (taskType === TASK_STATUS_ARCHIVED) {
      router.replace(`${delQuery(router.asPath)}?task=${task?.id}`)
    }

    // document.body.style.overflow = 'hidden'
    // document.body.scroll = false
    windowOffset = window.scrollY
    document.body.setAttribute(
      'style',
      `position: fixed; top: -${windowOffset}px; left:0; right:0`
    )
    setModalOpen(true)
  }

  const iconStyle = {
    width: '20px',
    height: '20px',
    marginRight: '8px',
  }

  const flexDivStyle = {
    display: 'flex',
    alignItems: 'center',
  }

  const orgBoard = useOrgBoard()
  const podBoard = usePodBoard()
  const userBoard = useUserBoard()

  const userPermissionsContext =
    orgBoard?.userPermissionsContext ||
    podBoard?.userPermissionsContext ||
    userBoard?.userPermissionsContext
  const board = orgBoard || podBoard || userBoard
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: task?.orgId,
    podId: task?.podId,
  })
  let canApprove = false
  let approve = null
  let requestChange = null
  if (taskType === TASK_STATUS_REQUESTED) {
    canApprove =
      permissions.includes(PERMISSIONS.FULL_ACCESS) ||
      permissions.includes(PERMISSIONS.CREATE_TASK)
    approve = () =>
      approveTaskProposal({
        variables: {
          proposalId: task?.id,
        },
        onCompleted: () => {
          let columns = [...board?.columns]
          // Move from proposal to task
          columns = removeProposalItem(task?.id, columns)
          columns = addTaskItem(task, columns)
          board?.setColumns(columns)
        },
      })
    requestChange = () =>
      requestChangeTaskProposal({
        variables: {
          proposalId: task?.id,
        },
        onCompleted: () => {
          let columns = [...board?.columns]
          columns = updateProposalItem(
            {
              ...task,
              changeRequestedAt: new Date(),
            },
            columns
          )
          board?.setColumns(columns)
        },
      })
  } else if (taskType === TASK_STATUS_IN_REVIEW) {
    canApprove =
      permissions.includes(PERMISSIONS.FULL_ACCESS) ||
      permissions.includes(PERMISSIONS.REVIEW_TASK)
    approve = () =>
      approveTaskSubmission({
        variables: {
          proposalId: task?.id,
        },
        onCompleted: () => {
          let columns = [...board?.columns]
          // Move from proposal to task
          columns = updateSubmissionItem(
            {
              ...task,
              approvedAt: new Date(),
            },
            columns
          )
          board?.setColumns(columns)
        },
      })
    requestChange = () =>
      requestChangeTaskSubmission({
        variables: {
          proposalId: task?.id,
        },
        onCompleted: () => {
          let columns = [...board?.columns]
          // Move from proposal to task
          columns = updateSubmissionItem(
            {
              ...task,
              changeRequestedAt: new Date(),
            },
            columns
          )
          board?.setColumns(columns)
        },
      })
  }

  return (
    <>
      <TaskViewModal
        open={modalOpen}
        handleOpen={() => setModalOpen(true)}
        handleClose={() => {
          document.body.setAttribute('style', '')
          window?.scrollTo(0, windowOffset)
          setModalOpen(false)
        }}
        task={
          taskType === TASK_STATUS_REQUESTED ||
          taskType === TASK_STATUS_ARCHIVED
            ? task
            : null
        }
        taskId={taskType === TASK_STATUS_IN_REVIEW ? task?.taskId : task?.id}
        isTaskProposal={taskType === TASK_STATUS_REQUESTED}
      />
      <TaskSummaryWrapper key={id} onClick={openModal}>
        <TaskSummaryInner>
          <TaskHeader>
            <OrgProfilePicture src={task?.orgProfilePicture} />
            {task?.podName && (
              <PodWrapper
                style={{
                  marginRight: '8px',
                }}
                onclick={() => {
                  goToPod(task?.podId)
                }}
              >
                <PodName>{task?.podName.slice(0, 15)}</PodName>
              </PodWrapper>
            )}
            <AvatarList
              id={id}
              users={[
                {
                  id: task?.createdBy,
                  name: task?.creatorUsername,
                  initials:
                    task?.creatorUsername &&
                    task?.creatorUsername[0].toUpperCase(),
                  avatar: {
                    url: task?.creatorProfilePicture,
                    isOwnerOfPod: false,
                    color: null,
                  },
                },
              ]}
            />
            <Compensation compensation={compensation} icon={TaskIcon} />
          </TaskHeader>

          <TaskContent>
            <TaskTitle>{title}</TaskTitle>
            <p>{description}</p>
          </TaskContent>
          <TaskFooter>
            {media?.length > 0 ? (
              <TaskSummaryMedia>
                <Media media={media[0]} />
              </TaskSummaryMedia>
            ) : (
              ''
            )}
            {
              <TaskAction key={'task-comment-' + id}>
                <TaskCommentIcon />
                <TaskActionAmount>{task?.commentCount || 0}</TaskActionAmount>
              </TaskAction>
            }
            {task?.approvedAt && (
              <div style={flexDivStyle}>
                <CompletedIcon style={iconStyle} />
                <TaskStatusHeaderText>Approved</TaskStatusHeaderText>
              </div>
            )}
            {task?.changeRequestedAt && (
              <div style={flexDivStyle} onClick={requestChange}>
                <RejectIcon
                  style={{
                    width: '16px',
                    height: '16px',
                    marginRight: '8px',
                  }}
                />
                <TaskStatusHeaderText>Changes requested</TaskStatusHeaderText>
              </div>
            )}
            {canApprove && !task?.approvedAt && !task?.changeRequestedAt && (
              <CreateFormButtonsBlock>
                <CreateFormPreviewButton>
                  {taskType === TASK_STATUS_IN_REVIEW
                    ? 'Request changes'
                    : 'Deny'}
                </CreateFormPreviewButton>
                <CreateFormPreviewButton onClick={approve}>
                  Approve
                </CreateFormPreviewButton>
              </CreateFormButtonsBlock>
            )}
            {action && !canApprove ? (
              <TaskSummaryAction>
                {action.text}
                &nbsp;
                <Arrow />
              </TaskSummaryAction>
            ) : (
              ''
            )}
          </TaskFooter>
        </TaskSummaryInner>
      </TaskSummaryWrapper>
    </>
  )
}
