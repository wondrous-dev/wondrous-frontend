import React from 'react';

import { FILTER_STATUSES, ENTITIES_TYPES_FILTER_STATUSES } from 'services/board';
import { ENTITIES_TYPES } from 'utils/constants';
import MilestoneBoard from 'components/Common/MilestoneBoard';
import BountyBoard from 'components/Common/BountyBoard';
import withCardsLayout from 'components/Common/Boards/withCardsLayout';
import { ColumnsContext } from 'utils/contexts';
import { TaskFilter } from 'types/task';
import Boards from '../../Common/Boards';
import Wrapper from '../wrapper/wrapper';

const BOARDS_MAP = {
  [ENTITIES_TYPES.TASK]: Boards,
  [ENTITIES_TYPES.MILESTONE]: withCardsLayout(MilestoneBoard, 3),
  [ENTITIES_TYPES.PROPOSAL]: Boards,
  [ENTITIES_TYPES.BOUNTY]: withCardsLayout(BountyBoard, 4),
};

type Props = {
  onSearch: (searchString: string) => Promise<any>;
  onFilterChange: ({}) => any;
  onCalendarDateChange: Function;
  columns: Array<any>;
  onLoadMore: any;
  orgData: any;
  hasMore: any;
  searchString: string;
  statuses: string[];
  podIds: string[];
  setColumns: React.Dispatch<React.SetStateAction<{}>>;
  userId?: string;
  entityType: string;
  loading: boolean;
  activeView: string | string[];
};

function OrgBoards(props: Props) {
  const {
    columns,
    onLoadMore,
    hasMore,
    orgData,
    onSearch,
    onFilterChange,
    onCalendarDateChange,
    statuses,
    podIds,
    setColumns,
    userId,
    entityType,
    loading,
    activeView,
  } = props;

  const filters = ENTITIES_TYPES_FILTER_STATUSES({ orgId: orgData?.id, enablePodFilter: true });
  const entityTypeFilters = filters[entityType]?.filters || FILTER_STATUSES;
  const filterSchema: any = entityTypeFilters;
  const ActiveBoard = BOARDS_MAP[entityType];

  return (
    <Wrapper
      orgData={orgData}
      onSearch={onSearch}
      filterSchema={filterSchema}
      onFilterChange={onFilterChange}
      statuses={statuses}
      podIds={podIds}
      userId={userId}
    >
      <ColumnsContext.Provider value={{ columns, setColumns }}>
        {!loading && (
          <ActiveBoard
            activeView={typeof activeView !== 'string' ? activeView[0] : activeView}
            columns={columns}
            onLoadMore={onLoadMore}
            onCalendarDateChange={onCalendarDateChange}
            hasMore={hasMore}
            setColumns={setColumns}
            entityType={entityType}
          />
        )}
      </ColumnsContext.Provider>
    </Wrapper>
  );
}

export default OrgBoards;
