import React, { useState } from 'react'
import { LogoButton } from '../logo'
import { ToDo, InProgress, Done, InReview } from '../../Icons'
import { TaskLikeIcon } from '../../Icons/taskLike'
import { TaskCommentIcon } from '../../Icons/taskComment'
import { TaskShareIcon } from '../../Icons/taskShare'
import { TaskMenuIcon } from '../../Icons/taskMenu'

import { AvatarList, SmallAvatar } from '../AvatarList'
import { Compensation } from '../Compensation'
import { TaskMedia } from '../MediaPlayer'
import { DropDown, DropDownItem } from '../dropdown'

import * as Constants from '../../../utils/constants'

import {
  TaskWrapper,
  TaskInner,
  TaskHeader,
  TaskContent,
  TaskTitle,
  TaskSeparator,
  TaskFooter,
  TaskAction,
  TaskActionAmount,
  TaskActionMenu,
  PodWrapper,
  PodName,
} from './styles'
import { renderMentionString } from '../../../utils/common'
import { useRouter } from 'next/router'
import { Typography } from '@material-ui/core'
import { SafeImage } from '../Image'
import { parseUserPermissionContext } from '../../../utils/helpers'
import { useOrgBoard, usePodBoard, useUserBoard } from '../../../utils/hooks'
import { White } from '../../../theme/colors'

export const TASK_ICONS = {
  [Constants.TASK_STATUS_TODO]: ToDo,
  [Constants.TASK_STATUS_IN_PROGRESS]: InProgress,
  [Constants.TASK_STATUS_DONE]: Done,
  [Constants.TASK_STATUS_IN_REVIEW]: InReview,
}

export const Task = ({ task, setTask }) => {
  const {
    actions = {},
    description = '',
    compensation = {},
    id,
    media,
    status,
    milestone = false,
    title = '',
    users = [],
  } = task
  const router = useRouter()
  let {
    likes = 0,
    comments = 0,
    shares = 0,
    iLiked = false,
    iCommented = false,
    iShared = false,
  } = actions || {}
  // Need to understand context
  const orgBoard = useOrgBoard()
  const userBoard = useUserBoard()
  const podBoard = usePodBoard()
  const userPermissionsContext =
    orgBoard?.userPermissionsContext ||
    podBoard?.userPermissionsContext ||
    userBoard?.userPermissionsContext
  const [liked, setLiked] = useState(iLiked)

  let TaskIcon = TASK_ICONS[status]

  const archiveTask = () => {
    // TODO: open modal asking for confirmation
    console.log('Edit Task Menu Clicked')
  }

  const toggleLike = () => {
    setLiked(!liked)

    likes = liked ? likes - 1 : likes + 1

    setTask({
      ...task,
      actions: {
        ...actions,
        likes,
      },
    })
  }
  // Parse permissions here as well
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: task?.orgId,
    podId: task?.podId,
  })

  const canEdit =
    permissions.includes(Constants.PERMISSIONS.MANAGE_BOARD) ||
    permissions.includes(Constants.PERMISSIONS.FULL_ACCESS)

  return (
    <TaskWrapper key={id} wrapped={milestone}>
      <TaskInner>
        <TaskHeader>
          <SafeImage
            src={task?.orgProfilePicture || 'seed/wonder_logo.jpg'}
            style={{
              width: '29px',
              height: '28px',
              borderRadius: '4px',
            }}
          />
          {task?.podName && (
            <PodWrapper>
              <PodName>{task?.podNAme}</PodName>
            </PodWrapper>
          )}
          {task?.assigneeUsername && (
            <>
              {task?.assigneeProfilePicture ? (
                <SafeImage
                  style={{
                    width: '29px',
                    height: '29px',
                    borderRadius: '20px',
                    marginLeft: '12px',
                  }}
                  src={task?.assigneeProfilePicture}
                />
              ) : (
                <SmallAvatar
                  style={{ marginLeft: '12px' }}
                  initals={task?.assigneeUsername[0]}
                />
              )}
            </>
          )}

          <Compensation compensation={compensation} icon={TaskIcon} />
        </TaskHeader>
        <TaskContent>
          <TaskTitle>{title}</TaskTitle>
          <p>
            {renderMentionString({
              content: description,
              router,
            })}
          </p>
          {media ? <TaskMedia media={media} /> : <TaskSeparator />}
        </TaskContent>
        <TaskFooter>
          {/* <TaskAction key={'task-like-' + id} onClick={toggleLike}>
						<TaskLikeIcon liked={liked} />
						<TaskActionAmount>{likes}</TaskActionAmount>
					</TaskAction> */}
          <TaskAction key={'task-comment-' + id}>
            <TaskCommentIcon />
            <TaskActionAmount>{comments}</TaskActionAmount>
          </TaskAction>
          <TaskAction key={'task-share-' + id}>
            <TaskShareIcon />
            <TaskActionAmount>{shares}</TaskActionAmount>
          </TaskAction>
          <TaskActionMenu right="true">
            <DropDown DropdownHandler={TaskMenuIcon}>
              <DropDownItem
                key={'task-menu-edit-' + id}
                onClick={archiveTask}
                style={{
                  color: White,
                }}
              >
                Archive Task
              </DropDownItem>
              {/* <DropDownItem key={'task-menu-report-' + id} onClick={reportTask}>
                Report
              </DropDownItem> */}
              {/* <DropDownItem
                key={'task-menu-settings-' + id}
                onClick={openSettings}
              >
                Settings
              </DropDownItem> */}
            </DropDown>
          </TaskActionMenu>
          {canEdit && (
            <TaskActionMenu right="true">
              <DropDown DropdownHandler={TaskMenuIcon}>
                <DropDownItem
                  key={'task-menu-edit-' + id}
                  onClick={archiveTask}
                  style={{
                    color: White,
                  }}
                >
                  Archive Task
                </DropDownItem>
                {/* <DropDownItem key={'task-menu-report-' + id} onClick={reportTask}>
							Report
						</DropDownItem> */}
                {/* <DropDownItem
							key={'task-menu-settings-' + id}
							onClick={openSettings}
						>
							Settings
						</DropDownItem> */}
              </DropDown>
            </TaskActionMenu>
          )}
        </TaskFooter>
      </TaskInner>
    </TaskWrapper>
  )
}
