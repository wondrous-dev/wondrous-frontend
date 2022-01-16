import { gql } from '@apollo/client'
import { TaskSubmissionFragment } from '../fragments/task'

export const CREATE_TASK_SUBMISSION = gql`
  mutation createTaskSubmission($input: TaskSubmissionInput) {
    createTaskSubmission(input: $input) {
      ...TaskSubmissionFragment
    }
  }
  ${TaskSubmissionFragment}
`
