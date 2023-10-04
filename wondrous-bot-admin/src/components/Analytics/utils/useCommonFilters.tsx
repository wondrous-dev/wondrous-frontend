import { ButtonBase } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import DateRangePicker from "components/Shared/DatePicker";
import { useMemo, useState } from "react";
import { filterToDates } from "utils/common";
import { MONTH_DAY_FULL_YEAR } from "utils/constants";

const OPTIONS = [
  {
    label: "Last Week",
    value: "last_week",
  },
  {
    label: "Last Month",
    value: "last_month",
  },
  {
    label: "YTD",
    value: "ytd",
  },
  {
    label: "Custom",
    value: "custom",
  },
];

export const useCommonFilters = ({ refetch, quests }) => {
  const [activeFilters, setActiveFilters] = useState({
    timestamp: "last_week",
    questId: null,
  });


  const [customDates, setCustomDates] = useState({
    startAt: null,
    endAt: null,
  });


  const handleConfirm = (value) => {
    setCustomDates(value);
    refetch({
      startDate: value?.startAt?.utcOffset(0)?.startOf("day")?.toISOString(),
      endDate: value?.endAt?.utcOffset(0)?.endOf("day")?.toISOString(),
    });
  };


  const questOptions = useMemo(() => {
    return quests?.getQuestsForOrg?.map((quest) => ({
      label: quest.title,
      value: quest.id,
    }));
  }, [quests]);

  const handleChange = (value, key) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    if (value === "custom") {
      return;
    }
    let filterValues = {};
    if (key === "timestamp") {
      const { startDate, endDate } = filterToDates(value);
      filterValues = {
        ...filterValues,
        startDate,
        endDate,
      };
    } else {
      filterValues = {
        ...filterValues,
        [key]: value,
      };
    }
    refetch(filterValues);
  };

  const config = [
    {
      defaultLabel: "Select Time Period",
      options: OPTIONS,
      key: "timestamp",
    },
    {
      display: activeFilters?.timestamp === "custom",
      component: () => <DateRangePicker
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
    },
    {
      defaultLabel: "Select Quest",
      options: questOptions,
      key: "questId",
    },
  ];
  return {
    handleChange,
    config,
    activeFilters,
  };
};
