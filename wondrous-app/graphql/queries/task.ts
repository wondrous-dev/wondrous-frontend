import { gql } from '@apollo/client'
import { TaskFragment } from '../fragments/task'

export const GET_TASK_BY_ID = gql`
  query getTaskById($taskId: ID!) {
    getTaskById(taskId: $taskId) {
      ...TaskFragment
    }
  }
  ${TaskFragment}
`

export const GET_TASK_REVIEWERS = gql`
  query getTaskReviewers($taskId: ID!) {
    getTaskReviewers(taskId: $taskId) {
      id
      profilePicture
      firstName
      lastName
      username
    }
  }
`
