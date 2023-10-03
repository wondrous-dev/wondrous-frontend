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

const FiltersComponent = ({ onChange, activeFilter, options = OPTIONS, defaultLabel = '' }) => {
  return <SelectComponent defaultLabel={defaultLabel} options={options} value={activeFilter} onChange={onChange} />;
};

export default FiltersComponent;
