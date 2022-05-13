import { BoardsActivityWrapper } from './styles';
import SearchTasks from 'components/SearchTasks';
import Filter from 'components/Common/Filter';
import { useOrgBoard, useSelectMembership } from 'utils/hooks';
import SelectMenuBoardType from 'components/Common/SelectMenuBoardType';
import { useRouter } from 'next/router';
import { ViewType } from 'types/common';
import { ToggleViewButton } from 'components/Common/ToggleViewButton';
import { delQuery } from 'utils';
import { GridViewIcon } from 'components/Icons/ViewIcons/gridView';
import { ListViewIcon } from 'components/Icons/ViewIcons/listView';

export default function BoardsActivity(props) {
  const orgBoard = useOrgBoard();
  const router = useRouter();
  const view = String(router.query.view ?? ViewType.Grid);
  const { search: searchQuery } = router.query;
  const { onSearch, filterSchema, onFilterChange, statuses, podIds, isAdmin, userId } = props;
  const statusesQuery = statuses?.length ? `&statuses=${statuses.join(',')}` : '';
  const podIdsQuery = podIds?.length ? `&podIds=${podIds.join(',')}` : '';
  const userIdQuery = userId ? `&userId=${userId}` : '';

  const listViewOptions = [
    {
      name: 'List',
      icon: <ListViewIcon />,
      active: view === ViewType.List,
      action: () => {
        router.replace(`${delQuery(router.asPath)}?view=${ViewType.List}${statusesQuery}${podIdsQuery}${userIdQuery}`);
      },
    },
    {
      name: 'Grid',
      icon: <GridViewIcon />,
      active: view === ViewType.Grid,
      action: () => {
        router.replace(`${delQuery(router.asPath)}?view=${ViewType.Grid}${statusesQuery}${podIdsQuery}${userIdQuery}`);
      },
    },
  ];

  return (
    <>
      <BoardsActivityWrapper>
        <SearchTasks onSearch={onSearch} />
        <Filter filterSchema={filterSchema} onChange={onFilterChange} statuses={statuses} podIds={podIds} />
        {orgBoard && <SelectMenuBoardType router={router} view={view} />}
        {view && !searchQuery && !isAdmin ? <ToggleViewButton options={listViewOptions} /> : null}
      </BoardsActivityWrapper>
    </>
  );
}
