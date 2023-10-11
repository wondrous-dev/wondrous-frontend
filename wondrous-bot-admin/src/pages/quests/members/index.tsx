import { useLazyQuery, useQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import EmptyState from "components/EmptyState";
import MembersAnalytics from "components/MembersAnalytics";
import PageHeader from "components/PageHeader";
import { TeamsAndInvite } from "components/Settings/TeamSettings";
import Spinner from "components/Shared/Spinner";
import { SharedSecondaryButton } from "components/Shared/styles";
import TableComponent from "components/TableComponent";
import { GET_COMMUNITY_USERS_FOR_ORG } from "graphql/queries";
import { useContext, useEffect, useMemo, useState } from "react";
import { EMPTY_STATE_TYPES, LIMIT } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";

const MembersPage = () => {
  const { activeOrg } = useContext(GlobalContext);
  const [hasMore, setHasMore] = useState(true);

  const [getCmtyUsersForOrg, { data, fetchMore, refetch, loading }] = useLazyQuery(GET_COMMUNITY_USERS_FOR_ORG, {
    notifyOnNetworkStatusChange: true,
    variables: {
      input: {
        orgId: activeOrg?.id,
        limit: LIMIT,
        offset: 0,
      },
    },
  });

  useEffect(() => {
    if (activeOrg?.id) {
      getCmtyUsersForOrg({
        variables: {
          input: {
            orgId: activeOrg?.id,
            limit: LIMIT,
            offset: 0,
          },
        },
      }).then(({ data }) => setHasMore(data?.getCmtyUsersForOrg?.length >= LIMIT));
    }
  }, [])

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        input: {
          orgId: activeOrg?.id,
          limit: LIMIT,
          offset: data?.getCmtyUsersForOrg?.length,
        },
      },
    }).then(({ data }) => setHasMore(data?.getCmtyUsersForOrg?.length >= LIMIT));
  }
  const tableConfig = useMemo(() => {
    return data?.getCmtyUsersForOrg?.map((user) => {
      const userDiscordDiscriminator = `${user?.discordUsername}#${user?.discordDiscriminator}`;
      return {
        id: user.id,
        name: {
          component: "custom",
          value: user,
          customComponent: MembersAnalytics
        },
        level: {
          component: "hexagon",
          value: user?.level,
        },
        discord: {
          component: "discord",
          value: userDiscordDiscriminator || "N/A",
        },
        twitter: {
          component: "twitter",
          value: `https://twitter.com/${user?.twitterInfo?.twitterUsername}` || "N/A",
        },
        xp: {
          component: "label",
          value: user.point,
          componentProps: {
            fontWeight: 500,
          },
        },
      };
    });
  }, [data]);

  const headers = ["Name", "Level", "Discord", "Twitter", "XP"];
  return (
    <>
      <PageHeader title="Community Members" withBackButton={false} />
      <Grid
        minHeight="100vh"
        sx={{
          backgroundImage: "url(/images/members-bg.png)",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        container
        direction="column"
        gap="42px"
        padding={{
          xs: "14px 14px 120px 14px",
          sm: "24px 56px",
        }}
      >
        {data?.getCmtyUsersForOrg?.length ? (
          <TableComponent data={tableConfig} headers={headers} title="Top Members"/>
        ) : (
          <EmptyState type={EMPTY_STATE_TYPES.MEMBERS} />
        )}
        {hasMore && (
          <SharedSecondaryButton
            style={{
              width: "fit-content",
              alignSelf: "center",
            }}
            onClick={handleFetchMore}
          >
            {loading ? <Spinner /> : `Show more`}
          </SharedSecondaryButton>
        )}
      </Grid>
    </>
  );
};

export default MembersPage;
