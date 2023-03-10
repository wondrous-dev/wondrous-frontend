import Tab from '@mui/material/Tab';
import React from 'react';
import { TabsProps } from '@mui/material/Tabs/Tabs';

import { StyledTabs, styles } from './styles';

type Props = TabsProps & {
  $withMargin?: boolean;
  tabs: Array<{
    value: string;
    label: string;
  }>;
};

const Tabs = ({ tabs, ...props }: Props) => (
  <StyledTabs {...props}>
    {tabs.map((tab) => (
      <Tab sx={styles.tab} key={tab.value} value={tab.value} label={tab.label} />
    ))}
  </StyledTabs>
);

Tabs.defaultProps = {
  $withMargin: true,
};

export default Tabs;
