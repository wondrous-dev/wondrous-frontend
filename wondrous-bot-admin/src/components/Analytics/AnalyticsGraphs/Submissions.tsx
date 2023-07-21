import { ButtonBase, Grid } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import DateRangePicker from "components/Shared/DatePicker";
import moment from "moment";
import { useMemo, useState } from "react";
import { filterToDates } from "utils/common";
import { MONTH_DAY_FULL_YEAR } from "utils/constants";
import FiltersComponent from "../Filters";
import LineBarChart from "../GraphsComponent/LineBarChart";
import getSubmissionsData from "../utils/getSubmissionsData";

const SubmissionsGraph = ({ data, refetch, loading }) => {
  const [activeFilter, setActiveFilter] = useState("last_week");

  const submissionsData = useMemo(() => {
    if (loading || !data) return null;

    return getSubmissionsData(data, activeFilter);
  }, [data, activeFilter, loading]);

  const [customDates, setCustomDates] = useState({
    startAt: null,
    endAt: null,
  });

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
    <LineBarChart
      title="Quest Submissions"
      data={submissionsData}
      renderComponents={() => (
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
      )}
    />
  );
};

export default SubmissionsGraph;
