import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useInView } from 'react-intersection-observer'
import { useOrgBoard, usePodBoard, useUserBoard } from '../../../utils/hooks'
import { TaskViewModal } from '../Task/modal'
import { KanbanBoardContainer, LoadMore } from './styles'
import TaskColumn from './TaskColumn'
import { useDndProvider } from './DragAndDrop'

// Task update (column changes)
import apollo from '../../../services/apollo'
import { UPDATE_TASK_STATUS } from '../../../graphql/mutations/task'
import { parseUserPermissionContext } from '../../../utils/helpers'
import { PERMISSIONS } from '../../../utils/constants'
import { useMe } from '../../Auth/withAuth'
import { update } from 'lodash'

const KanbanBoard = (props) => {
  const user = useMe()
  const { columns, onLoadMore, hasMore } = props
  const [columnsState, setColumnsState] = useState(columns)
  const [ref, inView] = useInView({})
  const [openModal, setOpenModal] = useState(false)
  const [once, setOnce] = useState(false)
  const router = useRouter()

  // Permissions for Draggable context
  const orgBoard = useOrgBoard()
  const userBoard = useUserBoard()
  const podBoard = usePodBoard()
  const userPermissionsContext =
    orgBoard?.userPermissionsContext ||
    podBoard?.userPermissionsContext ||
    userBoard?.userPermissionsContext

  useEffect(() => {
    if (inView && hasMore) {
      onLoadMore()
    }
  }, [inView, hasMore, onLoadMore])

  const checkPermissions = (task) => {
    const permissions = parseUserPermissionContext({
      userPermissionsContext,
      orgId: task?.orgId,
      podId: task?.podId,
    })
    const canEdit =
      permissions.includes(PERMISSIONS.MANAGE_BOARD) ||
      permissions.includes(PERMISSIONS.FULL_ACCESS) ||
      task?.createdBy === user?.id ||
      (task?.assigneeId && task?.assigneeId === user?.id)

    return canEdit && user && task
  }

  // Updates the task status on Backend
  // TODO: Aggregate all Task mutations on one Task
  //       service.
  const updateTask = async (taskToBeUpdated) => {
    try {
      const {
        data: { updateTask: task },
      } = await apollo.mutate({
        mutation: UPDATE_TASK_STATUS,
        variables: {
          taskId: taskToBeUpdated.id,
          input: {
            newStatus: taskToBeUpdated.status,
          },
        },
      })

      return true
    } catch (err) {
      console.log('Error: ', err)
    }
  }

  const moveCard = async (id, status) => {
    const updatedColumns = columnsState.map((column) => {
      if (column.status !== status) {
        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== id),
        }
      }
      const task = columnsState
        .map(({ tasks }) => tasks.find((task) => task.id === id))
        .filter((i) => i)[0]

      // Only allow when permissions are OK
      const updatedTask = checkPermissions(task) ? { ...task, status } : task

      if (updatedTask.status !== task.status) {
        updateTask(updatedTask)
      }

      return {
        ...column,
        tasks: [updatedTask, ...column.tasks],
      }
    })
    setColumnsState(updatedColumns)
  }
  const hasQuery = (router?.query?.task, router?.query?.taskProposal)
  useEffect(() => {
    if (hasQuery && !once && (orgBoard || userBoard || podBoard)) {
      setOpenModal(true)
      setOnce(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasQuery, orgBoard || userBoard || podBoard])
  const { dndArea, handleRef, html5Options } = useDndProvider()
  return (
    <>
      <KanbanBoardContainer ref={handleRef}>
        <TaskViewModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          taskId={router?.query?.task || router?.query?.taskProposal}
          isTaskProposal={!!router?.query?.taskProposal}
        />
        {dndArea && (
          <DndProvider backend={HTML5Backend} options={html5Options}>
            {columnsState.map((column) => {
              const { status, section, tasks } = column
              return (
                <TaskColumn
                  key={status}
                  cardsList={tasks}
                  moveCard={moveCard}
                  status={status}
                  section={section}
                />
              )
            })}
          </DndProvider>
        )}
      </KanbanBoardContainer>
      <LoadMore ref={ref} hasMore={hasMore}></LoadMore>
    </>
  )
}

export default KanbanBoard
