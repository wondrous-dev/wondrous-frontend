import { gql } from '@apollo/client'

import { PublicGoalFragment, AdditionalGoalFragment } from '../fragments/goal'

// Turns out I need additional goal for all these, but there may be future queries which doesn't need to fetch everything
export const GET_GOAL_BY_ID = gql`
  query GetGoalById($goalId: ID!) {
    getGoalById(goalId: $goalId) {
      ...AdditionalGoal
    }
  }
  ${AdditionalGoalFragment}
`

export const GET_GOALS_FROM_PROJECT = gql`
  query GetGoalsFromProject($projectId: ID!) {
    getGoalsFromProject(projectId: $projectId) {
      ...AdditionalGoal
    }
  }
  ${AdditionalGoalFragment}
`

export const GET_GOALS_FROM_USER = gql`
  query GetGoalsFromUser {
    getGoalsFromUser {
      ...AdditionalGoal
    }
  }
  ${AdditionalGoalFragment}
`
