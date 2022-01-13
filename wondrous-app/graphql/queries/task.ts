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
