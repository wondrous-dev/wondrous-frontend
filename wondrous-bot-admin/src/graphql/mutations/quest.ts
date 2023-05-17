import { gql } from "@apollo/client";
import { QuestFragment } from "graphql/fragments/quest";

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
  mutation addOrgLevelReward($input: AddOrgLevelRewardInput) {
    addOrgLevelReward(input: $input) {
      success
    }
  }
`;

export const REMOVE_ORG_LEVEL_REWARD = gql`
  mutation removeOrgLevelReward($levelRewardId: ID!) {
    removeOrgLevelReward(levelRewardId: $levelRewardId) {
      success
    }
  }
`;

export const UPDATE_QUEST = gql`
  mutation updateQuest($questId: ID!, $input: QuestInput) {
    updateQuest(questId: $questId, input: $input) {
      ...QuestFragment
    }
  }
  ${QuestFragment}
`;

export const APPROVE_SUBMISSION = gql`
  mutation approveQuestSubmission($questSubmissionId: ID!) {
    approveQuestSubmission(questSubmissionId: $questSubmissionId) {
      id
    }
  }
`;

export const REJECT_SUBMISSION = gql`
  mutation rejectQuestSubmission($questSubmissionId: ID!) {
    rejectQuestSubmission(questSubmissionId: $questSubmissionId) {
      id
    }
  }
`;

export const DELETE_QUEST = gql`
  mutation deleteQuest($questId: ID!) {
    deleteQuest(questId: $questId) {
      success
    }
  }

`;
