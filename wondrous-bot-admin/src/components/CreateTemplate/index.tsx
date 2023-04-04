import { Button, Grid } from '@mui/material';
import { SharedButton } from 'components/Shared/styles';
import { useContext, useState } from 'react';
import { CONFIG_COMPONENTS } from 'utils/constants';
import CreateTemplateContext from 'utils/context';
import { Panel } from './styles';
const CreateTemplate = () => {
  const { configuration, toggleForm } = useContext(CreateTemplateContext);

  // if (!configuration?.length) {
  //   return (
  //     <Panel>
  //       <Button onClick={toggleForm}>Add item</Button>
  //     </Panel>
  //   );
  // }
  return (
    <Grid container direction="column" gap="24px">
      {configuration?.map((item, idx) => {
        const Component = CONFIG_COMPONENTS[item.value];
        return (
          <Panel key={idx}>
            <Component
              label='bla'
              value={''}
              onChange={() => {}}
              error={'err'}
            />
          </Panel>
        );
      })}
     <Grid display="flex" justifyContent="space-between" alignItems="center">
     <SharedButton>
        Insert Block
      </SharedButton>
     </Grid>
    </Grid>
  );
};

export default CreateTemplate;
