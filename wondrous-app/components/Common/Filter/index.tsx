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
  InlineText,
  FilterValues,
} from './styles';
import { Blue200, Grey250 } from '../../../theme/colors';

/**
 *
 * @param filterSchema ( tabs: [{ name: String, multiChoice: boolean, items: [{ id: String, name: String }] }])
 * @param filter State where this component will store the filter options in the form of { group: { item: boolean }
 * @param setFilter State setter to propagate the filter additions
 * @returns
 */

const Filter = ({ filterSchema = [], filter, setFilter, onChange }) => {
  const [selected, setSelected] = useState(filterSchema[0]);
  const [selectedTabItems, setSelectedTabItems] = useState({});
  const [selectedNames, setSelectedNames] = useState([]);
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
    onChange(newSelectedTabItems);
  };

  const clearItems = () => {
    const newItems = [...items];

    setItems(newItems);
    setSelectedTabItems({});
    setSelectedNames([]);
    onChange({});
  };

  useEffect(() => {
    displayList(filterSchema[0]);
  }, [open]);

  return (
    <FilterHandle open={open}>
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
      <FilterBox open={open}>
        <FilterBoxInner>
          <Tabs tabs={filterSchema} selected={selected?.name} onSelect={(tab) => displayList(tab)} />
          <FilterStatus>
            <FilterCount>{selectedTabItems[selected?.name]?.length || 0} selected</FilterCount>
            <FilterClear onClick={clearItems}>Clear</FilterClear>
          </FilterStatus>
          <FilterItemsContainer>
            <FilterItemList>
              {items.map((item) => {
                const isSelected = (selectedTabItems[selected?.name] || []).includes(item.id);

                return (
                  <FilterItem onClick={() => toggleInFilter(item.id)} selected={isSelected} key={item.id}>
                    <FilterItemIcon>{item.icon}</FilterItemIcon>
                    <FilterItemName>{item.name}</FilterItemName>
                    {item.organization ? <FilterItemOrgIcon>{item.organization.profilePicture}</FilterItemOrgIcon> : ''}
                    {/*<FilterItemCount>{item.count}</FilterItemCount>*/}
                  </FilterItem>
                );
              })}
            </FilterItemList>
          </FilterItemsContainer>
        </FilterBoxInner>
      </FilterBox>
    </FilterHandle>
  );
};

export default Filter;
