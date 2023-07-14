import SelectComponent from "components/Shared/Select";
import { useState } from "react";

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

const FiltersComponent = ({ onChange, activeFilter }) => {
  const handleOnChange = (val) => {
    onChange(val);
  };
  return <SelectComponent options={OPTIONS} value={activeFilter} onChange={(val) => handleOnChange(val)} />;
};

export default FiltersComponent;
