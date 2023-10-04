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
  }
`;

export const CmtyPaymentFragment = gql`
  fragment CmtyPaymentFragment on CmtyPaymentCard {
    id
    questTitle
    questId
    submissionId
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
  }
`;


export const CommunityNFTFragment = gql`
  fragment CommunityNFTFragment on CommunityNFT {
    id
    tokenId
    chain
    contractAddress
    name
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