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
  FilterStatus,
  FilterCount,
  FilterClear,
  FilterItemsContainer,
  FilterItemList,
  FilterItem,
  FilterItemIcon,
  FilterItemName,
  FilterItemCount,
  FilterItemListShade,
  FilterItemOrgIcon,
  InlineText,
  FilterValues,
  FilterBoxPortal,
  FilterButton,
  ButtonsWrapper,
  FilterCheckbox,
} from './styles';
import { Blue200, Grey250 } from '../../../theme/colors';
import { useOutsideAlerter, useFilterQuery } from 'utils/hooks';
import { TaskFilter } from 'types/task';

interface IFilterProps {
  filterSchema: any;
  onChange: ({}: TaskFilter) => void;
  statuses: String[];
  podIds: String[];
  currentIdx?: number;
  schemaLength?: number;
  query?: any;
  variables?: any;
  icon?: any;
}

//TODO refactor this
const Filter = (props: IFilterProps) => {
  const {
    filterSchema = [],
    onChange,
    statuses = [],
    podIds = [],
    currentIdx,
    schemaLength,
    query,
    variables,
    icon,
  } = props;
  const [selected, setSelected] = useState(filterSchema[0]);
  const [selectedTabItems, setSelectedTabItems] = useState({});
  const [selectedNames, setSelectedNames] = useState([]);
  const [items, setItems] = useState([]);
  const [multiChoice, setMultichoice] = useState(true);
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
      setItems(queriedItems);
    }
  }, [isLoading]);

  // Changes the display list.
  const displayList = (tab) => {
    if (tab) {
      setItems(tab.items);
      setMultichoice(tab.multiChoice);
    }
    setSelected(tab);
  };

  // adds / removes an item from the filter
  const toggleInFilter = (itemId) => {
    const selectedItems = [...(selectedTabItems[selected.name] || [])];
    const newItems = [...items];
    newItems.forEach((it) => {
      const deselect = () => {
        const index = selectedItems.indexOf(it.id);
        const nameIndex = selectedNames.indexOf(it.name);

        if (index > -1) {
          selectedItems.splice(index, 1);
        }

        if (nameIndex > -1) {
          selectedNames.splice(index, 1);
        }
      };

      if (it.id === itemId) {
        const selected = selectedItems.includes(itemId);

        if (!selected) {
          selectedNames.push(it.name);
          selectedItems.push(itemId);
        } else {
          deselect();
        }
      } else if (!multiChoice) {
        deselect();
      }
    });

    const newSelectedTabItems = { ...selectedTabItems, [selected.name]: selectedItems };
    setItems(newItems);
    setSelectedTabItems(newSelectedTabItems);
    setSelectedNames(selectedNames);
  };

  const clearItems = () => {
    const newItems = [...items];
    setItems(newItems);
    setSelectedTabItems({});
    setSelectedNames([]);
    onChange({
      statuses: [],
      podIds: [],
    });
  };

  const applyFilters = () => onChange(selectedTabItems);

  const FILTER_BUTTONS_CONFIG = [
    {
      label: 'Reset',
      action: () => clearItems(),
      color: Grey250,
      bgColor: '#313131',
    },
    {
      label: 'Apply Filter',
      action: applyFilters,
    },
  ];

  useEffect(() => {
    displayList(filterSchema[0]);
  }, [open]);

  useEffect(() => {
    setSelectedTabItems({
      statuses,
      podIds,
    });
    const selectedNames = filterSchema
      .flatMap((item) => item.items.filter((it) => [...podIds, ...statuses].includes(it.id)))
      .map((i) => i.name);
    setSelectedNames(selectedNames);
  }, [statuses, podIds, filterSchema]);

  const portalDirection = currentIdx === schemaLength - 1 ? 'right' : 'left';
  return (
    <FilterHandle ref={wrapperRef} open={open}>
      <FilterHandleInner open={open} onClick={toggleOpen}>
        <FilterHandleContainer>
          {selectedNames.length ? (
            <FilterValues>
              <InlineText color={Grey250}>Filter:&nbsp;</InlineText>
              <InlineText color={Blue200}>{selectedNames.join(', ')}</InlineText>
            </FilterValues>
          ) : open ? (
            `<Filter>`
          ) : (
            <>
              <FilterIcon /> &nbsp; Filter
            </>
          )}
        </FilterHandleContainer>
        <FilterChevronContainer className={open ? 'active' : ''}>
          <Chevron />
        </FilterChevronContainer>
      </FilterHandleInner>
      {open && (
        <FilterBoxPortal container={wrapperRef.current}>
          <FilterBox renderDirection={portalDirection}>
            <FilterBoxInner>
              <Tabs tabs={filterSchema} selected={selected?.name} onSelect={(tab) => displayList(tab)} />

              <FilterItemsContainer>
                <FilterItemList>
                  {selected?.renderList
                    ? selected.renderList({ selectedTab: selected, selectedTabItems, toggleInFilter, items })
                    : items.map((item) => {
                        const isSelected = (selectedTabItems[selected?.name] || []).includes(item.id);

                        return (
                          <FilterItem
                            gradient={item?.gradient}
                            onClick={() => toggleInFilter(item.id)}
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
              <ButtonsWrapper>
                {FILTER_BUTTONS_CONFIG.map((button, idx) => (
                  <FilterButton type="button" key={idx} onClick={button.action} {...button}>
                    {button.label}
                  </FilterButton>
                ))}
              </ButtonsWrapper>
            </FilterBoxInner>
          </FilterBox>
        </FilterBoxPortal>
      )}
    </FilterHandle>
  );
};

export default Filter;
