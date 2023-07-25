import { Box, CircularProgress, Grid, Tooltip, Typography } from "@mui/material";
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
        diff: "Not enough data",
      };
    }
    const diff = active / total;
    let opacity = diff;
    if (diff < 0.2) {
      opacity = 0.3;
    }
    return {
      opacity,
      diff: `${diff * 100}%`,
    };
  }, [counts, date]);

  let bgColor = `rgba(186, 172, 250, ${calcDiff?.opacity})`;

  const config = [
    {
      label: "Date:",
      value: `${moment(counts?.date).format(MONTH_DAY_FULL_YEAR)} ${counts?.hour}:00`,
    },
    {
      label: "Active members:",
      value: counts?.active,
    },
    {
      label: "Total Members:",
      value: counts?.total,
    },
    {
      label: "Active %",
      value: calcDiff?.diff,
    },
  ];

  return (
    <Tooltip
      title={
        <Box>
          {config?.map((item, idx) => {
            return (
              <Typography
                key={idx}
                fontFamily="Poppins"
                fontWeight={600}
                fontSize="12px"
                lineHeight="24px"
                color="white"
              >
                {item.label} {item?.value}
              </Typography>
            );
          })}
        </Box>
      }
      placement="top"
    >
      <HeatmapCell bgColor={bgColor} />
    </Tooltip>
  );
};

const Heatmap = ({ data, loading, refetch }) => {
  const [activeFilter, setActiveFilter] = useState("last_week");
  const [customDates, setCustomDates] = useState({
    startAt: null,
    endAt: null,
  });

  const { dataByHourAndDay, labels, uniqueDates } = useMemo(() => {
    let dataByHourAndDay = {};
    let labels = [];
    let uniqueDates = [];

    data?.forEach((item) => {
      const date = moment(item.date);
      const day = date.day();
      const hour = parseInt(item.hour, 10);
      const key = `${day}-${hour}`;
      if (!uniqueDates.includes(item.date)) {
        uniqueDates.push(item.date);
      }

      labels.push(key);
      dataByHourAndDay[key] = { ...item.counts, date: item.date, hour };
    });

    return { dataByHourAndDay, labels, uniqueDates };
  }, [data]);

  // const handleChange = (value) => {
  //   setActiveFilter(value);
  //   if (value === "custom") {
  //     return;
  //   }
  //   const { startDate, endDate } = filterToDates(value);
  //   refetch({
  //     startDate,
  //     endDate,
  //   });
  // };

  // const handleCustomDatesCells = (value) => {
  //   const diffInDays = value.endAt.diff(value.startAt, "days");
  //   switch (true) {
  //     case diffInDays < 10:
  //       return 3;
  //     case diffInDays < 30:
  //       return 5;
  //     case diffInDays < 60:
  //       return 6;
  //     case diffInDays < 100:
  //       return 10;
  //     case diffInDays < 370:
  //       return 20;
  //     case diffInDays < 500:
  //       return 28;
  //     case diffInDays < 700:
  //       return 40;
  //     case diffInDays < 800:
  //       return 44;
  //     case diffInDays < 900:
  //       return 48;
  //     case diffInDays < 1000:
  //       return 52;
  //     default:
  //       return 20;
  //   }
  // };

  const handleConfirm = (value) => {
    setCustomDates(value);
    // setData(Array(labelsTestVal("custom", value)).fill(null));
    // setCellsNum(handleCustomDatesCells(value));
    refetch({
      startDate: value.startAt.utcOffset(0).startOf("day").toISOString(),
      endDate: value.endAt.utcOffset(0).endOf("day").toISOString(),
    });
  };

  const startDate = uniqueDates[0];
  const endDate = uniqueDates[uniqueDates?.length - 1];

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
        {/* {activeFilter === "custom" ? (
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
        ) : null} */}
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
        Hourly discord presence
      </Typography>

      <Typography
        width="100%"
        align="left"
        fontFamily="Poppins"
        fontWeight={600}
        fontSize="12px"
        lineHeight="12px"
        color="black"
        display={{
          xs: "block",
          sm: "none",
        }}
      >
        {`${moment(startDate)?.format("MM/DD/YY")} - ${moment(endDate)?.format("MM/DD/YY")}`}
      </Typography>
      <Box display="flex" width="100%" justifyContent="flex-start" gap="10px" alignItems="center">
        <Box 
        sx={{
          borderRadius: '6px',
          width: '20px',
          height: '20px',
          background: 'rgba(186, 172, 250, 0.3)'
        }}
        />
        <Typography fontFamily="Poppins" fontWeight={500} fontSize="12px" lineHeight="24px" color="black">
          Least activity
        </Typography>
        <Box 
        sx={{
          borderRadius: '6px',
          width: '20px',
          height: '20px',
          background: 'rgba(186, 172, 250, 1)'
        }}
        />
        <Typography fontFamily="Poppins" fontWeight={500} fontSize="12px" lineHeight="24px" color="black">
          Most activity
        </Typography>
      </Box>

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
        <Grid display="flex" width="100%" height="80%" paddingTop="4rem" paddingBottom="4rem" gap="12px">
          <Grid
            gap="4px"
            display={{
              xs: "none",
              sm: "grid",
            }}
          >
            {uniqueDates?.map((date, idx) => (
              <Typography
                fontSize="12px"
                fontFamily="Poppins"
                fontWeight={600}
                color="black"
                display="flex"
                key={`${date}`}
                alignItems="center"
              >
                {moment(date)?.format("MM/DD")}
              </Typography>
            ))}
          </Grid>
          <HeatmapContainer>
            {labels.map((label) => (
              <Cell counts={dataByHourAndDay[label]} date={label} key={label} />
            ))}
          </HeatmapContainer>
        </Grid>
      )}
    </Grid>
  );
};

export default Heatmap;
