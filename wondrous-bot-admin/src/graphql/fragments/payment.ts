import { gql } from "@apollo/client";

export const CmtyPaymentMethodFragment = gql`
  fragment CmtyPaymentMethodFragment on CmtyPaymentMethod {
    id
    type
    createdAt
    deactivatedAt
    orgId
    contractAddress
    chain
    name
    symbol
    icon
    decimal
    nftMetadataId
    nftMetadata {
      mediaUrl
    }
  }
`;

export const CmtyPaymentFragment = gql`
  fragment CmtyPaymentFragment on CmtyPaymentCard {
    id
    questTitle
    questId
    submissionId
    purchaseId
    level
    payeeId
    cmtyUserDisordId
    discordUsername
    discordDiscriminator
    cmtyUserId
    profilePicture
    recipientAddress
    txHash
    payedAt
    paymentStatus
    amount
    decimal
    paymentMethodId
    chain
    symbol
    icon
    tokenName
    submissionApprovedAt
    contractAddress
    contractType
    tokenId
  }
`;


export const CommunityNFTFragment = gql`
  fragment CommunityNFTFragment on CommunityNFT {
    id
    tokenId
    chain
    contractAddress
    name
    type
    description
    mediaUrl
    externalUrl
    attributes
    maxSupply
    unlockableContent
    media {
      slug
      name
      type
    }
  }
`;