import React, { useEffect, useRef, useState } from 'react';
import { useOutsideAlerter, useFilterQuery } from 'utils/hooks';
import { TaskFilter } from 'types/task';
import uniqBy from 'lodash/uniqBy';
import FilterIcon from '../../Icons/filter';
import { ChevronFilled } from '../../Icons/sections';
import {
  FilterHandle,
  FilterHandleInner,
  FilterHandleContainer,
  FilterChevronContainer,
  FilterBox,
  FilterBoxInner,
  FilterItemsContainer,
  FilterItemList,
  FilterItem,
  FilterItemIcon,
  FilterItemName,
  FilterItemOrgIcon,
  InlineText,
  FilterValues,
  FilterBoxPortal,
  FilterCheckbox,
} from './styles';

interface IFilterProps {
  filterSchema: any;
  onChange: ({}: TaskFilter) => void;
  currentIdx?: number;
  schemaLength?: number;
  onRemove?: ({}: TaskFilter) => void;
  selected?: any;
  key?: number;
  withSearch?: boolean;
}

function Filter(props: IFilterProps) {
  const { filterSchema = {}, onChange, currentIdx, schemaLength, onRemove, selected, withSearch = false } = props;
  const { query, variables } = filterSchema;
  const [items, setItems] = useState(filterSchema?.items || []);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { isLoading, data } = useFilterQuery(query, variables, open);

  const toggleOpen = () => {
    if (!filterSchema?.disabled) setOpen(!open);
  };

  useOutsideAlerter(wrapperRef, () => setOpen(false));

  useEffect(() => {
    setItems(filterSchema?.items);
  }, [filterSchema]);

  useEffect(() => {
    if (!isLoading && data) {
      const queriedItems = [...data, ...items];
      const mutatedItems = filterSchema?.mutate ? filterSchema.mutate(queriedItems) : queriedItems;
      setItems(uniqBy(mutatedItems, 'id'));
    }
  }, [isLoading]);

  const filterItems = (item, selected) => {
    if (selected.find((i) => i.id === item.id)) {
      return selected.filter((i) => i.id !== item.id);
    }
    return [...selected, item];
  };

  const toggleOption = (item) => {
    if (filterSchema?.multiChoice) {
      const selectedItems = selected ? filterItems(item, selected) : [item];
      handleChange(selectedItems, false);
      return;
    }
    if (item.id === selected?.id) {
      handleChange(null);
    } else handleChange(item);
  };

  const filterExists = typeof selected !== 'undefined';

  const handleChange = (filter, shouldCloseModal = true) => {
    onChange({ [filterSchema.name]: filter });
    if (open) {
      setOpen(!shouldCloseModal);
    }
  };

  const handleRemove = (filter, shouldCloseModal = true) => {
    if (onRemove) {
      onRemove(filter);
    }
    if (open) {
      setOpen(!shouldCloseModal);
    }
  };

  const removeFilterFromMultiChoice = (selected) => {
    if (!selected && filterExists) {
      handleRemove(filterSchema.name, false);
      return;
    }
    if (selected) {
      handleChange(selected, false);
    }
  };

  useEffect(() => {
    if (filterSchema?.multiChoice) {
      removeFilterFromMultiChoice(selected);
      return;
    }
    if (selected) {
      handleChange(selected);
      return;
    }
    if (!selected && filterExists) {
      handleRemove(filterSchema.name);
    }
  }, [selected]);

  const clearItems = () => onRemove(filterSchema.name);

  const checkIsSelected = (itemId) => {
    if (filterSchema?.multiChoice) {
      return !!selected?.find((item) => item.id === itemId);
    }
    return selected?.id === itemId;
  };

  const portalDirection = currentIdx === schemaLength - 1 ? 'right' : 'left';

  const displayNames =
    selected && (Array.isArray(selected) ? (selected?.length ? `${selected.length} selected` : null) : selected.name);

  const Icon = filterSchema?.icon || FilterIcon;

  return (
    <FilterHandle ref={wrapperRef} open={open}>
      <FilterHandleInner open={open} className={filterSchema?.disabled ? 'disabled' : ''} onClick={toggleOpen}>
        <FilterHandleContainer>
          <FilterValues>
            <Icon style={{ backgroundColor: '#0f0f0f', borderRadius: '6px' }} height="26" width="26" />
            {displayNames ? (
              <InlineText>{`${filterSchema?.label ? `${filterSchema?.label}: ` : ''} ${displayNames}`}</InlineText>
            ) : (
              filterSchema?.label || 'Filters'
            )}
          </FilterValues>
        </FilterHandleContainer>
        <FilterChevronContainer className={open ? 'active' : ''}>
          <ChevronFilled stroke="#4B4B4B" />
        </FilterChevronContainer>
      </FilterHandleInner>
      {open && (
        <FilterBoxPortal container={wrapperRef.current}>
          <FilterBox renderDirection={portalDirection}>
            <FilterBoxInner>
              <FilterItemsContainer>
                <FilterItemList>
                  {filterSchema.renderList
                    ? filterSchema.renderList({ schema: filterSchema, selected, toggleOption, checkIsSelected })
                    : items.map((item) => {
                        const isSelected = checkIsSelected(item.id);

                        return (
                          <FilterItem
                            borderColor={item?.color}
                            gradient={item?.gradient}
                            onClick={() => toggleOption({ ...item, filterType: filterSchema.name })}
                            selected={isSelected}
                            key={item.id}
                          >
                            <FilterItemIcon>{item.icon}</FilterItemIcon>
                            <FilterItemName isSelected={isSelected}>{item.name}</FilterItemName>
                            {item.organization ? (
                              <FilterItemOrgIcon>{item.organization.profilePicture}</FilterItemOrgIcon>
                            ) : (
                              ''
                            )}
                            <FilterCheckbox checked={isSelected} />
                          </FilterItem>
                        );
                      })}
                </FilterItemList>
              </FilterItemsContainer>
            </FilterBoxInner>
          </FilterBox>
        </FilterBoxPortal>
      )}
    </FilterHandle>
  );
}

export default Filter;
