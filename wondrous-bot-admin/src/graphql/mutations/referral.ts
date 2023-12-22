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

export const ATTACH_REFERRAL_CAMPAIGN_MEDIA = gql`
  mutation attachReferralCampaignMedia($referralCampaignId: ID!, $mediaUploads: [MediaUploadInput]) {
    attachReferralCampaignMedia(referralCampaignId: $referralCampaignId, mediaUploads: $mediaUploads) {
      success
    }
  }
`;

export const REMOVE_REFERRAL_CAMPAIGN_MEDIA = gql`
  mutation removeReferralCampaignMedia($referralCampaignId: ID!, $slug: String!) {
    removeReferralCampaignMedia(referralCampaignId: $referralCampaignId, slug: $slug) {
      success
    }
  }
`;
