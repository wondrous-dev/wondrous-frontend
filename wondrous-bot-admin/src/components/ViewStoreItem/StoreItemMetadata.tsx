import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { GET_COMMUNITY_NFT_BY_METADATA_ID, GET_ORG_DISCORD_ROLES } from "graphql/queries";
import { useMemo } from "react";
import { STORE_ITEM_TYPES } from "utils/constants";
import useLevels from "utils/levels/hooks";

const StoreItemMetadata = ({ storeItemData }) => {
  const isNFT = storeItemData?.nftMetadataId && storeItemData?.type !== STORE_ITEM_TYPES.NFT;

  const discordRoleId = storeItemData?.additionalData?.discordRoleId;

  const { data, loading } = useQuery(GET_ORG_DISCORD_ROLES, {
    variables: {
      orgId: storeItemData?.orgId,
    },
    skip: !storeItemData || storeItemData?.type !== STORE_ITEM_TYPES.DISCORD_ROLE,
  });

  const { data: nftMetadata, loading: nftMetadataLoading } = useQuery(GET_COMMUNITY_NFT_BY_METADATA_ID, {
    variables: {
      nftMetadataId: storeItemData?.nftMetadataId,
    },
    skip: !storeItemData || !storeItemData?.nftMetadataId || storeItemData?.type !== STORE_ITEM_TYPES.NFT,
  });

  const title = useMemo(() => {
    if (nftMetadataLoading || loading) return null;
    if (storeItemData?.additionalData?.discordRoleId)
      return `${
        data?.getCmtyOrgDiscordRoles?.[0]?.roles?.find(
          (role) => role.id === storeItemData?.additionalData?.discordRoleId
        )?.name
      }`;
    if (storeItemData?.nftMetadataId) return `${nftMetadata?.getCmtyNFTByMetadataId?.name}`;
    return storeItemData?.url;
  }, [
    data,
    nftMetadata,
    storeItemData?.url,
    nftMetadataLoading || loading,
    storeItemData?.additionalData?.discordRoleId,
    storeItemData?.nftMetadataId,
  ]);

  if (nftMetadataLoading || loading) return null;

  return (
    <StyledViewQuestResults
      style={{
        position: "relative",
      }}
    >
      {title}
    </StyledViewQuestResults>
  );
};

export default StoreItemMetadata;
