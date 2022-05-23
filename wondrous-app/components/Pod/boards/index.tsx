import React from 'react';

import Wrapper from '../wrapper';
import Boards from '../../Common/Boards';
import { FILTER_STATUSES, ENTITIES_TYPES_FILTER_STATUSES } from 'services/board';
import BoardsActivity from 'components/Common/BoardsActivity';
import { ENTITIES_TYPES } from 'utils/constants';
import MilestoneBoard from 'components/Common/MilestoneBoard';
import BountyBoard from 'components/Common/BountyBoard';
import withCardsLayout from 'components/Common/Boards/withCardsLayout';
import { ColumnsContext } from 'utils/contexts';

const BOARDS_MAP = {
  [ENTITIES_TYPES.TASK]: Boards,
  [ENTITIES_TYPES.MILESTONE]: withCardsLayout(MilestoneBoard, 3),
  [ENTITIES_TYPES.PROPOSAL]: Boards,
  [ENTITIES_TYPES.BOUNTY]: withCardsLayout(BountyBoard, 4),
};

type Props = {
  onSearch: (searchString: string) => Promise<any>;
  onFilterChange: ({}) => any;
  columns: Array<any>;
  onLoadMore: any;
  hasMore: any;
  searchString: string;
  statuses: string[];
  setColumns: React.Dispatch<React.SetStateAction<{}>>;
  userId?: string;
  entityType: string;
  loading: boolean;
  activeView: string | string[];
};

const OrgBoards = (props: Props) => {
  const {
    columns,
    onLoadMore,
    hasMore,
    onSearch,
    onFilterChange,
    statuses,
    setColumns,
    userId,
    entityType,
    loading,
    activeView,
  } = props;

  const ActiveBoard = BOARDS_MAP[entityType];

  const entityTypeFilters = ENTITIES_TYPES_FILTER_STATUSES[entityType] || FILTER_STATUSES;

  return (
    <Wrapper>
      <BoardsActivity
        onSearch={onSearch}
        filterSchema={entityTypeFilters}
        onFilterChange={onFilterChange}
        statuses={statuses}
        userId={userId}
      />
      <ColumnsContext.Provider value={{ columns, setColumns }}>
        {!loading && (
          <ActiveBoard
            activeView={typeof activeView !== 'string' ? activeView[0] : activeView}
            columns={columns}
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            setColumns={setColumns}
          />
        )}
      </ColumnsContext.Provider>
    </Wrapper>
  );
};

export default OrgBoards;
