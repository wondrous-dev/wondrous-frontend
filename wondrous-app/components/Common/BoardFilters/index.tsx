import FilterIcon from 'components/Icons/filter';
import FilterItem from 'components/Common/Filter';
import React, { useEffect, useState } from 'react';
import omit from 'lodash/omit';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
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

export function FiltersTriggerButton({ onClick, isOpen }) {
  return (
    <Button className={isOpen ? 'active' : ''} reversed onClick={onClick}>
      <FilterIcon stroke="white" />
      Add filters
    </Button>
  );
}

export default function BoardFilters({ filterSchema, onChange, showAppliedFilters = false }) {
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard;

  const entityType = board?.entityType;

  const applyFilter = (filters) => {
    setAppliedFilters(filters);
    const newFilters: any = Object.keys(filters).reduce((acc, next) => {
      const value = Array.isArray(filters[next]) ? filters[next].map((item) => item.id) : filters[next]?.id;

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
    const newFilters = omit(appliedFilters, filter);
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
        {filterSchema.map((filter, idx) => (
          <FilterItem
            key={idx}
            schemaLength={filterSchema.length}
            currentIdx={idx}
            selected={appliedFilters[filter.name]}
            filterSchema={filter}
            onChange={handleFilterChange}
            onRemove={removeAppliedFilter}
          />
        ))}
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
