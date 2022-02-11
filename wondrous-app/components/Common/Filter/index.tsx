import React, { useEffect, useState } from 'react';
import FilterIcon from '../../Icons/filter';
import { Chevron } from '../../Icons/sections';
import Tabs from '../Tabs';
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
} from './styles';

/**
 *
 * @param filterSchema ( tabs: [{ name: String, multiChoice: boolean, items: [{ id: String, name: String }] }])
 * @param filter State where this component will store the filter options in the form of { group: { item: boolean }
 * @param setFilter State setter to propagate the filter additions
 * @returns
 */

const Filter = ({ filterSchema = [], filter, setFilter, onChange }) => {
  const [selected, setSelected] = useState(null);
  const [selectedTabItems, setSelectedTabItems] = useState({});
  const [items, setItems] = useState([]);
  const [multiChoice, setMultichoice] = useState(true);
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

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
      if (!multiChoice) {
        it.selected = false;

        const index = selectedItems.indexOf(it.name);

        if (index > -1) {
          selectedItems.splice(index, 1);
        }
      }
      if (it.id === itemId) {
        it.selected = !it.selected;

        if (it.selected) {
          selectedItems.push(itemId);
        } else {
          const index = selectedItems.indexOf(itemId);
          if (index > -1) {
            selectedItems.splice(index, 1);
          }
        }
      }
    });

    const newSelectedTabItems = { ...selectedTabItems, [selected.name]: selectedItems };
    setItems(newItems);
    setSelectedTabItems(newSelectedTabItems);
    onChange(newSelectedTabItems);
  };

  const setFilterList = () => {
    filterSchema.map((tab) => {
      tab.action = () => {
        console.log('Tab ' + tab.name + ' pressed.');
        displayList(tab);
      };
    });
  };

  const clearItems = () => {
    const newItems = [...items];
    newItems.map((it) => {
      it.selected = false;
    });
    setItems(newItems);

    const newSelectedTabItems = { ...selectedTabItems, [selected.name]: [] };
    setSelectedTabItems(newSelectedTabItems);
    onChange(newSelectedTabItems);
  };

  useEffect(() => {
    setFilterList();
    displayList(filterSchema[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setFilterList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <FilterHandle open={open}>
      <FilterHandleInner open={open} onClick={toggleOpen}>
        <FilterHandleContainer>
          {open ? (
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
      <FilterBox open={open}>
        <FilterBoxInner>
          <Tabs tabs={filterSchema} selected={selected?.name} />
          <FilterStatus>
            <FilterCount>{items.filter((i) => i.selected).length} selected</FilterCount>
            <FilterClear onClick={clearItems}>Clear</FilterClear>
          </FilterStatus>
          <FilterItemsContainer>
            <FilterItemList>
              {items.map((item) => (
                <FilterItem
                  onClick={() => {
                    toggleInFilter(item.id);
                  }}
                  selected={item.selected}
                  key={item.id}
                >
                  <FilterItemIcon>{item.icon}</FilterItemIcon>
                  <FilterItemName>{item.name}</FilterItemName>
                  {item.organization ? <FilterItemOrgIcon>{item.organization.profilePicture}</FilterItemOrgIcon> : ''}
                  <FilterItemCount>{item.count}</FilterItemCount>
                </FilterItem>
              ))}
            </FilterItemList>
          </FilterItemsContainer>
        </FilterBoxInner>
      </FilterBox>
    </FilterHandle>
  );
};

export default Filter;
