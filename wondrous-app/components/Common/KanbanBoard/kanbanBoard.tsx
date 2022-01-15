import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useInView } from 'react-intersection-observer'
import { TaskViewModal } from '../Task/modal'
import { KanbanBoardContainer, LoadMore } from './styles'
import TaskColumn from './TaskColumn'

// Task update (column changes)
import apollo from '../../../services/apollo'
import { UPDATE_TASK_STATUS } from '../../../graphql/mutations/task'


const KanbanBoard = (props) => {
  const { columns, onLoadMore, hasMore } = props
  const [columnsState, setColumnsState] = useState(columns)
  const [ref, inView] = useInView({})
  const [openModal, setOpenModal] = useState(false)
  const [once, setOnce] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (inView && hasMore) {
      onLoadMore()
    }
  }, [inView, hasMore, onLoadMore])

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
            newStatus: taskToBeUpdated.status
          }
        },
      })

      return true
    } catch(err) {
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
      const updatedTask = { ...task, status }
      
      // Update task
      updateTask(updatedTask)
      
      return {
        ...column,
        tasks: [updatedTask, ...column.tasks],
      }
    })
    setColumnsState(updatedColumns)
  }

  useEffect(() => {
    if (router?.query?.task && !once) {
      setOpenModal(true)
      setOnce(true)
    }
  }, [router?.query?.task])

  return (
    <>
      <KanbanBoardContainer>
        <TaskViewModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          taskId={router?.query?.task}
        />
        <DndProvider backend={HTML5Backend}>
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
      </KanbanBoardContainer>
      <LoadMore ref={ref} hasMore={hasMore}></LoadMore>
    </>
  )
}

export default KanbanBoard
