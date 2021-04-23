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
  query getTasksFromGoal($goalId: ID!, $status: string) {
    getTasksFromGoal(goalId: $goalId, status: $status) {
      ...PublicTask
    }
  }
  ${PublicTaskFragment}
`

export const GET_TASKS_FROM_PROJECT = gql`
  query GetTasksFromProject($projectId: ID!, $limit: Int, $offset: Int, $status: String) {
    getTasksFromProject(projectId: $projectId, limit: $limit, offset: $offset, status: $status) {
      ...PublicTask
    }
  }
  ${PublicTaskFragment}
`

export const GET_TASKS_FROM_USER = gql`
  query GetTasksFromUser($limit: Int, $offset: Int, $status: String) {
    getTasksFromUser(limit: $limit, offset: $offset, status: $status) {
      ...PublicTask
    }
  }
  ${PublicTaskFragment}
`
