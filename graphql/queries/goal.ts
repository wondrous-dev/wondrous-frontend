import { gql } from '@apollo/client'

import { PublicGoalFragment } from '../fragments/goal'

export const GET_GOAL_BY_ID = gql`
  query GetGoalById($goalId: ID!) {
    getGoalById(goalId: $goalId) {
      ...PublicGoal
    }
  }
  ${PublicGoalFragment}
`

export const GET_GOALS_FROM_PROJECT = gql`
  query GetGoalsFromProject($projectId: ID!) {
    getGoalsFromProject(projectId: $projectId) {
      ...PublicGoal
    }
  }
  ${PublicGoalFragment}
`

export const GET_GOALS_FROM_USER = gql`
  query GetGoalsFromUser {
    getGoalsFromUser {
      ...PublicGoal
    }
  }
  ${PublicGoalFragment}
`
