import { Grid, Typography } from "@mui/material";
import { Title } from "components/Analytics/styles";

interface IStats {
  cmtyMembers: number;
  allTimeCmtyMembers: number;
  questCompletions: number;
  allTimeQuestCompletions: number;
  rewards: number;
  allTimeRewards: number;
}

interface IProps {
  stats: IStats;
}

const CardsComponent = ({ stats }: IProps) => {
  const config = [
    {
      title: "Community Members",
      value: stats.cmtyMembers,
      allTimeValue: stats.allTimeCmtyMembers,
      bgColor: "#F8642D",
    },
    {
      title: "Quest Completions",
      value: stats.questCompletions,
      allTimeValue: stats.allTimeQuestCompletions,
      bgColor: "#F8AFDB",
    },
    {
      title: "Rewards",
      value: stats.rewards,
      allTimeValue: stats.allTimeRewards,
      bgColor: "#84BCFF",
    },
  ];

  return (
    <Grid
      display="flex"
      alignItems="center"
      gap="24px"
      flexWrap="nowrap"
      flexDirection={{
        xs: "column",
        md: "row",
      }}
    >
      {config.map((item, idx) => (
        <Grid
          display="flex"
          flexDirection="column"
          border={`1px solid #000212`}
          bgcolor={item.bgColor}
          flex="1"
          width="100%"
          alignItems="flex-start"
          justifyContent="flex-start"
          gap="32px"
          padding="24px"
          borderRadius="16px"
        >
          <Title>{item.title}</Title>
          <Title fontSize="48px">{item.value}</Title>
          <Title>{item.allTimeValue} all time</Title>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardsComponent;
