import React, { useEffect, useRef, useState } from 'react';
import FilterIcon from '../../Icons/filter';
import { Chevron } from '../../Icons/sections';
import Tabs from './Tabs';
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
  FilterButton,
  ButtonsWrapper,
  FilterCheckbox,
  FilterIconWrapper,
} from './styles';
import { Blue200, Grey250 } from '../../../theme/colors';
import { useOutsideAlerter, useFilterQuery } from 'utils/hooks';
import { TaskFilter } from 'types/task';
import _ from 'lodash';
interface IFilterProps {
  filterSchema: any;
  onChange: ({}: TaskFilter) => void;
  currentIdx?: number;
  schemaLength?: number;
  onRemove?: ({}: TaskFilter) => void;
  selected?: any;
  applyFilter?: any;
  key?: number;
}

const Filter = (props: IFilterProps) => {
  const { filterSchema = {}, onChange, currentIdx, schemaLength, onRemove, selected, applyFilter } = props;
  const { query, variables, icon } = filterSchema;
  const [items, setItems] = useState(filterSchema?.items || []);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { isLoading, data } = useFilterQuery(query, variables, open);

  const toggleOpen = () => {
    setOpen(!open);
  };

  useOutsideAlerter(wrapperRef, () => setOpen(false));

  useEffect(() => {
    if (!isLoading && data) {
      const queriedItems = [...data, ...items].map((item) => (icon ? { ...item, icon } : item));
      setItems(_.uniqBy(queriedItems, 'id'));
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
      return;
    }
    handleChange(item);
  };

  const filterExists = typeof selected !== 'undefined';

  const handleChange = (filter, shouldCloseModal = true) => {
    onChange({ [filterSchema.name]: filter });
    if (open) {
      setOpen(!shouldCloseModal);
    }
  };

  const handleRemove = (filter, shouldCloseModal = true) => {
    onRemove(filter);
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
      return;
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
      return;
    }
  }, [selected]);

  const clearItems = () => onRemove(filterSchema.name);

  const FILTER_BUTTONS_CONFIG = [
    {
      label: 'Reset',
      action: () => clearItems(),
      color: Grey250,
      bgColor: '#313131',
    },
    {
      label: 'Apply Filter',
      action: applyFilter,
    },
  ];

  const checkIsSelected = (itemId) => {
    if (filterSchema?.multiChoice) {
      return !!selected?.find((item) => item.id === itemId);
    }
    return selected?.id === itemId;
  };

  const portalDirection = currentIdx === schemaLength - 1 ? 'right' : 'left';

  const displayNames =
    selected && (Array.isArray(selected) ? selected.map((item) => item.name).join(', ') : selected.name);

  const Icon = filterSchema?.icon || FilterIcon;
  return (
    <FilterHandle ref={wrapperRef} open={open}>
      <FilterHandleInner open={open} onClick={toggleOpen}>
        <FilterHandleContainer>
          <FilterValues>
            <Icon style={{ backgroundColor: '#0f0f0f', borderRadius: '6px' }} height="26" width="26" />
            {displayNames ? <InlineText color={Blue200}>{displayNames}</InlineText> : 'Filters'}
          </FilterValues>
        </FilterHandleContainer>
        <FilterChevronContainer className={open ? 'active' : ''}>
          <Chevron stroke="white" />
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
};

export default Filter;
