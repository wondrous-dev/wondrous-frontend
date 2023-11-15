import { gql } from "@apollo/client";

export const CREATE_REFERRAL = gql`
    mutation createReferralCampaign($input: ReferralCampaignInput) {
        createReferralCampaign(input: $input) {
            id
        }
    }
`;
export const UPDATE_REFERRAL = gql`
    mutation updateReferralCampaign($referralCampaignId: ID!, $input: ReferralCampaignInput) {
        updateReferralCampaign(referralCampaignId: $referralCampaignId, input: $input) {
            id
            status
        }
    }
`;