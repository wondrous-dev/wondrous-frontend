import { gql } from '@apollo/client'

import { PublicAskFragment } from '../fragments/ask'

export const GET_ASKS_FROM_PROJECT = gql`
  query GetAsksFromProject($projectId: ID!, $status: String, $limit: Int, $offset: Int) {
    getAsksFromProject(projectId: $projectId, status: $status) {
      ...PublicAsk
    }
  }
  ${PublicAskFragment}
`

export const GET_ASKS_FROM_USER = gql`
  query GetAsksFromUser($userId: ID!, $status: String, $limit: Int, $offset: Int) {
    getAsksFromUser(userId: $userId, status: $status, limit: $limit, offset: $offset) {
      ...PublicAsk
    }
  }
  ${PublicAskFragment}
`

export const GET_ASKS_FROM_GOAL = gql`
  query GetAsksFromGoal($goalId: ID!, $status: String) {
    getAsksFromGoal(goalId: $goalId, status: $status) {
      ...PublicAsk
    }
  }
  ${PublicAskFragment}
`

export const GET_ASKS_FROM_TASK = gql`
  query getAsksFromTask($taskId: ID!, $status: String) {
    getAsksFromTask(taskId: $taskId, status: $status) {
      ...PublicAsk
    }
  }
  ${PublicAskFragment}
`

export const GET_ASK_BY_ID = gql`
  query GetAskById($askId: ID!) {
    getAskById(askId: $askId) {
      ...PublicAsk
    }
  }
  ${PublicAskFragment}
`