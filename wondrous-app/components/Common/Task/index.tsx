import React, { useEffect, useState } from 'react'
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
import { TaskViewModal } from './modal'
import { useMe } from '../../Auth/withAuth'
import { delQuery } from '../../../utils'

export const TASK_ICONS = {
  [Constants.TASK_STATUS_TODO]: ToDo,
  [Constants.TASK_STATUS_IN_PROGRESS]: InProgress,
  [Constants.TASK_STATUS_DONE]: Done,
  [Constants.TASK_STATUS_IN_REVIEW]: InReview,
}

let windowOffset = 0
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
  const user = useMe()
  const userPermissionsContext =
    orgBoard?.userPermissionsContext ||
    podBoard?.userPermissionsContext ||
    userBoard?.userPermissionsContext
  const [liked, setLiked] = useState(iLiked)
  const [modalOpen, setModalOpen] = useState(false)

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

  const canArchive =
    permissions.includes(Constants.PERMISSIONS.MANAGE_BOARD) ||
    permissions.includes(Constants.PERMISSIONS.FULL_ACCESS) ||
    task?.createdBy === user?.id

  const openModal = () => {
    router.replace(`${delQuery(router.asPath)}?task=${task?.id}`)
    document.body.style.overflow = 'hidden'
    // document.body.scroll = false
    windowOffset = window.scrollY
    document.body.setAttribute(
      'style',
      `position: fixed; top: -${windowOffset}px; left:0; right:0`
    )
    setModalOpen(true)
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
        task={task}
      />
      <TaskWrapper key={id} wrapped={milestone} onClick={openModal}>
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
                <PodName>{task?.podName}</PodName>
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
            {media?.length > 0 ? (
              <TaskMedia media={media[0]} />
            ) : (
              <TaskSeparator />
            )}
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
            {canArchive && (
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
    </>
  )
}
