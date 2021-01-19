import { gql } from '@apollo/client'

import { PublicTaskFragment } from '../fragments/task'

export const GET_TASKS_FROM_PROJECT = gql`
  query GetTasksFromProject($projectId: ID!) {
    getTasksFromProject(projectId: $projectId) {
      ...PublicTask
    }
  }
  ${PublicTaskFragment}
`
