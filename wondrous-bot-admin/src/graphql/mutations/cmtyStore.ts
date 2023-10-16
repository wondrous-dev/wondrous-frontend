import { gql } from "@apollo/client";

export const CREATE_STORE_ITEM = gql`
  mutation createStoreItem($input: StoreItemInput) {
    createStoreItem(input: $input) {
      id
      name
      description
    }
  }
`;

export const ATTACH_STORE_ITEM_MEDIA = gql`
  mutation attachStoreItemMedia($storeItemId: ID!, $mediaUploads: [MediaUploadInput]) {
    attachStoreItemMedia(storeItemId: $storeItemId, mediaUploads: $mediaUploads) {
      success
    }
  }
`;

export const REMOVE_STORE_ITEM_MEDIA = gql`
  mutation removeStoreItemMedia($storeItemId: ID!, $slug: String!) {
    removeStoreItemMedia(storeItemId: $storeItemId, slug: $slug) {
      success
    }
  }
`;

export const UPDATE_STORE_ITEM = gql`
  mutation updateStoreItem($storeItemId: ID!, $input: StoreItemInput) {
    updateStoreItem(storeItemId: $storeItemId, input: $input) {
      id
    }
  }
`;

export const ACTIVATE_STORE_ITEM = gql`
  mutation activateStoreItem($storeItemId: ID!) {
    activateStoreItem(storeItemId: $storeItemId) {
      id
    }
  }
`;

export const DEACTIVATE_STORE_ITEM = gql`
  mutation deactivateStoreItem($storeItemId: ID!) {
    deactivateStoreItem(storeItemId: $storeItemId) {
      id
    }
  }
`;

export const IMPORT_DISCOUNT_CODES = gql`
  mutation importDiscountCodes($input: DiscountCodeImportInput) {
    importDiscountCodes(input: $input) {
      success
    }
  }
`;
