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
