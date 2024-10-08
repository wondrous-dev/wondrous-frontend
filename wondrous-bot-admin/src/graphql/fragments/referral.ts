import { gql } from "@apollo/client";
import { MinimalQuestFragment } from "./quest";
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
    media {
      slug
      name
      type
    }
    referrerPointReward
    referredPointReward
    maxPerUser
    level
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
      ...MinimalQuestFragment
    }
  }
  ${MinimalQuestFragment}
`;
