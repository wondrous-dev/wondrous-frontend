import { gql } from '@apollo/client';
import { QuestFragment } from 'graphql/fragments/quest';

export const CREATE_QUEST = gql`
  mutation createQuest($input: QuestInput) {
    createQuest(input: $input) {
      ...QuestFragment
    }
  }
  ${QuestFragment}
`;

export const UPDATE_QUEST_LABEL = gql`
  mutation updateOrgQuestLevel($orgId: ID!, $level: String!, $name: String!) {
    updateOrgQuestLevel(orgId: $orgId, level: $level, name: $name) {
      success
    }
  }
`;

export const ADD_ORG_LEVEL_REWARD = gql`
  mutation addOrgLevelReward($input: AddOrgLevelInput) {
    addOrgLevelReward(input: $input) {
      success
    }
  }
`;