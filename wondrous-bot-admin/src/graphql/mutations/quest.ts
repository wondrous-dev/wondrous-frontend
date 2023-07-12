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

export const ACTIVATE_QUEST = gql`
  mutation activateQuest($questId: ID!) {
    activateQuest(questId: $questId) {
      success
    }
  }
`;

export const DEACTIVATE_QUEST = gql`
  mutation deactivateQuest($questId: ID!) {
    deactivateQuest(questId: $questId) {
      success
    }
  }
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

export const ATTACH_QUEST_STEPS_MEDIA = gql`
  mutation attachQuestStepsMedia($questId: ID!, $stepsData: [StepsMediaInput]) {
    attachQuestStepsMedia(questId: $questId, stepsData: $stepsData) 
  }
`;

export const START_QUEST = gql`
  mutation startQuest($questId: ID!) {
    startQuest(questId: $questId) {
      channelLink
      error
    }
  }
`;

export const CONNECT_CMTY_USER = gql`
  mutation connectCmtyUser($code: String!, $questId: ID!) {
    connectCmtyUser(code: $code, questId: $questId) {
      token
    }
  }
`;

export const START_PREVIEW_QUEST = gql`
  mutation startPreviewQuest($questId: ID!) {
    startPreviewQuest(questId: $questId) {
      channelId
      guildId
    }
  }
`;

export const VERIFY_LINK_CLICK = gql`
  mutation verifyLinkClick($questStepId: ID!, $cmtyUserId: String!) {
    verifyLinkClick(questStepId: $questStepId, cmtyUserId: $cmtyUserId) {
      success
    }
  }
`;