import { gql } from '@apollo/client';

export const MediaFragment = gql`
  fragment MediaFragment on Media {
    slug
    name
    type
    muxAssetId
    muxPlaybackId
    videoProcessingStatus
  }
`;
