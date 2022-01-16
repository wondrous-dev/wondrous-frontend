import { gql } from '@apollo/client'
import { TaskFragment } from '../fragments/task'

export const CREATE_TASK = gql`
  mutation createTask($input: TaskInput) {
    createTask(input: $input) {
      ...TaskFragment
    }
  }
  ${TaskFragment}
`

export const UPDATE_TASK = gql`
  mutation updateTask($taskId: ID!, $input: TaskInput) {
    updateTask(taskId: $taskId, input: $input) {
      ...TaskFragment
    }
  }
  ${TaskFragment}
`

export const DELETE_TASK = gql`
  mutation deleteTask($taskId: String!) {
    deleteTask(taskId: $taskId) {
      success
    }
  }
`

export const ATTACH_MEDIA_TO_TASK = gql`
  mutation attachTaskMedia($taskId: ID!, $input: AttachMediaInput) {
    attachTaskMedia(taskId: $taskId, input: $input) {
      success
    }
  }
`

export const REMOVE_MEDIA_FROM_TASK = gql`
  mutation removeTaskMedia($taskId: ID!, $slug: String!) {
    removeTaskMedia(taskId: $taskId, slug: $slug) {
      success
    }
  }
`

export const UPDATE_TASK_STATUS = gql`
  mutation updateTaskStatus($taskId: ID!, $input: updateTaskStatusInput!) {
    updateTaskStatus(taskId: $taskId, input: $input) {
      ...TaskFragment
    }
  }
  ${TaskFragment}
`
