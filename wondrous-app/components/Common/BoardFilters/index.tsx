import { HeaderButton } from 'components/organization/wrapper/styles';
import FilterIcon from 'components/Icons/filter';
import FilterItem from 'components/Common/Filter';
import {
  BoardFiltersWrapper,
  BoardFiltersContainer,
  AppliedFiltersWrapper,
  AppliedFiltersItem,
  Button,
  ClearButton,
  CloseIcon,
  AppliedFiltersIconWrapper,
} from './styles';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
export const FiltersTriggerButton = ({ onClick, isOpen }) => {
  return (
    <Button className={isOpen ? 'active' : ''} reversed onClick={onClick}>
      <FilterIcon stroke="white" />
      Add filters
    </Button>
  );
};

export default function BoardFilters({ filterSchema, onChange, showAppliedFilters = false }) {
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const board = useOrgBoard() || usePodBoard();

  const entityType = board?.entityType;

  const applyFilter = (filters) => {
    setAppliedFilters(filters);
    const newFilters: any = Object.keys(filters).reduce((acc, next) => {
      let value = Array.isArray(filters[next]) ? filters[next].map((item) => item.id) : filters[next]?.id;
      acc[next] = value;
      return acc;
    }, {});
    onChange(newFilters);
  };

  useEffect(() => {
    if (Object.keys(appliedFilters)) setAppliedFilters({});
  }, [entityType]);

  const handleFilterChange = (filter) => {
    const newFilters = { ...appliedFilters, ...filter };
    applyFilter(newFilters);
  };

  const removeAppliedFilter = (filter) => {
    const newFilters = _.omit(appliedFilters, filter);
    applyFilter(newFilters);
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
      return applyFilter(newFilters);
    }
    removeAppliedFilter(filter.filterType);
  };

  const clearAll = () => {
    setAppliedFilters({});
    onChange({});
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
            />
          );
        })}
      </BoardFiltersWrapper>
      {!!appliedFiltersMap.length && showAppliedFilters && (
        <AppliedFiltersWrapper>
          {appliedFiltersMap.map((filter, idx) => {
            const Icon = filter?.pillIcon;
            return (
              filter && (
                <AppliedFiltersItem key={idx}>
                  <AppliedFiltersIconWrapper>
                    <Icon style={{ margin: 0 }} width="100%" height="100%" />
                  </AppliedFiltersIconWrapper>
                  {filter.name}
                  <CloseIcon onClick={() => handleFilterPill(filter)} />
                </AppliedFiltersItem>
              )
            );
          })}
          <ClearButton onClick={clearAll}>Clear all</ClearButton>
        </AppliedFiltersWrapper>
      )}
    </BoardFiltersContainer>
  );
}
