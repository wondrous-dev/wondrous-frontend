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
