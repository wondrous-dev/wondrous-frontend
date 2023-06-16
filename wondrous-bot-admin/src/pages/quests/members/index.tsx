import { useQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import EmptyState from "components/EmptyState";
import PageHeader from "components/PageHeader";
import { TeamsAndInvite } from "components/Settings/TeamSettings";
import { SharedSecondaryButton } from "components/Shared/styles";
import TableComponent from "components/TableComponent";
import { GET_COMMUNITY_USERS_FOR_ORG } from "graphql/queries";
import { useContext, useMemo } from "react";
import { EMPTY_STATE_TYPES, LIMIT } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";

const MembersPage = () => {
  const { activeOrg } = useContext(GlobalContext);
  const { data, fetchMore, refetch } = useQuery(GET_COMMUNITY_USERS_FOR_ORG, {
    variables: {
      input: {
        orgId: activeOrg?.id,
        limit: LIMIT,
        offset: 0,
      },
    },
  });
  const tableConfig = useMemo(() => {
    return data?.getCmtyUsersForOrg?.map((user) => {
      const userDiscord = `${user?.discordUsername}`;
      const userDiscordDiscriminator = `${user?.discordUsername}#${user?.discordDiscriminator}`;
      return {
        id: user.id,
        name: {
          component: "label",
          value: user?.username || userDiscord || "N/A",
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
      <PageHeader title="Community Members" withBackButton={false} renderActions={() => <TeamsAndInvite />} />
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
          <TableComponent data={tableConfig} headers={headers} />
        ) : (
          <EmptyState type={EMPTY_STATE_TYPES.MEMBERS} />
        )}
        {data?.getCmtyUsersForOrg?.length >= LIMIT && (
          <SharedSecondaryButton
            style={{
              width: "fit-content",
              alignSelf: "center",
            }}
            onClick={() => {
              fetchMore({
                variables: {
                  input: {
                    orgId: activeOrg?.id,
                    limit: LIMIT,
                    offset: tableConfig?.length,
                  },
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  const getCmtyUsersForOrg = [...prev.getCmtyUsersForOrg, ...fetchMoreResult.getCmtyUsersForOrg];
                  return {
                    getCmtyUsersForOrg,
                  };
                },
              });
            }}
          >
            Show more
          </SharedSecondaryButton>
        )}
      </Grid>
    </>
  );
};

export default MembersPage;
