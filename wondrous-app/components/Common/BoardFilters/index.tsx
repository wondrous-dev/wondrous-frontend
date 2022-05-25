import { HeaderButton } from 'components/organization/wrapper/styles';
import FilterIcon from 'components/Icons/filter';
import FilterItem from 'components/Common/Filter';
import { BoardFiltersWrapper } from './styles';
import { useState } from 'react';

export const FiltersTriggerButton = ({ onClick }) => {
  return (
    <HeaderButton reversed onClick={onClick}>
      <FilterIcon stroke="white" />
      Filters
    </HeaderButton>
  );
};

export default function BoardFilters({ filterSchema, onChange, statuses, podIds }) {
  const [appliedFilters, setAppliedFilters] = useState({});

  const handleFilterChange = (filter) => {
    console.log(filter);
  };

  return (
    <BoardFiltersWrapper>
      {filterSchema.map((filter, idx) => {
        return (
          <FilterItem
            key={idx}
            schemaLength={filterSchema.length}
            currentIdx={idx}
            filterSchema={[filter]}
            onChange={handleFilterChange}
            statuses={statuses}
            podIds={podIds}
            {...filter}
          />
        );
      })}
    </BoardFiltersWrapper>
  );
}
