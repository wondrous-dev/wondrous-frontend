import { STORE_ITEM_TYPES } from "utils/constants";
import * as Yup from "yup";

export const STORE_TYPES = [STORE_ITEM_TYPES.EXTERNAL_SHOP, STORE_ITEM_TYPES.DISCORD_ROLE, STORE_ITEM_TYPES.NFT];

const STORE_FIELDS = Yup.object().shape({
  type: Yup.string().required("Type is required").oneOf(STORE_TYPES, "Type is not valid"),
  name: Yup.string().required("Name is required"),
  description: Yup.string().nullable(),
  ptPrice: Yup.number().nullable(),
  price: Yup.number().nullable(),
  deliveryMethod: Yup.string().nullable(),
  maxPurchase: Yup.number().nullable(),
});

const storeItemTypes = {
  [STORE_ITEM_TYPES.EXTERNAL_SHOP]: STORE_FIELDS.shape({
    url: Yup.string().url("This is not a valid url").required("URL is required"),
  }),
  [STORE_ITEM_TYPES.DISCORD_ROLE]: STORE_FIELDS.shape({
    additionalData: Yup.object().shape({
      discordRoleId: Yup.string().required("Please select a discord role"),
      discordRoleName: Yup.string().required("Please select a discord role"),
      discordGuildId: Yup.string().required("Please select a discord role"),
    }),
  }),
  [STORE_ITEM_TYPES.NFT]: STORE_FIELDS.shape({
    nftMetadataId: Yup.string().required("Please select an NFT"),
  }),
};

export const storeItemValidator = async (body) => {
  const schema = storeItemTypes[body.type];
  if (!schema) {
    throw new Error(`Validation schema not found for type: ${body.type}`);
  }
  return schema.validate(body, {
    abortEarly: false,
  });
};
