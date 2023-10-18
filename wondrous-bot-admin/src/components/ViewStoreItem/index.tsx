import { Grid, Box } from "@mui/material";
import { CampaignOverviewHeader } from "components/CreateTemplate/CampaignOverview";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import PageWrapper from "components/Shared/PageWrapper";
import ViewCampaignOverview from "components/ViewQuestResults/ViewCampaignOverview";
import ViewRewards from "components/ViewQuestResults/ViewRewards";
import { BG_TYPES, STORE_ITEM_STATUSES } from "utils/constants";

const ViewStoreItem = ({ data }) => {
    console.log(data)
  const sections = [
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
        { label: "Active Listing", value: data?.status === STORE_ITEM_STATUSES.ACTIVE, type: "boolean" },
      ],
    },
    {
      settings: [
        {
          label: "Max Purchases",
          value: data?.maxPurchase || "Unlimited",
          type: "text",
        },
        // {
        //     label: "Conditions",
        //     value: questSettingsConditions?.length > 0 ? questSettingsConditions : "None",
        //     type: questSettingsConditions?.length > 0 ? "questConditions" : "text",
        //   },  
      ],
    },
  ];
  // const sections = [
  //     {
  //       settings: [
  //         { label: "Quest Title", value: quest?.title, type: "titleOrDescription" },
  //         { label: "Description", value: quest?.description, type: "titleOrDescription" },
  //       ],
  //       settingsLayout: {
  //         flexDirection: "column",
  //         alignItems: "flex-start",
  //         gap: "14px",
  //       },
  //     },
  //     {
  //       settings: [
  //         {
  //           label: "Level Requirement",
  //           value: quest?.level || "None",
  //           type: "level",
  //         },
  //         {
  //           label: "Require Review",
  //           value: quest?.requireReview,
  //           type: "boolean",
  //         },
  //         { label: "Active Quest", value: quest?.status === QUEST_STATUSES.OPEN, type: "boolean" },
  //       ],
  //     },

  //     {
  //       settings: [
  //   {
  //     label: "Max Submissions",
  //     value: quest?.maxSubmission || "Unlimited",
  //     type: "text",
  //   },
  //         {
  //           label: "Max Approvals",
  //           value: quest?.maxApproval || "Unlimited",
  //           type: "text",
  //         },
  //         {
  //           label: "Onboarding Quest",
  //           value: quest?.isOnboarding ? "Yes" : "No",
  //           type: "boolean",
  //         },
  //         {
  //           label: "Time Bound",
  //           ...timeboundDate,
  //         },
  //         {
  //           label: "Daily submission",
  //           value: quest?.submissionCooldownPeriod ? "Yes" : "No",
  //           type: "text",
  //         },
  //         {
  //           label: "Conditions",
  //           value: questSettingsConditions?.length > 0 ? questSettingsConditions : "None",
  //           type: questSettingsConditions?.length > 0 ? "questConditions" : "text",
  //         },
  //       ],
  //       showBorder: false,
  //     },
  //   ];

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
            renderHeader={() => <CampaignOverviewHeader title="Quest Information" />}
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
          {/* <QuestResults
            submissions={submissions}
            stats={submissionStats?.getQuestSubmissionStats}
            handleFilterChange={handleFilterChange}
            filter={filter}
            fetchMore={handleFetchMore}
            hasMore={hasMore}
            quest={quest}
          /> */}
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default ViewStoreItem;
