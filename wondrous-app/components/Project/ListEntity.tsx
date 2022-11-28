import Grid from '@mui/material/Grid';

import useListBountyProps from './ListBounty';
import useListCollab from './ListCollab';
import useListDoc from './ListDoc';
import useListGrant from './ListGrant';
import useListMember from './ListMember';
import useListMilestone from './ListMilestone';
import useListProposal from './ListProposal';
import useListTaskProps from './ListTask';
import ListWrapper from './ListWrapper';
import { ListWrapperProps } from './types';

const ListEntity = () => {
  const listWrapperProps: ListWrapperProps[] = [
    useListTaskProps(),
    useListBountyProps(),
    useListMilestone(),
    useListProposal(),
    useListMember(),
    useListCollab(),
    useListGrant(),
    useListDoc(),
  ];
  return (
    <Grid
      container
      justifyContent="space-between"
      gap="24px"
      sx={[
        {
          '& > *': {
            maxWidth: 'calc(50% - 12px)',
          },
        },
      ]}
    >
      {listWrapperProps.map((i, index) => (
        <ListWrapper key={index} {...i} />
      ))}
    </Grid>
  );
};

export default ListEntity;
