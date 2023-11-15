import { gql } from "@apollo/client";
import { QuestFragment } from "graphql/fragments/quest";

export const GET_REFERRAL_CAMPAIGN_BY_ID = gql`
  query getReferralCampaignById($referralCampaignId: ID!) {
    getReferralCampaignById(referralCampaignId: $referralCampaignId) {
      id
      createdAt
      createdBy
      name
      status
      description
      orgId
      questIds
      type
      endDate
      referrerPointReward
      referredPointReward
      maxPerUser
      level
      creator {
        firstName
        lastName
        username
      }
      org {
        profilePicture
        name
        username
        description
      }
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
      quests {
        ...QuestFragment
      }
    }
  }
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
