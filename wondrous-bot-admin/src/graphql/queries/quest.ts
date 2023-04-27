import { gql } from '@apollo/client';
import { QuestFragment } from 'graphql/fragments/quest';

export const GET_QUESTS_FOR_ORG = gql`
  query getQuestsForOrg($input: OrgQuestQueryInput) {
    getQuestsForOrg(input: $input) {
      ...QuestFragment
    }
  }
  ${QuestFragment}
`;

export const GET_ORG_QUESTS_LEVELS = gql`
  query getOrgQuestsLevels($orgId: ID!) {
    getOrgQuestsLevels(orgId: $orgId) {
      key
      value
    }
  }
`;