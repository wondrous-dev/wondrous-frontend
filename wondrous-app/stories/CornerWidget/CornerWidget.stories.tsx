import { ComponentMeta } from '@storybook/react';
import { CornerWidget } from 'components/Common/CornerWidget';
import { ENTITIES_TYPES } from 'utils/constants';

export default {
  title: 'CornerWidget',
  component: CornerWidget,
} as ComponentMeta<typeof CornerWidget>;

const Template = () => (
  <>
    <CornerWidget
      id="1"
      handleClose={() => null}
      type={ENTITIES_TYPES.TASK}
      org={{ username: '0xwonderverse', name: 'wonderverse' }}
    />
    <CornerWidget
      id="2"
      handleClose={() => null}
      type={ENTITIES_TYPES.MILESTONE}
      pod={{ id: '1', name: 'engineering' }}
    />
    ;
  </>
);

export const Primary = Template.bind({});
