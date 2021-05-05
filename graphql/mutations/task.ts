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
    deleteTask(taskId: $taskId) {
      success
    }
  }
`

export const COMPLETE_TASK = gql`
  mutation CompleteTask($taskId: ID!) {
    completeTask(taskId: $taskId) {
      ...PublicTask
    }
  }
  ${PublicTaskFragment}
`

export const NUDGE_TASK = gql`
  mutation NudgeTask($taskId: String!) {
    nudgeTask(taskId: $taskId) {
      success
    }
  }
`