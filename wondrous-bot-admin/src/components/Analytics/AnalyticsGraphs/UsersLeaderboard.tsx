import { useLazyQuery, useQuery } from "@apollo/client";
import { Box, Grid } from "@mui/material";
import EmptyState from "components/EmptyState";
import MembersAnalytics from "components/MembersAnalytics";
import { AddressComponent } from "components/MembersAnalytics/Common";
import Spinner from "components/Shared/Spinner";
import { SharedSecondaryButton } from "components/Shared/styles";
import TableComponent from "components/TableComponent";
import { GET_CMTY_USERS_LEADERBOARD, GET_COMMUNITY_USERS_FOR_ORG } from "graphql/queries";
import { useContext, useEffect, useMemo, useState } from "react";
import { EMPTY_STATE_TYPES, LIMIT } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";

const UsersLeaderboard = () => {
  const { activeOrg } = useContext(GlobalContext);

  const [hasMore, setHasMore] = useState(true);
  const [getCmtyUsersLeaderboard, { data, fetchMore, loading }] = useLazyQuery(GET_CMTY_USERS_LEADERBOARD, {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (activeOrg?.id) {
      getCmtyUsersLeaderboard({
        variables: {
          orgId: activeOrg?.id,
          limit: LIMIT,
          offset: 0,
        },
      }).then(({ data }) => setHasMore(data?.getCmtyUsersLeaderboard?.length >= LIMIT));
    }
  }, []);

  const handleFetchMore = async () => {
    const res = await fetchMore({
      variables: {
        offset: data?.getCmtyUsersLeaderboard?.length,
      },
    });
    setHasMore(res?.data?.getCmtyUsersLeaderboard?.length >= LIMIT);
  };

  const tableConfig = useMemo(() => {
    return data?.getCmtyUsersLeaderboard?.map((user) => {
      return {
        id: user.id,
        name: {
          component: "custom",
          value: user,
          customComponent: (props) => <MembersAnalytics {...props} />,
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

  const headers = ["Username", "LVL", "Wallet Address", "Submissions", "PTS Earned", "# of Messages", "#of Reactions"];

  return (
    <>
      {data?.getCmtyUsersLeaderboard?.length ? (
        <TableComponent data={tableConfig} headers={headers} title="Top Members" />
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
          {loading ? <Spinner /> : 'Show more'}
        </SharedSecondaryButton>
      )}
    </>
  );
};

export default UsersLeaderboard;
