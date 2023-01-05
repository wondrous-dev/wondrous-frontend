import Grid from '@mui/material/Grid';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';
import { useBoardPermission } from 'utils/hooks';

import HeaderTitle from './HeaderTitle';
import { DATA_LIMIT } from './helpers';
import ListItem from './ListItem';
import SectionEmpty from './SectionEmpty';
import SectionShowAllButton from './SectionShowAllButton';
import { ListWrapperProps } from './types';

const AddButton = dynamic(() => import('./AddButton'), { ssr: false });

const SectionContent = ({
  backgroundImageUrl,
  CreateButtonProps,
  HeaderTitleProps,
  showAllUrl,
  data,
  ListItemProps,
}: ListWrapperProps) => {
  const { hasFullOrEditPermission } = useBoardPermission();
  const entityContent = isEmpty(data) ? (
    <SectionEmpty backgroundImageUrl={backgroundImageUrl} CreateButtonProps={CreateButtonProps} />
  ) : (
    data.slice(0, DATA_LIMIT).map((i) => <ListItem key={i?.id} {...ListItemProps} data={i} />)
  );
  return (
    <>
      <Grid container item flexDirection="column" flexGrow="1" padding="14px" gap="14px">
        <Grid container item alignItems="center" justifyContent="space-between">
          <HeaderTitle {...HeaderTitleProps} />
          {hasFullOrEditPermission ? <AddButton {...CreateButtonProps} {...HeaderTitleProps} /> : null}
        </Grid>
        <Grid item container flexDirection="column" gap="10px" flexGrow="1">
          {entityContent}
        </Grid>
      </Grid>
      <SectionShowAllButton showAllUrl={showAllUrl} />
    </>
  );
};

export default SectionContent;
