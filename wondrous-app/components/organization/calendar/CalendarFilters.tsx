import React, { useState, useContext } from 'react';
import omit from 'lodash/omit';

import FilterIcon from 'components/Icons/filter';
import FilterItem from 'components/Common/Filter';
import { useBoards, useExploreGr15TasksAndBounties } from 'utils/hooks';
import { IsMobileContext } from 'utils/contexts';
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

interface AppliedFilterProps {
  appliedFilters: any;
  handleFilterPill: (item: any, key: string) => void;
}

const Item = ({ Icon, value, handleFilterPill, filterType }) => (
  <AppliedFiltersItem>
    {Icon ? (
      <AppliedFiltersIconWrapper>
        <Icon style={{ margin: 0 }} width="100%" height="100%" />
      </AppliedFiltersIconWrapper>
    ) : null}
    {value.name}
    <CloseIcon onClick={() => handleFilterPill(value, filterType)} />
  </AppliedFiltersItem>
);

const AppliedFilter = ({ appliedFilters, handleFilterPill }: AppliedFilterProps) => (
  <>
    {Object.entries(appliedFilters).map(([filterType, value]: any, idx) => {
      if (Array.isArray(value)) {
        return value.map((item, idx) => {
          const Icon = item?.pillIcon;
          return item && <Item Icon={Icon} value={item} handleFilterPill={handleFilterPill} filterType={filterType} />;
        });
      }
      const Icon = value?.pillIcon;
      return value ? (
        <Item Icon={Icon} value={value} handleFilterPill={handleFilterPill} filterType={filterType} />
      ) : null;
    })}
  </>
);

export function CalendarFiltersTriggerButton({ onClick, isOpen }) {
  const isMobile = useContext(IsMobileContext);

  const exploreGr15TasksAndBounties = useExploreGr15TasksAndBounties();
  if (exploreGr15TasksAndBounties) return null;
  return (
    <Button className={`FiltersTrigger-button ${isOpen ? 'active' : ''}`} reversed onClick={onClick}>
      <FilterIcon stroke="white" />
      {isMobile ? null : 'Add filters'}
    </Button>
  );
}

const generateDefaultFiltersState = (filters, filterSchema) => {
  const activeFilters = Object.keys(filters).filter((filterKey) => !!filters[filterKey]?.length);

  const activeSchema = filterSchema?.filter((schema) => activeFilters.includes(schema.name));

  return activeSchema.reduce((acc, next) => {
    acc[next.name] = next?.items?.filter((item) => filters[next.name].includes(item.id));
    return acc;
  }, {});
};

const CalendarFilters = ({ filterSchema, onChange, showAppliedFilters = false }) => {
  const {
    board: { filters },
  } = useBoards();

  const calendarFilters = filters || {};
  const [appliedFilters, setAppliedFilters] = useState<any>(generateDefaultFiltersState(calendarFilters, filterSchema));

  console.log(appliedFilters, '--------appliedFilters')

  const applyFilter = (filters) => {
    setAppliedFilters(filters);
    const newFilters: any = Object.keys(filters).reduce((acc, next) => {
      const value = Array.isArray(filters[next]) ? filters[next].map((item) => item.id) : filters[next]?.id;

      acc[next] = value;
      return acc;
    }, {});
    onChange(newFilters);
  };

  const handleFilterChange = (filter) => {
    const newFilters = { ...appliedFilters, ...filter };
    applyFilter(newFilters);
  };

  const removeAppliedFilter = (filter) => {
    const newFilters = omit(appliedFilters, filter);
    applyFilter(newFilters);
  };

  const handleFilterPill = (filter, filterType) => {
    if (Array.isArray(appliedFilters[filterType])) {
      const newItems = appliedFilters[filterType].filter((item) => item.id !== filter.id);
      if (!newItems?.length) return removeAppliedFilter(filterType);
      const newFilters = { ...appliedFilters, [filterType]: newItems };
      return applyFilter(newFilters);
    }
    return removeAppliedFilter(filterType);
  };

  const clearAll = () => {
    setAppliedFilters({});
    onChange({ taskTypes: [] });
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
      {!!Object.keys(appliedFilters)?.length && showAppliedFilters && (
        <AppliedFiltersWrapper>
          <AppliedFilter appliedFilters={appliedFilters} handleFilterPill={handleFilterPill} />
          <ClearButton onClick={clearAll}>Clear all</ClearButton>
        </AppliedFiltersWrapper>
      )}
    </BoardFiltersContainer>
  );
};

export default CalendarFilters;
