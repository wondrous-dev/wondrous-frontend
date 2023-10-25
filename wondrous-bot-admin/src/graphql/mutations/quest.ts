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

export const CREATE_CMTY_USER_FROM_REFERRAL = gql`
  mutation createCmtyUserFromReferral($referralCode: String!, $code: String!) {
    createCmtyUserFromReferral(referralCode: $referralCode, code: $code) {
      orgId
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

export const ADD_LINK_CLICK = gql`
  mutation addLinkClick($questStepId: ID!, $cmtyUserId: String!, $url: String!) {
    addLinkClick(questStepId: $questStepId, cmtyUserId: $cmtyUserId, url: $url) {
      success
    }
  }
`;

export const REMOVE_QUEST_STEP_MEDIA = gql`
  mutation removeQuestStepMedia($questStepId: ID!, $slugs: [String]) {
    removeQuestStepMedia(questStepId: $questStepId, slugs: $slugs) {
      success
    }
  }
`;

export const SUBMIT_QUEST = gql`
  mutation createQuestSubmission(
    $questId: String
    $telegramUserId: String
    $telegramUsername: String
    $stepsData: [StepSubmissionInput]
    $platform: String
  ) {
    createQuestSubmission(
      questId: $questId
      telegramUserId: $telegramUserId
      telegramUsername: $telegramUsername
      stepsData: $stepsData
      platform: $platform
    ) {
      success
    }
  }
`;

export const REQUEST_CMTY_USER_CONNECT_WALLET = gql`
  mutation requestCmtyUserConnectWallet($cmtyUserId: ID!, $orgId: ID!) {
    requestCmtyUserConnectWallet(cmtyUserId: $cmtyUserId, orgId: $orgId) {
      success
    }
  }
`;

export const MIGRATE_ORG_CMTY_USER_TELEGRAM = gql`
  mutation migratOrgCmtyUserTelegram($orgId: ID!, $cmtyUserId: ID!, $telegramId: String, $telegramUsername: String) {
    migratOrgCmtyUserTelegram(
      orgId: $orgId
      cmtyUserId: $cmtyUserId
      telegramId: $telegramId
      telegramUsername: $telegramUsername
    ) {
      success
    }
  }
`;


export const UPDATE_QUEST_ORDER = gql`
  mutation updateQuestOrder($questId: ID!, $order: Int!) {
    updateQuestOrder(questId: $questId, order: $order) {
      id
      order
    }
  }
`;

export const CREATE_ORG_QUEST_CATEGORY = gql`
  mutation createOrgQuestCategory($orgId: ID!, $category: String!) {
    createOrgQuestCategory(orgId: $orgId, category: $category) {
      success
    }
  }
`;

export const DELETE_ORG_QUEST_CATEGORY = gql`
  mutation deleteOrgQuestCategory($categoryId: ID!) {
    deleteOrgQuestCategory(categoryId: $categoryId) {
      success
    }
  }
`;