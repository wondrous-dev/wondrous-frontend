import { useQuery } from "@apollo/client";
import { ButtonBase, Grid, Typography } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import { Title } from "components/Analytics/styles";
import DateRangePicker from "components/Shared/DatePicker";
import { GET_CMTY_ANALYTICS_CARDS } from "graphql/queries";
import { useContext, useState } from "react";
import { filterToDates } from "utils/common";
import { MONTH_DAY_FULL_YEAR } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";
import FiltersComponent from "../Filters";

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
  const { activeOrg } = useContext(GlobalContext);

  const [activeFilter, setActiveFilter] = useState("last_week");

  const [customDates, setCustomDates] = useState({
    startAt: null,
    endAt: null,
  });

  const { data, refetch, loading } = useQuery(GET_CMTY_ANALYTICS_CARDS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId: activeOrg?.id,
      startDate: null,
      endDate: null,
    },
  });

  const config = [
    {
      title: "Community Members",
      value: data?.getCmtyAnalyticsCards?.cmtyMembers,
      allTimeValue: data?.getCmtyAnalyticsCards?.allTimeCmtyMembers,
      bgColor: "#F8642D",
    },
    {
      title: "Quest Completions",
      value: data?.getCmtyAnalyticsCards?.questCompletions,
      allTimeValue: data?.getCmtyAnalyticsCards?.allTimeQuestCompletions,
      bgColor: "#F8AFDB",
    },
    {
      title: "Rewards",
      value: data?.getCmtyAnalyticsCards?.rewards,
      allTimeValue: data?.getCmtyAnalyticsCards?.allTimeRewards,
      bgColor: "#84BCFF",
    },
  ];

  const handleChange = (value) => {
    setActiveFilter(value);
    if (value === "custom") {
      return;
    }
    const { startDate, endDate } = filterToDates(value);
    refetch({
      startDate,
      endDate,
    });
  };

  const handleConfirm = (value) => {
    setCustomDates(value);
    refetch({
      startDate: value.startAt.utcOffset(0).startOf("day").toISOString(),
      endDate: value.endAt.utcOffset(0).endOf("day").toISOString(),
    });
  };

  return (
    <Grid display="flex" flexDirection="column" gap="24px">
      <Grid display="flex" gap="12px" alignItems="flex-start" width="100%">
        <FiltersComponent onChange={handleChange} activeFilter={activeFilter} />
        {activeFilter === "custom" ? (
          <DateRangePicker
            onConfirm={handleConfirm}
            blockPastDates={false}
            ButtonComponent={(props) => (
              <ButtonBase {...props}>
                <CustomTextField
                  disabled
                  placeholder="Select Date Range"
                  value={
                    customDates.startAt && customDates.endAt
                      ? `${customDates.startAt?.format(MONTH_DAY_FULL_YEAR)} - ${customDates.endAt?.format(
                          MONTH_DAY_FULL_YEAR
                        )}`
                      : null
                  }
                />
              </ButtonBase>
            )}
          />
        ) : null}
      </Grid>
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
    </Grid>
  );
};

export default CardsComponent;
