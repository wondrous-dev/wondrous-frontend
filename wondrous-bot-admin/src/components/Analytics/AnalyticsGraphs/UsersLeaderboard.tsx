import { useQuery } from "@apollo/client";
import { Box, Grid } from "@mui/material";
import EmptyState from "components/EmptyState";
import MembersAnalytics from "components/MembersAnalytics";
import { AddressComponent } from "components/MembersAnalytics/Common";
import { SharedSecondaryButton } from "components/Shared/styles";
import TableComponent from "components/TableComponent";
import { GET_CMTY_USERS_LEADERBOARD, GET_COMMUNITY_USERS_FOR_ORG } from "graphql/queries";
import { useContext, useMemo } from "react";
import { EMPTY_STATE_TYPES, LIMIT } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";

const UsersLeaderboard = () => {
  const { activeOrg } = useContext(GlobalContext);

  const { data, fetchMore, refetch } = useQuery(GET_CMTY_USERS_LEADERBOARD, {
    variables: {
        orgId: activeOrg?.id,
        limit: LIMIT,
        offset: 0,
    },
    skip: !activeOrg?.id,
  });
  
  const tableConfig = useMemo(() => {
    return data?.getCmtyUsersLeaderboard?.map((user) => {
      return {
        id: user.id,
        name: {
          component: "custom",
          value: user,
          customComponent: MembersAnalytics,
        },
        level: {
          component: "hexagon",
          value: user?.level,
        },
        address: {
          component: "custom",
          customComponent: () => (
            <Box display="flex" justifyContent="center" alignItems="center">
              <AddressComponent address={user?.web3Address} />
            </Box>
          ),
        },
        submissions: {
          component: "label",
          value: user?.submissions,
        },
        xp: {
          component: "label",
          value: user.points,
          componentProps: {
            fontWeight: 500,
          },
        },
        messages: {
          component: "label",
          value: user?.messages,
        },
        reactions: {
          component: "label",
          value: user?.reactions,
        },
      };
    });
  }, [data]);

  const headers = ["Username", "LVL", "Wallet Address", "Submissions", "XP Earned", "# of Messages", "#of Reactions"];


  return (
    <>
      {data?.getCmtyUsersLeaderboard?.length ? (
        <TableComponent data={tableConfig} headers={headers} title="Top Members" />
      ) : (
        <EmptyState type={EMPTY_STATE_TYPES.MEMBERS} />
      )}
      {data?.getCmtyUsersLeaderboard?.length >= LIMIT && (
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
                const getCmtyUsersLeaderboard = [...prev.getCmtyUsersLeaderboard, ...fetchMoreResult.getCmtyUsersLeaderboard];
                return {
                  getCmtyUsersLeaderboard,
                };
              },
            });
          }}
        >
          Show more
        </SharedSecondaryButton>
      )}
    </>
  );
};

export default UsersLeaderboard;
