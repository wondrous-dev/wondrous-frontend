import { gql } from "@apollo/client";
import { QuestFragment } from "graphql/fragments/quest";
import { ReferralCampaignFragment } from "graphql/fragments/referral";

export const CREATE_REFERRAL = gql`
  mutation createReferralCampaign($input: ReferralCampaignInput) {
    createReferralCampaign(input: $input) {
      ...ReferralCampaignFragment
    }
  }
  ${ReferralCampaignFragment}
  ${QuestFragment}
`;
export const UPDATE_REFERRAL = gql`
  mutation updateReferralCampaign($referralCampaignId: ID!, $input: ReferralCampaignInput) {
    updateReferralCampaign(referralCampaignId: $referralCampaignId, input: $input) {
      ...ReferralCampaignFragment
    }
  }
  ${ReferralCampaignFragment}
  ${QuestFragment}
`;

export const MINIMAL_REFERRAL_UPDATE = gql`
  mutation updateReferralCampaign($referralCampaignId: ID!, $input: ReferralCampaignInput) {
    updateReferralCampaign(referralCampaignId: $referralCampaignId, input: $input) {
      id
      status
    }
  }
`;
