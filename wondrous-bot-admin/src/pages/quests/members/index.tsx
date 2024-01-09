import { useLazyQuery, useQuery } from "@apollo/client";
import { Box, Grid } from "@mui/material";
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
import { MemberPageSearchBar } from "./MemberSearchBar";
import ResetPointsModal from "./ResetPointsModal";
import MembersTutorial from "components/TutorialComponent/Tutorials/MembersTutorial";
import { transformUser } from "utils/transformCmtyUserToMembers";

const MembersPage = () => {
  const { activeOrg } = useContext(GlobalContext);
  const [hasMore, setHasMore] = useState(true);
  const [membersData, setMembersData] = useState([]);
  const [memberSearch, setMemberSearch] = useState(null);
  const [resetPointsBalance, setResetPointsBalance] = useState(null);
  const [openResetPointsModal, setOpenResetPointsModal] = useState(false);
  const [memberInfo, setMemberInfo] = useState(null);
  const [getCmtyUsersForOrg, { data, fetchMore, refetch, loading }] = useLazyQuery(GET_COMMUNITY_USERS_FOR_ORG, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setMembersData(
        data?.getCmtyUsersForOrg?.map((user) => {
          return transformUser(user);
        })
      );
    },
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
  }, []);

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
  };

  const headers = ["Name", "Level", "Discord", "Twitter", "Points Balance", "Total Points Accumulated"];

  console.log(membersData, "mem data");

  return (
    <>
      <ResetPointsModal
        openResetPointsModal={openResetPointsModal}
        setOpenResetPointsModal={setOpenResetPointsModal}
        pointsBalance={resetPointsBalance}
      />
      {data?.getCmtyUsersForOrg ? (
        <MembersTutorial setMembersData={setMembersData} data={data?.getCmtyUsersForOrg} />
      ) : null}
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
        <Box display="flex" alignItems="center">
          <MemberPageSearchBar onChange={setMemberSearch} member={memberSearch} setMemberInfo={setMemberInfo} />
          <SharedSecondaryButton
            style={{
              marginLeft: "8px",
              minWidth: "none",
            }}
            onClick={() => {
              setResetPointsBalance(false);
              setOpenResetPointsModal(true);
            }}
          >
            Reset member points
          </SharedSecondaryButton>
          <SharedSecondaryButton
            style={{
              marginRight: "8px",
              marginLeft: "8px",
              minWidth: "none",
            }}
            onClick={() => {
              setResetPointsBalance(true);
              setOpenResetPointsModal(true);
            }}
          >
            Reset member point balances
          </SharedSecondaryButton>
        </Box>
        <Box width="100%" height="100%" data-tour="tutorial-members-table">
          {membersData?.length > 0 ? (
            <TableComponent
              data={memberInfo ? [transformUser(memberInfo)] : membersData}
              headers={headers}
              title="Top Members"
              // tableProps={{
              //   "data-tour": "tutorial-members-table",
              // }}
            />
          ) : (
            <EmptyState type={EMPTY_STATE_TYPES.MEMBERS} />
          )}
        </Box>
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
