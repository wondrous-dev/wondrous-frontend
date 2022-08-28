import React from 'react';
import { TabsProps } from '@mui/material/Tabs/Tabs';

import { StyledTab, StyledTabs } from './styles';

type Props = TabsProps & {
  tabs: Array<{
    value: string;
    label: string;
  }>;
};

const Tabs = ({ tabs, ...props }: Props) => (
  <StyledTabs {...props}>
    {tabs.map((tab) => (
      <StyledTab key={tab.value} value={tab.value} label={tab.label} />
    ))}
  </StyledTabs>
);

export default Tabs;
