import { HeaderButton } from 'components/organization/wrapper/styles';
import FilterIcon from 'components/Icons/filter';
import FilterItem from 'components/Common/Filter';
import { BoardFiltersWrapper, BoardFiltersContainer, AppliedFiltersWrapper, AppliedFiltersItem } from './styles';
import { useState } from 'react';
import _ from 'lodash';

export const FiltersTriggerButton = ({ onClick }) => {
  return (
    <HeaderButton reversed onClick={onClick}>
      <FilterIcon stroke="white" />
      Filters
    </HeaderButton>
  );
};

export default function BoardFilters({ filterSchema, onChange, showAppliedFilters = false }) {
  const [appliedFilters, setAppliedFilters] = useState({});

  const applyFilter = (filters) => {
    const newFilters: any = Object.keys(filters).reduce((acc, next) => {
      let value = Array.isArray(filters[next]) ? filters[next].map((item) => item.id) : filters[next].id;
      acc[next] = value;
      return acc;
    }, {});
    onChange(newFilters);
  };

  const handleFilterChange = (filter) => {
    const newFilters = { ...appliedFilters, ...filter };
    setAppliedFilters(newFilters);
    applyFilter(newFilters);
  };

  const removeAppliedFilter = (filter) => {
    const newFilters = _.omit(appliedFilters, filter);
    setAppliedFilters(newFilters);
  };

  const appliedFiltersMap = Object.keys(appliedFilters).reduce((acc, next) => {
    if (Array.isArray(appliedFilters[next])) {
      acc = [...acc, ...appliedFilters[next]];
      return acc;
    }
    acc = [...acc, appliedFilters[next]];
    return acc;
  }, []);

  const handleFilterPill = (filter) => {
    if (Array.isArray(appliedFilters[filter.filterType])) {
      const newItems = appliedFilters[filter.filterType].filter((item) => item.id !== filter.id);
      const newFilters = { ...appliedFilters, [filter.filterType]: newItems };
      setAppliedFilters(newFilters);
      return applyFilter(newFilters);
    }
    removeAppliedFilter(filter.filterType);
  };

  return (
    <BoardFiltersContainer>
      <BoardFiltersWrapper>
        {filterSchema.map((filter, idx) => {
          return (
            <FilterItem
              key={idx}
              schemaLength={filterSchema.length}
              currentIdx={idx}
              selected={appliedFilters[filter.name]}
              filterSchema={filter}
              onChange={handleFilterChange}
              onRemove={removeAppliedFilter}
              applyFilter={applyFilter}
            />
          );
        })}
      </BoardFiltersWrapper>
      {!!appliedFiltersMap.length && showAppliedFilters && (
        <AppliedFiltersWrapper>
          {appliedFiltersMap.map((filter, idx) => (
            <AppliedFiltersItem onClick={() => handleFilterPill(filter)} key={idx}>
              {filter.name}
            </AppliedFiltersItem>
          ))}
        </AppliedFiltersWrapper>
      )}
    </BoardFiltersContainer>
  );
}
