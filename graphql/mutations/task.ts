import { gql } from '@apollo/client'

import { PublicTaskFragment } from '../fragments/task'

export const CREATE_TASK = gql`
  mutation CreateTask($input: TaskInput) {
    createTask(input: $input) {
      ...PublicTask
    }
  }
  ${PublicTaskFragment}
`

export const UPDATE_TASK = gql`
  mutation UpdateTask($taskId: ID!, $input: TaskInput) {
    updateTask(taskId: $taskId, input: $input) {
      ...PublicTask
    }
  }
  ${PublicTaskFragment}
`

export const DELETE_TASK = gql`
  mutation DeleteTask($taskId: ID!) {
    success
  }
`
