import { ArrowUpward } from "@mui/icons-material";
import { Box, ButtonBase } from "@mui/material";
import { StyledCheckbox } from "components/PaymentLedger/styles";
import CheckboxOption from "components/QuestSteps/Checkbox";
import PageWrapper from "components/Shared/PageWrapper";
import Switch from "components/Shared/Switch";
import TableComponent from "components/TableComponent";
import { StyledTableHeader, StyledTableHeaderCell } from "components/TableComponent/styles";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BG_TYPES, EMPTY_STATE_TYPES, LIMIT, REFERRAL_STATUSES } from "utils/constants";
import { Label } from "components/QuestsList/styles";
import { useMutation } from "@apollo/client";
import { MINIMAL_REFERRAL_UPDATE, UPDATE_REFERRAL } from "graphql/mutations";
import { ExistingLevelsReward } from "components/LevelsReward";
import { useDiscordRoles } from "utils/discord";
import { useGlobalContext } from "utils/hooks";
import { PAYMENT_OPTIONS } from "components/CreateTemplate/RewardUtils";
import { SharedSecondaryButton } from "components/Shared/styles";
import Spinner from "components/Shared/Spinner";
import EmptyState from "components/EmptyState";
import apollo from "services/apollo";
import { GET_REFERRAL_CAMPAIGN_FOR_ORG } from "graphql/queries/referral";
import { updateReferralCampaignCache } from "utils/apolloHelpers";

const ReferralsList = ({ data, refetch, fetchMore, loading }) => {
  const [hasMore, setHasMore] = useState(true);

  const [sortOrder, setSortOrder] = useState({
    sortKey: "submissions",
    order: "desc",
  });
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
        label: "Off / On",
      },
      {
        label: "Campaign Name",
        sortKey: "name",
      },
      {
        label: "Referrals",
      },
      {
        label: "Approved",
        sortKey: "results",
      },
      {
        label: "Referrer Points",
        sortKey: "referrerPointReward",
      },
      {
        label: "Referred Points",
        sortKey: "referredPointReward",
      },
      {
        label: "Rewards",
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
              {referral?.rewards?.length &&
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
                })}
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

  const onSortOrderChange = ({}) => {};

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
        data={tableItems}
        headerComponent={() => {
          return (
            <StyledTableHeader>
              {headers?.map((header) => (
                <StyledTableHeaderCell sortKey={header}>
                  <Box display="flex" alignItems="center" gap="6px" justifyContent="center">
                    {header.label}
                    {/* {header.sortKey ? (
                      <ButtonBase type="button" onClick={() => onSortOrderChange({ header })}>
                        <ArrowUpward
                          sx={{
                            fontSize: "14px",
                            color: sortOrder.sortKey === header.sortKey ? "red" : "#949494",
                            transform:
                              sortOrder.sortKey === header.sortKey && sortOrder.order === "desc"
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                          }}
                        />
                      </ButtonBase>
                    ) : null} */}
                  </Box>
                </StyledTableHeaderCell>
              ))}
            </StyledTableHeader>
          );
        }}
        title="Referrals"
      />
      {hasMore && data?.getReferralCampaignForOrg?.items?.length > 0 ? (
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
