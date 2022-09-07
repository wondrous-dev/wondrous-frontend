import React from 'react';
import { TabsProps } from '@mui/material/Tabs/Tabs';

import { StyledTab, StyledTabs } from './styles';

type Props = TabsProps & {
  tabs: Array<{
    value: string;
    label: string;
    content: React.ReactNode | string | undefined;
  }>;
};

const Tabs = ({ tabs, ...props }: Props) => (
  <StyledTabs {...props}>
    {tabs.map((tab) => (
      <StyledTab key={tab.value} value={tab.value} label={tab.label}>
        {tab.content}
      </StyledTab>
    ))}
  </StyledTabs>
);

export default Tabs;
