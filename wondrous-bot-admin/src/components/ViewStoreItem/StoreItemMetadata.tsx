import { useQuery } from "@apollo/client";
import { Box, Typography } from "@mui/material";
import { PoapImage } from "components/CreateTemplate/styles";
import { StyledInformationTooltip } from "components/Shared/Tooltip";
import { StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { GET_COMMUNITY_NFT_BY_METADATA_ID, GET_ORG_DISCORD_ROLES } from "graphql/queries";
import { useMemo } from "react";
import { STORE_ITEM_TYPES } from "utils/constants";
import useLevels from "utils/levels/hooks";

const StoreItemMetadata = ({ storeItemData, discordRoles, nftMetadata, cmtyPaymentMethods }) => {
  const title = useMemo(() => {
    if (storeItemData?.additionalData?.discordRoleId)
      return `${
        discordRoles?.[0]?.roles?.find((role) => role.id === storeItemData?.additionalData?.discordRoleId)?.name
      }`;
    if (storeItemData?.nftMetadataId) return `${nftMetadata?.name}`;
    if (storeItemData?.cmtyPaymentMethodId) {
      const paymentMethod = cmtyPaymentMethods?.find((method) => method.id === storeItemData?.cmtyPaymentMethodId);
      if (!paymentMethod) return null;
      return (
        <StyledInformationTooltip title={`Chain: ${paymentMethod?.chain}`}>
          <Box display="flex" gap="8px" alignItems="center" justifyContent="center">
            {paymentMethod?.icon ? (
              <PoapImage style={{ width: "24px", height: "24px" }} src={paymentMethod?.icon} />
            ) : null}
            <Box display="flex" gap="4px" alignItems="center" justifyContent="center">
              <span>{storeItemData?.quantity}</span>
              {paymentMethod?.name}
            </Box>
          </Box>
        </StyledInformationTooltip>
      );
    }
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
