import { Box, TableCell, Typography } from "@mui/material";
import PageWrapper from "components/Shared/PageWrapper";
import Switch from "components/Shared/Switch";
import TableComponent from "components/TableComponent";
import { StyledTableHeader, StyledTableHeaderCell } from "components/TableComponent/styles";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BG_TYPES, EMPTY_STATE_TYPES, LIMIT, REFERRAL_STATUSES } from "utils/constants";
import { Label } from "components/QuestsList/styles";
import { useMutation } from "@apollo/client";
import { MINIMAL_REFERRAL_UPDATE } from "graphql/mutations";
import { ExistingLevelsReward } from "components/LevelsReward";
import { useDiscordRoles } from "utils/discord";
import { useGlobalContext } from "utils/hooks";
import { SharedSecondaryButton } from "components/Shared/styles";
import Spinner from "components/Shared/Spinner";
import EmptyState from "components/EmptyState";
import apollo from "services/apollo";
import { GET_REFERRAL_CAMPAIGN_FOR_ORG } from "graphql/queries/referral";
import { updateReferralCampaignCache } from "utils/apolloHelpers";
import { StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { PAYMENT_OPTIONS } from "components/Rewards/constants";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { StyledInformationTooltip } from "components/Shared/Tooltip";
import InformationTooltip from "components/Icons/information.svg";

const ReferralsList = ({ data, refetch, fetchMore, loading }) => {
  const [hasMore, setHasMore] = useState(true);

  const { activeOrg } = useGlobalContext();
  const discordRoles = useDiscordRoles({
    orgId: activeOrg?.id,
  });

  const [updateReferralCampaign] = useMutation(MINIMAL_REFERRAL_UPDATE, {
    update: (cache, { data }) =>
      updateReferralCampaignCache(
        cache,
        data,
        "updateReferralCampaign",
        {
          orgId: activeOrg?.id,
          limit: LIMIT,
          statuses: [REFERRAL_STATUSES.ACTIVE, REFERRAL_STATUSES.INACTIVE],
          offset: data?.getReferralCampaignForOrg?.items?.length,
        },
        "update",
        ["status"]
      ),
  });

  const headers = useMemo(() => {
    return [
      {
        label: "Active",
        infoText: "Toggle to activate or deactivate the referral campaign.",
      },
      {
        label: "Campaign Name",
        sortKey: "name",
        infoText: "Click to view the referral campaign.",
      },
      {
        label: "Referrals",
        infoText: "Number of referrals that have been made.",
      },
      {
        label: "Approved",
        sortKey: "results",
        infoText: "Number of referrals that have been approved.",
      },
      {
        label: "Referrer Points",
        sortKey: "referrerPointReward",
        infoText: "Number of points the referrer will receive.",
      },
      {
        label: "Referred Points",
        sortKey: "referredPointReward",
        infoText: "Number of points the referred will receive.",
      },
      {
        label: "Rewards",
        infoText: "Rewards that will be given to the referrer and referred.",
      },
    ];
  }, []);

  const handleReferralStatusUpdate = (referralCampaignId, status) => {
    updateReferralCampaign({
      variables: {
        referralCampaignId,
        input: {
          status: status === REFERRAL_STATUSES.ACTIVE ? REFERRAL_STATUSES.INACTIVE : REFERRAL_STATUSES.ACTIVE,
        },
        optimisticResponse: {
          updateReferralCampaign: {
            updateReferralCampaign: {
              id: referralCampaignId,
              status: status === REFERRAL_STATUSES.ACTIVE ? REFERRAL_STATUSES.INACTIVE : REFERRAL_STATUSES.ACTIVE,
              __typename: "ReferralCampaign",
            },
          },
        },
      },
    });
  };

  const getLinkForReward = (reward) => {
    if (reward?.type === PAYMENT_OPTIONS.CMTY_STORE_ITEM) {
      return `/store/items/${reward?.storeItem?.id}`;
    }
  };

  const tableItems = useMemo(() => {
    return data?.getReferralCampaignForOrg?.items?.map((referral, idx) => {
      return {
        status: {
          component: "custom",
          customComponent: () => (
            <Box display="flex" justifyContent="center !important" alignItems="center" width="100%">
              <Switch
                value={referral?.status === REFERRAL_STATUSES.ACTIVE}
                onChange={() => handleReferralStatusUpdate(referral?.id, referral?.status)}
              />
            </Box>
          ),
        },
        name: {
          component: "custom",
          value: referral?.name,
          customComponent: () => (
            <Link to={`/referrals/${referral?.id}`}>
              <Label
                fontSize="14px"
                lineHeight="14px"
                textAlign={"center"}
                width={"100%"}
                sx={{
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {referral?.name}
              </Label>
            </Link>
          ),
        },
        referrals: {
          component: "label",
          value: referral?.campaignStats?.referralsCount,
        },
        approvedSubmissions: {
          component: "label",
          value: referral?.campaignStats?.approvedSubmissions,
        },
        referrerPoints: {
          component: "label",
          value: referral?.referrerPointReward || 0,
        },
        referredPoints: {
          component: "label",
          value: referral?.referredPointReward || 0,
        },
        rewards: {
          component: "custom",
          tableStyle: {
            maxWidth: "350px",
          },
          customComponent: () => (
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", maxWidth: "350px" }}>
              {referral?.rewards?.length ? (
                referral?.rewards?.map((reward) => {
                  const rewardLink = getLinkForReward(reward) || "";
                  return (
                    <Link
                      to={rewardLink}
                      style={{
                        pointerEvents: rewardLink ? "auto" : "none",
                      }}
                    >
                      <ExistingLevelsReward reward={reward} discordRoles={discordRoles} />
                    </Link>
                  );
                })
              ) : (
                <StyledViewQuestResults bgcolor="#E8E8E8" $outlineColor="#E8E8E8">
                  None
                </StyledViewQuestResults>
              )}
            </div>
          ),
        },
      };
    });
  }, [data?.getReferralCampaignForOrg?.items, discordRoles]);

  const handleFetchMore = () => {
    const prevData = data?.getReferralCampaignForOrg?.items;
    fetchMore({
      variables: {
        input: {
          orgId: activeOrg?.id,
          limit: LIMIT,
          statuses: [REFERRAL_STATUSES.ACTIVE, REFERRAL_STATUSES.INACTIVE],
          offset: prevData?.length,
        },
      },
    }).then(({ data }) => {
      apollo.cache.updateQuery(
        {
          query: GET_REFERRAL_CAMPAIGN_FOR_ORG,
          variables: {
            input: {
              orgId: activeOrg?.id,
              limit: LIMIT,
              statuses: [REFERRAL_STATUSES.ACTIVE, REFERRAL_STATUSES.INACTIVE],
              offset: 0,
            },
          },
        },
        () => {
          const updatedItems = [...prevData, ...data?.getReferralCampaignForOrg?.items];
          return {
            getReferralCampaignForOrg: {
              ...data?.getReferralCampaignForOrg,
              items: updatedItems,
            },
          };
        }
      );
      setHasMore(data?.getReferralCampaignForOrg?.items?.length >= LIMIT);
    });
  };

  return (
    <PageWrapper
      bgType={BG_TYPES.QUESTS}
      containerProps={{
        minHeight: "100vh",
        flexDirection: "column",
        gap: "42px",
        padding: {
          xs: "14px 14px 120px 14px",
          sm: "24px 56px",
        },
      }}
    >
      <TableComponent
        tableProps={{
          "data-tour": "tutorial-referrals-table",
        }}
        data={tableItems}
        emptyStateComponent={() => (
          <TableCell colSpan={headers?.length}>
            <EmptyState type={EMPTY_STATE_TYPES.REFERRALS} labelColor="#828282">
              <Divider />
              <Typography fontFamily="Poppins" fontWeight={500} fontSize="16px" lineHeight="16px">
                Start a referral by <Link to="/referrals/create">clicking here.</Link>
              </Typography>
            </EmptyState>
          </TableCell>
        )}
        headerComponent={() => {
          return (
            <StyledTableHeader>
              {headers?.map((header) => (
                <StyledTableHeaderCell sortKey={header}>
                  <Box display="flex" alignItems="center" gap="6px" justifyContent="center">
                    {header.label}
                    {header?.infoText ? (
                      <StyledInformationTooltip placement="right" title={header?.infoText}>
                        <img
                          src={InformationTooltip}
                          alt="information"
                          style={{ width: "16px", height: "16px", marginLeft: "8px" }}
                        />
                      </StyledInformationTooltip>
                    ) : null}
                  </Box>
                </StyledTableHeaderCell>
              ))}
            </StyledTableHeader>
          );
        }}
        title="Referrals"
      />
      {hasMore && data?.getReferralCampaignForOrg?.items?.length >= LIMIT ? (
        <SharedSecondaryButton
          style={{
            width: "fit-content",
            alignSelf: "center",
          }}
          onClick={handleFetchMore}
        >
          {loading ? <Spinner /> : `Show more`}
        </SharedSecondaryButton>
      ) : null}
    </PageWrapper>
  );
};

export default ReferralsList;
