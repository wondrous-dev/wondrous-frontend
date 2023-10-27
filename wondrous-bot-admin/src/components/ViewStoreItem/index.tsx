import { Grid, Box } from "@mui/material";
import { CampaignOverviewHeader } from "components/CreateTemplate/CampaignOverview";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import PageWrapper from "components/Shared/PageWrapper";
import ViewCampaignOverview from "components/ViewQuestResults/ViewCampaignOverview";
import { useEffect, useMemo, useState } from "react";
import { getTextForCondition } from "utils/common";
import {
  BG_TYPES,
  CONDITION_TYPES,
  DELIVERY_METHOD_LABELS,
  STORE_ITEM_LABELS,
  STORE_ITEM_STATUSES,
  STORE_ITEM_TYPES,
} from "utils/constants";
import StoreItemMetadata from "./StoreItemMetadata";
import StoreItemConditions from "./StoreItemConditions";
import StoreItemPurchases from "./Purchases";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  GET_COMMUNITY_NFT_BY_METADATA_ID,
  GET_ORG_DISCORD_ROLES,
  GET_STORE_ITEM_PURCHASES,
  GET_STORE_ITEM_PURCHASES_EXPORT,
} from "graphql/queries";
import { FilterPill } from "components/ViewQuestResults/styles";
import { exportStoreItemPurchasesToCsv } from "utils/exports";
import Spinner from "components/Shared/Spinner";

const ViewStoreItem = ({ data }) => {
  const shouldFetchDiscord = useMemo(() => {
    const hasDiscordCondition = data?.conditions?.some((condition) => condition.type === CONDITION_TYPES.DISCORD_ROLE);
    const hasDiscordData = data?.additionalData?.discordRoleId;
    return hasDiscordCondition || hasDiscordData;
  }, [data?.conditions, data?.additionalData?.discordRoleId]);

  const [getExportData, { loading: exportLoading }] = useLazyQuery(GET_STORE_ITEM_PURCHASES_EXPORT, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const handleExportClick = async () => {
    const result = await getExportData({
      variables: {
        orgId: data?.orgId,
        storeItemId: data?.id,
      },
    });
    await exportStoreItemPurchasesToCsv({
      data: result?.data?.getStoreItemPurchasesExport,
    });
  };

  const { data: orgDiscordRolesData, loading } = useQuery(GET_ORG_DISCORD_ROLES, {
    variables: {
      orgId: data?.orgId,
    },
    skip: !shouldFetchDiscord,
  });

  const { data: nftMetadata, loading: nftMetadataLoading } = useQuery(GET_COMMUNITY_NFT_BY_METADATA_ID, {
    variables: {
      nftMetadataId: data?.nftMetadataId,
    },
    skip: !data || !data?.nftMetadataId || data?.type !== STORE_ITEM_TYPES.NFT,
  });

  const sections = useMemo(() => {
    return [
      {
        settings: [
          {
            label: "Product title",
            value: data?.name,
            type: "titleOrDescription",
          },
          {
            label: "Description",
            value: data?.description,
            type: "titleOrDescription",
          },
        ],
        settingsLayout: {
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "14px",
        },
      },
      {
        settings: [
          {
            label: "Price",
            value: data?.price || "None",
            type: "text",
          },
          {
            label: "Price in Points",
            value: data?.ptPrice,
            type: "text",
          },
          { label: "Active Listing", value: !data?.deactivatedAt, type: "boolean" },
        ],
      },
      {
        settings: [
          {
            label: "Max Purchases",
            value: data?.maxPurchase || "Unlimited",
            type: "text",
          },
          {
            label: "Product type",
            value: STORE_ITEM_LABELS[data?.type],
            type: "text",
          },
          {
            label: "Delivery method",
            value: DELIVERY_METHOD_LABELS[data?.deliveryMethod],
            type: "text",
          },
          {
            label: "Conditions",
            value: data?.conditions,
            type: "custom",
            customComponent: () => (
              <StoreItemConditions discordData={orgDiscordRolesData?.getCmtyOrgDiscordRoles} storeItemData={data} />
            ),
          },
          {
            label: STORE_ITEM_LABELS[data?.type],
            value: data?.url || data?.nftMetadataId || data?.additionalData?.discordRoleName || "None",
            type: "custom",
            customComponent: () => (
              <StoreItemMetadata
                nftMetadata={nftMetadata?.getCmtyNFTByMetadataId}
                discordRoles={orgDiscordRolesData?.getCmtyOrgDiscordRoles}
                storeItemData={data}
              />
            ),
          },
        ],
        showBorder: false,
      },
    ];
  }, [data, orgDiscordRolesData?.getCmtyOrgDiscordRoles, nftMetadata?.getCmtyNFTByMetadataId]);

  return (
    <PageWrapper
      containerProps={{
        direction: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        minHeight: "100vh",
        padding: {
          xs: "14px 14px 120px 14px",
          sm: "24px 56px 150px 24px",
        },
      }}
      bgType={BG_TYPES.DEFAULT}
    >
      <Grid
        display="flex"
        justifyContent="space-between"
        width="100%"
        gap="24px"
        flexDirection={{
          xs: "column",
          md: "row",
        }}
      >
        <Box flexBasis="40%" display="flex" flexDirection="column" gap="24px">
          <PanelComponent
            renderHeader={() => <CampaignOverviewHeader title="Product Information" />}
            renderBody={() => <ViewCampaignOverview sections={sections} />}
          />
        </Box>
        <Grid
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          gap="24px"
          alignItems="center"
          width="100%"
        >
          <Box display="flex" width="100%">
            <div
              style={{
                flex: 1,
              }}
            />
            <FilterPill
              style={{
                color: "#2a8d5c",
              }}
              disabled={exportLoading}
              onClick={handleExportClick}
            >
              {exportLoading ? <Spinner /> : "Export purchases to CSV"}
            </FilterPill>
          </Box>

          <StoreItemPurchases
            nftMetadata={nftMetadata?.getCmtyNFTByMetadataId}
            data={data}
            discordRoles={orgDiscordRolesData?.getCmtyOrgDiscordRoles}
          />
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default ViewStoreItem;
