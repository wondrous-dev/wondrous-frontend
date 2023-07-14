import { Grid } from "@mui/material";
import PageHeader from "components/PageHeader";
import PageWrapper from "components/Shared/PageWrapper";
import { useContext } from "react";
import GlobalContext from "utils/context/GlobalContext";
import CardsComponent from "./Cards";

const AnalyticsComponent = () => {
  const { activeOrg } = useContext(GlobalContext);

  const cardsStats = {
    cmtyMembers: 1201,
    allTimeCmtyMembers: 1888,
    questCompletions: 100,
    allTimeQuestCompletions: 202,
    rewards: 50,
    allTimeRewards: 70,

  }
  return (
    <>
      <PageHeader title="Analytics" withBackButton={true} />
      <Grid
        minHeight="100vh"
        sx={{
          backgroundColor: "#BAACFA",
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
        <CardsComponent stats={cardsStats}/>
      </Grid>
    </>
  );
};

export default AnalyticsComponent;
