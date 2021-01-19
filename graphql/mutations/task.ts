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
