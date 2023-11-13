import { gql } from "@apollo/client";

export const CREATE_REFERRAL = gql`
    mutation createReferralCampaign($input: ReferralCampaignInput) {
        createReferralCampaign(input: $input) {
            id
        }
    }
`;