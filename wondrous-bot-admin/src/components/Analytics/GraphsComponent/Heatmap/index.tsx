import { Box, ButtonBase, CircularProgress, Grid, Tooltip, Typography } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import FiltersComponent from "components/Analytics/Filters";
import DateRangePicker from "components/Shared/DatePicker";
import moment from "moment";
import { useMemo, useState } from "react";
import { MONTH_DAY_FULL_YEAR } from "utils/constants";
import { HeatmapCell, HeatmapContainer } from "./styles";

const Cell = ({ counts, date }) => {
  const calcDiff = useMemo(() => {
    const { total = 0, active = 0 } = counts;
    if (total === 0) {
      return {
        opacity: 0.2,
        diff: 'Not enough data'
      };
    }
    const diff = active / total;
    // if(diff < 0.2) {
    //     return 0.3;
    // }
    let opacity = diff;
    if(diff < 0.2) {
        opacity = 0.3
    };
    return {
        opacity,
        diff: `${diff * 100}%`
    }
  }, [counts, date]);


  let bgColor = `rgba(186, 172, 250, ${calcDiff?.opacity})`;

  return (
    <Tooltip
      title={
        <Box>
          <Typography fontFamily="Poppins" fontWeight={600} fontSize="12px" lineHeight="24px" color="white">
            Date: {moment(date).format(MONTH_DAY_FULL_YEAR)}
          </Typography>
          <Typography fontFamily="Poppins" fontWeight={600} fontSize="12px" lineHeight="24px" color="white">
            Active members: {counts?.active}
          </Typography>
          <Typography fontFamily="Poppins" fontWeight={600} fontSize="12px" lineHeight="24px" color="white">
            Total members: {counts?.total}
          </Typography>
          <Typography fontFamily="Poppins" fontWeight={600} fontSize="12px" lineHeight="24px" color="white">
            Active % : {calcDiff?.diff}
          </Typography>
        </Box>
      }
      placement="top"
    >
      <HeatmapCell bgColor={bgColor} />
    </Tooltip>
  );
};

const handleCellNum = (value) => {
  let cellNum = 0;
  if (value === "last_week") {
    cellNum = 3;
  }
  if (value === "last_month") {
    cellNum = 6;
  }
  if (value === "ytd") {
    cellNum = 20;
  }
  return cellNum;
};

const Heatmap = ({ data, loading, refetch }) => {
  const [activeFilter, setActiveFilter] = useState("last_week");
  const [cellsNum, setCellsNum] = useState(handleCellNum("last_week"));
  const [customDates, setCustomDates] = useState({
    startAt: null,
    endAt: null,
  });

  const { labels } = useMemo(() => {
    const labels = data?.map((i) => i.date);
    return {
      labels,
    };
  }, [data]);

  console.log(labels, 'labeeels')
  const filterToDates = (value) => {
    if (value === "last_week") {
      return {
        startDate: moment().subtract(7, "days").utcOffset(0).startOf("day").toISOString(),
        endDate: moment().utcOffset(0).endOf("day").toISOString(),
      };
    }
    if (value === "last_month") {
      return {
        startDate: moment().subtract(1, "months").utcOffset(0).startOf("day").toISOString(),
        endDate: moment().utcOffset(0).endOf("day").toISOString(),
      };
    }
    if (value === "ytd") {
      return {
        startDate: moment().startOf("year").utcOffset(0).startOf("day").toISOString(),
        endDate: moment().utcOffset(0).endOf("day").toISOString(),
      };
    }
    return {
      startDate: moment().subtract(7, "days").utcOffset(0).startOf("day").toISOString(),
      endDate: moment().utcOffset(0).endOf("day").toISOString(),
    };
  };

  const handleChange = (value) => {
    setActiveFilter(value);
    if (value === "custom") {
      return;
    }
    setCellsNum(handleCellNum(value));
    const { startDate, endDate } = filterToDates(value);
    refetch({
      startDate,
      endDate,
    });
  };

  const handleCustomDatesCells = (value) => {
    console.log(value, "VALUE");
    const diffInDays = value.endAt.diff(value.startAt, "days");
    switch (true) {
      case diffInDays < 10:
        return 3;
      case diffInDays < 30:
        return 5;
      case diffInDays < 60:
        return 6;
      case diffInDays < 100:
        return 10;
      case diffInDays < 370:
        return 20;
      case diffInDays < 500:
        return 28;
      case diffInDays < 700:
        return 40;
      case diffInDays < 800:
        return 44;
      case diffInDays < 900:
        return 48;
      case diffInDays < 1000:
        return 52;
      default:
        return 20;
    }
  };

  const handleConfirm = (value) => {
    setCustomDates(value);
    // setData(Array(labelsTestVal("custom", value)).fill(null));
    setCellsNum(handleCustomDatesCells(value));
    refetch({
      startDate: value.startAt.utcOffset(0).startOf("day").toISOString(),
      endDate: value.endAt.utcOffset(0).endOf("day").toISOString(),
    });
  };

  console.log(loading || !data);
  return (
    <Grid
      bgcolor="white"
      borderRadius="16px"
      border={`1px solid #000212`}
      padding="24px"
      width="100%"
      justifyContent="flexStart"
      display="flex"
      flexDirection="column"
      gap="24px"
      alignItems="center"
    >
      <Grid display="flex" gap="12px" alignItems="flex-start" width="100%">
        <FiltersComponent onChange={handleChange} activeFilter={activeFilter} />
        {activeFilter === "custom" ? (
          <DateRangePicker
            onConfirm={handleConfirm}
            blockPastDates={false}
            blockFutureDates={true}
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
      <Typography
        width="100%"
        align="left"
        fontFamily="Poppins"
        fontWeight={600}
        fontSize="16px"
        lineHeight="16px"
        color="black"
      >
        Discord Presence
      </Typography>

      {loading || !data ? (
        <CircularProgress
          size={60}
          thickness={5}
          sx={{
            color: "#2A8D5C",
            animationDuration: "10000ms",
          }}
        />
      ) : (
        <HeatmapContainer cellsNum={cellsNum}>
          {labels.map((label, idx) => (
            <Cell counts={data[idx]?.counts} date={label} key={label}/>
          ))}
        </HeatmapContainer>
      )}
    </Grid>
  );
};

export default Heatmap;
