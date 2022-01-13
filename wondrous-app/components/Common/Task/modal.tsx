import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { PodNameTypography, TaskModal, TaskModalHeader } from './styles'
import { useLazyQuery } from '@apollo/client'
import { GET_TASK_BY_ID } from '../../../graphql/queries/task'
import { SafeImage } from '../Image'
import {
  transformTaskProposalToTaskProposalCard,
  transformTaskToTaskCard,
} from '../../../utils/helpers'
import { RightCaret } from '../Image/RightCaret'
import CreatePodIcon from '../../Icons/createPod'

export const TaskViewModal = (props) => {
  const { open, handleOpen, handleClose, task, taskId } = props
  const [fetchedTask, setFetchedTask] = useState(task)

  const [getTaskById] = useLazyQuery(GET_TASK_BY_ID, {
    onCompleted: (data) => {
      const taskData = data?.getTaskById
      if (taskData) {
        setFetchedTask(
          transformTaskProposalToTaskProposalCard(taskData, {
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
    }
  }, [taskId, task, getTaskById])

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
              <PodNameTypography>hello</PodNameTypography>
            </div>
          )}
        </TaskModalHeader>
      </TaskModal>
    </Modal>
  )
}
