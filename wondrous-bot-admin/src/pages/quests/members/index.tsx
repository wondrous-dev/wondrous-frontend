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
import MemberAddModal from "./MemberAddModal";
import MembersTutorial from "components/TutorialComponent/Tutorials/MembersTutorial";
import { transformUser } from "utils/transformCmtyUserToMembers";
import { FilterPill } from "components/ViewQuestResults/styles";
import DownloadSvg from "components/Icons/download.svg";
import ExportModal from "./ExportModal";

const MembersPage = () => {
  const { activeOrg } = useContext(GlobalContext);
  const [hasMore, setHasMore] = useState(true);
  const [membersData, setMembersData] = useState([]);
  const [memberSearch, setMemberSearch] = useState(null);
  const [resetPointsBalance, setResetPointsBalance] = useState(null);
  const [openResetPointsModal, setOpenResetPointsModal] = useState(false);
  const [openMemberAddModal, setOpenMemberAddModal] = useState(null);
  const [openExportModal, setOpenExportModal] = useState(false);
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

  return (
    <>
      <ResetPointsModal
        openResetPointsModal={openResetPointsModal}
        setOpenResetPointsModal={setOpenResetPointsModal}
        pointsBalance={resetPointsBalance}
      />
      <ResetPointsModal
        openResetPointsModal={openResetPointsModal}
        setOpenResetPointsModal={setOpenResetPointsModal}
        pointsBalance={resetPointsBalance}
      />
      <MemberAddModal openMemberAddModal={openMemberAddModal} setOpenMemberAddModal={setOpenMemberAddModal} />
      <ExportModal isOpen={!!openExportModal} onClose={() => setOpenExportModal(false)} />
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
        <Box
          paddingRight="12px"
          display="flex"
          alignItems={{
            xs: "flex-start",
            md: "center",
          }}
          gap="12px"
          flexDirection={{
            xs: "column",
            md: "row",
          }}
        >
          <MemberPageSearchBar onChange={setMemberSearch} member={memberSearch} setMemberInfo={setMemberInfo} />
          <SharedSecondaryButton
            onClick={() => {
              setResetPointsBalance(false);
              setOpenResetPointsModal(true);
              setOpenMemberAddModal(false);
            }}
          >
            Reset points
          </SharedSecondaryButton>
          <SharedSecondaryButton
            onClick={() => {
              setResetPointsBalance(true);
              setOpenResetPointsModal(true);
              setOpenMemberAddModal(false);
            }}
          >
            Reset point balances
          </SharedSecondaryButton>
          <SharedSecondaryButton
            onClick={() => {
              setResetPointsBalance(false);
              setOpenResetPointsModal(false);
              setOpenMemberAddModal(true);
            }}
          >
            Add User
          </SharedSecondaryButton>
          <Box flex={1} />
          <FilterPill
            style={{
              fontWeight: "600",
            }}
            onClick={() => {
              setOpenExportModal(true);
            }}
          >
            Export members{" "}
            <img
              style={{
                cursor: "pointer",
                marginLeft: "12px",
              }}
              src={DownloadSvg}
            />
          </FilterPill>
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
