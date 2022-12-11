import { useEffect, useMemo, useState } from 'react';
import SearchTasks from 'components/SearchTasks';
import {
  useHotkey,
  useBoards,
  useOrgBoard,
  usePodBoard,
  useUserBoard,
  useExploreGr15TasksAndBounties,
} from 'utils/hooks';
import SelectMenuBoardType from 'components/Common/SelectMenuBoardType';
import { useRouter } from 'next/router';
import { ViewType } from 'types/common';
import ToggleViewButton from 'components/Common/ToggleViewButton';
import Toggle from 'components/Common/Toggle';
import { delQuery, insertUrlParam } from 'utils';
import { GridViewIcon } from 'components/Icons/ViewIcons/gridView';
import { ListViewIcon } from 'components/Icons/ViewIcons/listView';
import BoardFilters, { FiltersTriggerButton } from 'components/Common/BoardFilters';
import UserFilter from 'components/Common/BoardFilters/userFilter';
import { ENTITIES_TYPES } from 'utils/constants';
import palette from 'theme/palette';
import { useHotkeys } from 'react-hotkeys-hook';
import { Badge } from '@mui/material';
import { HOTKEYS } from 'utils/hotkeyHelper';
import { BoardsActivityInlineViewWrapper } from './styles';

export function BoardsActivityInlineView({
  onSearch,
  filterSchema,
  onChange,
  view,
  searchQuery,
  isAdmin,
  listViewOptions,
  isExpandable = true,
  withAdminToggle,
  toggleItems,
  enableViewSwitcher = true,
  displaySingleViewFilter = false,
}) {
  const { orgBoard, podBoard, userBoard } = useBoards();
  const router = useRouter();
  const { search } = router.query;
  const board = orgBoard || podBoard || userBoard;

  const [displayFilters, setDisplayFilters] = useState(displaySingleViewFilter || board?.hasActiveFilters);

  useEffect(() => {
    if (board?.hasActiveFilters && board.hasActiveFilters !== displayFilters)
      setDisplayFilters(board?.hasActiveFilters);
  }, [board?.entityType]);

  const handleFilterDisplay = () => setDisplayFilters(!displayFilters);
  const showBadge = useHotkey();

  useHotkeys(
    HOTKEYS.OPEN_FILTER,
    () => {
      setDisplayFilters(!displayFilters);
    },
    [displayFilters]
  );
  return (
    <>
      <BoardsActivityInlineViewWrapper
        style={
          search
            ? {
                justifyContent: 'flex-start',
              }
            : {
                justifyContent: 'flex-end',
              }
        }
        displaySingleViewFilter={displaySingleViewFilter}
      >
        <SearchTasks isExpandable={isExpandable} onSearch={onSearch} />
        {displaySingleViewFilter && (
          <BoardFilters
            showAppliedFilters={!displaySingleViewFilter}
            filterSchema={[filterSchema]}
            onChange={onChange}
          />
        )}
        {withAdminToggle ? <Toggle items={toggleItems} /> : null}
        {view && !searchQuery && enableViewSwitcher ? <ToggleViewButton options={listViewOptions} /> : null}
        {!displaySingleViewFilter ? (
          <Badge badgeContent={HOTKEYS.OPEN_FILTER} color="primary" invisible={!showBadge}>
            <FiltersTriggerButton
              onClick={() => {
                handleFilterDisplay();
              }}
              isOpen={displayFilters}
            />
          </Badge>
        ) : null}
      </BoardsActivityInlineViewWrapper>
      {displayFilters && !displaySingleViewFilter && (
        <BoardFilters showAppliedFilters filterSchema={filterSchema} onChange={onChange} />
      )}
      <UserFilter />
    </>
  );
}

export default function BoardsActivity(props) {
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || podBoard || userBoard;
  const router = useRouter();
  const view = board?.activeView || String(router.query.view ?? ViewType.Grid);
  const { search: searchQuery } = router.query;
  const { onSearch, filterSchema, onFilterChange, isAdmin, withAdminToggle = false, toggleItems = [] } = props;
  const setActiveView = board?.setActiveView;
  const listViewOptions = [
    {
      name: 'List',
      icon: <ListViewIcon color={view === ViewType.List ? palette.blue20 : 'white'} />,
      active: view === ViewType.List,
      disabled: board?.entityType === ENTITIES_TYPES.PROPOSAL || isAdmin,
      action: () => {
        setActiveView(ViewType.List);

        const query = {
          ...router.query,
          view: ViewType.List,
        };

        router.push({ query }, undefined, { scroll: false, shallow: true });
      },
    },
    {
      name: 'Grid',
      icon: <GridViewIcon color={view === ViewType.Grid ? palette.blue20 : 'white'} />,
      active: view === ViewType.Grid,
      disabled: isAdmin,
      action: () => {
        setActiveView(ViewType.Grid);

        const query = {
          ...router.query,
          view: ViewType.Grid,
        };

        router.push({ query }, undefined, { scroll: false, shallow: true });
      },
    },
  ];

  useHotkeys(
    HOTKEYS.LIST_VIEW,
    () => {
      const query = {
        ...router.query,
        view: ViewType.List,
      };

      router.push({ query }, undefined, { scroll: false, shallow: true });
    },
    [view]
  );

  useHotkeys(
    HOTKEYS.GRID_VIEW,
    () => {
      const query = {
        ...router.query,
        view: ViewType.Grid,
      };

      router.push({ query }, undefined, { scroll: false, shallow: true });
    },
    [view]
  );

  // TODO(pkmazarakis): When calendar PR is merged
  // useHotkeys(HOTKEYS.CALENDAR_VIEW, () => {
  // if (setActiveView) {
  //   setActiveView(ViewType.Calendar);
  //   insertUrlParam('view', ViewType.Calendar);
  // } else {
  //   router.replace(`${delQuery(router.asPath)}?view=${ViewType.Calendar}${statusesQuery}${podIdsQuery}${userIdQuery}`);
  // }
  // }, [view])

  return (
    <BoardsActivityInlineView
      onSearch={onSearch}
      filterSchema={filterSchema}
      onChange={onFilterChange}
      view={view}
      searchQuery={searchQuery}
      isAdmin={isAdmin}
      isExpandable={!userBoard}
      listViewOptions={listViewOptions}
      withAdminToggle={withAdminToggle}
      toggleItems={toggleItems}
      enableViewSwitcher={board?.enableViewSwitcher}
      displaySingleViewFilter={board?.displaySingleViewFilter}
    />
  );
}
