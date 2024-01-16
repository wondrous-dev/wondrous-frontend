import { Box, TableCell, Typography } from "@mui/material";
import { CmtyActivityEmptyState, SharedShowMoreButton } from "../shared";
import { PanelCount, PanelTitle } from "../shared/styles";
import TableComponent from "components/TableComponent";
import { Wrapper } from "./styles";
import { CartIcon } from "components/Icons/Cart";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  GET_CMTY_PAYMENT_METHODS_FOR_ORG,
  GET_CMTY_USER_PURCHASES,
  GET_COMMUNITY_NFTS_FOR_ORG,
  GET_ORG_DISCORD_ROLES,
} from "graphql/queries";
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { STORE_ITEM_TYPES } from "utils/constants";

const LIMIT = 5;
const PurchasesTable = ({ count = 0, orgId, cmtyUserId }) => {
  const [hasMore, setHasMore] = useState(true);
  const headers = ["Product", "Price", "Deliverable", "Date"];

  const { data: cmtyPaymentMethods, loading: cmtyPaymentMethodsLoading } = useQuery(GET_CMTY_PAYMENT_METHODS_FOR_ORG, {
    variables: {
      orgId,
    },
  });

  const [getCmtyUserPurchases, { data: cmtyUserPurchasesData, loading, fetchMore }] =
    useLazyQuery(GET_CMTY_USER_PURCHASES);

  const handleFetchMore = async () => {
    const { data } = await fetchMore({
      variables: {
        limit: LIMIT,
        offset: cmtyUserPurchasesData?.getCmtyUserPurchases?.length,
        orgId,
        cmtyUserId,
      },
    });
    setHasMore(data?.getCmtyUserPurchases?.length >= LIMIT);
  };

  const { data: orgDiscordRolesData } = useQuery(GET_ORG_DISCORD_ROLES, {
    variables: {
      orgId,
    },
    skip: !orgId,
  });

  const { data: cmtyNFTsData, loading: cmtyNFTsLoading } = useQuery(GET_COMMUNITY_NFTS_FOR_ORG, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId,
      offset: 0,
    },
  });

  const discordRoles = useMemo(() => {
    return orgDiscordRolesData?.getCmtyOrgDiscordRoles?.map((role) => role.roles)?.flat();
  }, [orgDiscordRolesData?.getCmtyOrgDiscordRoles]);

  const handleFetch = async () => {
    const { data } = await getCmtyUserPurchases({
      variables: {
        limit: LIMIT,
        offset: 0,
        orgId,
        cmtyUserId,
      },
    });
    setHasMore(data?.getCmtyUserPurchases?.length >= LIMIT);
  };
  useEffect(() => {
    handleFetch();
  }, []);

  const getDeliverableTextFromType = (item, purchase) => {
    if (item.type === STORE_ITEM_TYPES.EXTERNAL_SHOP) {
      return {
        type: "Code",
        value: purchase?.discountCode?.code,
      };
    }
    if (item.type === STORE_ITEM_TYPES.TOKEN || item.type === STORE_ITEM_TYPES.NFT) {
      const cmtyPaymentId = item?.cmtyPaymentMethodId;
      const cmtyPaymentMethod =
        item.type === STORE_ITEM_TYPES.TOKEN
          ? cmtyPaymentMethods?.getCmtyPaymentMethodsForOrg?.find(({ id }) => id === cmtyPaymentId)
          : cmtyNFTsData?.getCommunityNFTsForOrg?.find(({ id }) => id === item.nftMetadataId);
      const label = item.type === STORE_ITEM_TYPES.TOKEN ? "Token" : "NFT";
      return {
        type: label,
        value: cmtyPaymentMethod?.name,
      };
    }
    if (item.type === STORE_ITEM_TYPES.DISCORD_ROLE) {
      const discordRoleId = item?.additionalData?.discordRoleId;
      const discordRole = discordRoles?.find(({ id }) => id === discordRoleId);
      return {
        type: "Discord Role",
        value: discordRole?.name,
      };
    }
    return {
      type: "Unknown",
      value: null,
    };
  };
  const data = useMemo(() => {
    return cmtyUserPurchasesData?.getCmtyUserPurchases?.map(({ item, purchase }) => {
      return {
        id: item?.id,
        name: {
          component: "label",
          value: item?.name,
          textAlign: "left",
        },
        price: {
          component: "label",
          value: item?.ptPrice,
          textAlign: "left",
        },
        deliverable: {
          component: "custom",
          customComponent: () => {
            const { type, value } = getDeliverableTextFromType(item, purchase);
            return (
              <Typography color="black" fontSize="14px" fontWeight={500} lineHeight="14px">
                <span style={{ color: "#6C6C6C" }}>{type}:</span> {value}
              </Typography>
            );
          },
        },
        date: {
          component: "label",
          value: moment(purchase?.createdAt)?.format("MM/DD/YY"),
          textAlign: "left",
        },
      };
    });
  }, [cmtyUserPurchasesData, cmtyPaymentMethods, getDeliverableTextFromType, discordRoles, cmtyNFTsData]);

  return (
    <Wrapper display="flex" flexDirection="column" gap="18px" width="100%">
      <Box display="flex" alignItems="center" gap="8px" justifyContent="flex-start">
        <PanelCount>
          <PanelTitle>{count || 0}</PanelTitle>
        </PanelCount>
        <PanelTitle>purchases</PanelTitle>
      </Box>

      <TableComponent
        hideTitle
        headers={headers}
        data={data}
        title="Quest Activity"
        emptyStateComponent={() => (
          <TableCell
            colSpan={headers?.length}
            sx={{
              padding: "0px",
            }}
          >
            <CmtyActivityEmptyState
              title="No purchases yet"
              Image={CartIcon}
              sx={{
                borderRadius: "0px",
              }}
            />
          </TableCell>
        )}
      />
      {hasMore && data?.length >= LIMIT && <SharedShowMoreButton onClick={handleFetchMore} />}
    </Wrapper>
  );
};

export default PurchasesTable;
