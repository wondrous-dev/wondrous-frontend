import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { GET_COMMUNITY_NFT_BY_METADATA_ID, GET_ORG_DISCORD_ROLES } from "graphql/queries";
import { useMemo } from "react";
import { STORE_ITEM_TYPES } from "utils/constants";
import useLevels from "utils/levels/hooks";

const StoreItemMetadata = ({ storeItemData, discordRoles, nftMetadata }) => {
  const title = useMemo(() => {
    if (storeItemData?.additionalData?.discordRoleId)
      return `${
        discordRoles?.[0]?.roles?.find((role) => role.id === storeItemData?.additionalData?.discordRoleId)?.name
      }`;
    if (storeItemData?.nftMetadataId) return `${nftMetadata?.name}`;
    return storeItemData?.url;
  }, [
    discordRoles,
    nftMetadata,
    storeItemData?.url,
    storeItemData?.additionalData?.discordRoleId,
    storeItemData?.nftMetadataId,
  ]);

  return (
    <StyledViewQuestResults
      style={{
        position: "relative",
      }}
    >
      {title || "None"}
    </StyledViewQuestResults>
  );
};

export default StoreItemMetadata;
