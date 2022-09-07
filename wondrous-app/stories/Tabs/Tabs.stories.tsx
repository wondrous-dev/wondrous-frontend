import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TabsComp from 'components/Tabs';

export default {
  title: 'Navigation/Tabs',
  component: TabsComp,
  parameters: {
    docs: {
      description: {
        component: `Tabs make it easy to explore and switch between different views..

[Documentation](https://mui.com/material-ui/react-tabs/)

[API](https://mui.com/material-ui/api/tabs/)
`,
      },
    },
  },
} as ComponentMeta<typeof TabsComp>;

const Template: ComponentStory<typeof TabsComp> = (props) => {
  const [selected, setSelected] = useState(props.value);

  return <TabsComp {...props} value={selected} onChange={(e, value) => setSelected(value)} />;
};
export const Tabs = Template.bind({});

const tabs = ['Boards', 'Docs', 'Activity', 'Analytics'].map((tab) => ({ label: tab, value: tab }));

Tabs.args = {
  tabs,
  value: tabs[0].value,
};
