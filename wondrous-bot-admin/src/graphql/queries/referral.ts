import { gql } from "@apollo/client";
import { QuestFragment } from "graphql/fragments/quest";
import { ReferralCampaignFragment } from "graphql/fragments/referral";

export const GET_REFERRAL_CAMPAIGN_BY_ID = gql`
  query getReferralCampaignById($referralCampaignId: ID!) {
    getReferralCampaignById(referralCampaignId: $referralCampaignId) {
      ...ReferralCampaignFragment
    }
  }
  ${ReferralCampaignFragment}
  ${QuestFragment}
`;

export const GET_REFERRAL_CAMPAIGN_FOR_ORG = gql`
  query getReferralCampaignForOrg($input: OrgReferralCampaignQueryInput) {
    getReferralCampaignForOrg(input: $input) {
      total
      items {
        id
        name
        rewards {
          id
          type
          scheme
          paymentMethodId
          paymentMethod {
            id
            createdAt
            orgId
            contractAddress
            chain
            name
            symbol
            icon
            decimal
            maxPayout
            deactivatedAt
            notes
            type
            nftMetadata {
              mediaUrl
            }
            nftMetadataId
          }
          amount
          storeItemId
          storeItem {
            id
            name
            description
            ptPrice
            price
            media {
              slug
            }
          }
          discordRewardData {
            discordRoleId
            discordGuildId
            discordRoleName
          }
        }
        status
        referredPointReward
        referrerPointReward
        campaignStats {
          approvedSubmissions
          referralsCount
        }
        quests {
          id
        }
      }
    }
  }
`;

export const GET_REFERRAL_CAMPAIGN_BY_EXTERNAL_ID = gql`
  query getReferralCampaignByReferralExternalId($referralCampaignExternalId: String!) {
    getReferralCampaignByReferralExternalId(referralCampaignExternalId: $referralCampaignExternalId) {
      ...ReferralCampaignFragment
    }
  }
  ${ReferralCampaignFragment}
  ${QuestFragment}
`;
