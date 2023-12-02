import { gql } from "@apollo/client";

export const ReferralCampaignFragment = gql`
  fragment ReferralCampaignFragment on ReferralCampaign {
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
`;
