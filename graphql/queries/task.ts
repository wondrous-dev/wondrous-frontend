import { gql } from '@apollo/client'

import { PublicTaskFragment } from '../fragments/task'

export const GET_TASK_BY_ID = gql`
  query GetTaskById($taskId: ID!) {
    getTaskById(taskId: $taskId) {
      ...PublicTask
    }
  }
  ${PublicTaskFragment}
`

export const GET_TASKS_FROM_GOAL = gql`
  query getTasksFromGoal($goalId: ID!) {
    getTasksFromGoal(goalId: $goalId) {
      ...PublicTask
    }
  }
  ${PublicTaskFragment}
`

export const GET_TASKS_FROM_PROJECT = gql`
  query GetTasksFromProject($projectId: ID!) {
    getTasksFromProject(projectId: $projectId) {
      ...PublicTask
    }
  }
  ${PublicTaskFragment}
`

export const GET_TASKS_FROM_USER = gql`
  query GetTasksFromUser {
    getTasksFromUser {
      ...PublicTask
    }
  }
  ${PublicTaskFragment}
`
