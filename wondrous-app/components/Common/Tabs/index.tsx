import { Tab } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { StyledTabs } from './styles';

/**
 * Tabs generator
 * @param tabs ({ label: String, action: () => {} })
 * @returns
 */

function Tabs({ selected, tabs = [], onSelect }) {
  return (
    <StyledTabs value={selected}>
      {tabs.map((tab) => (
        <Tab value={tab.name} key={tab.name} label={tab.label} onClick={() => onSelect(tab)} />
      ))}
    </StyledTabs>
  );
}

export default Tabs;
