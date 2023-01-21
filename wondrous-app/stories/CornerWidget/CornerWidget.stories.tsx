import { ComponentMeta } from '@storybook/react';
import CornerWidgetComponent from 'components/Common/CornerWidget/Component';
import { ENTITIES_TYPES } from 'utils/constants';

export default {
  title: 'CornerWidget',
  component: CornerWidgetComponent,
} as ComponentMeta<typeof CornerWidgetComponent>;

const Template = () => (
  <>
    <CornerWidgetComponent id="1" handleClose={() => null} type={ENTITIES_TYPES.TASK} orgName="wonderverse" />
    <CornerWidgetComponent
      id="2"
      handleClose={() => null}
      type={ENTITIES_TYPES.MILESTONE}
      orgName="test org"
      podName="Growth Pod"
    />
    ;
  </>
);

export const Primary = Template.bind({});
