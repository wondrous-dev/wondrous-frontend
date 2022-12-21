import React, { memo, Suspense } from 'react';

import BoardColumnsSkeleton from 'components/Dashboard/boards/BoardColumnsSkeleton';
import dynamic from 'next/dynamic';
import withCardsLayout from 'components/Common/Boards/withCardsLayout';
import Wrapper from 'components/organization/wrapper/wrapper';
import { getFilterSchema } from 'utils/board';
import { ENTITIES_TYPES } from 'utils/constants';
import { ColumnsContext } from 'utils/contexts';

const Boards = dynamic(() => import('components/Common/Boards'), { suspense: true });
const BountyBoard = dynamic(() => import('components/Common/BountyBoard'), { suspense: true });
const MilestoneBoard = dynamic(() => import('components/Common/MilestoneBoard'), { suspense: true });

export const BOARDS_MAP = {
  [ENTITIES_TYPES.TASK]: Boards,
  [ENTITIES_TYPES.MILESTONE]: withCardsLayout(MilestoneBoard, 3),
  [ENTITIES_TYPES.PROPOSAL]: Boards,
  [ENTITIES_TYPES.BOUNTY]: withCardsLayout(BountyBoard, 4),
};

export type Props = {
  onSearch: (searchString: string) => Promise<any>;
  onFilterChange: ({}) => any;
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
  searchColumns?: any
};

function OrgBoards(props: Props) {
  const {
    columns,
    onLoadMore,
    hasMore,
    orgData,
    onSearch,
    onFilterChange,
    statuses,
    podIds,
    setColumns,
    userId,
    entityType,
    loading,
    activeView,
    searchColumns
  } = props;

  const filterSchema = getFilterSchema(entityType, orgData?.id);
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
      loading={loading}
    >
      <ColumnsContext.Provider value={{ columns, setColumns }}>
        {loading ? (
          <BoardColumnsSkeleton />
        ) : (
          <Suspense>
            <ActiveBoard
              activeView={typeof activeView !== 'string' ? activeView[0] : activeView}
              columns={columns}
              onLoadMore={onLoadMore}
              hasMore={hasMore}
              searchColumns={searchColumns}
              setColumns={setColumns}
              entityType={entityType}
            />
          </Suspense>
        )}
      </ColumnsContext.Provider>
    </Wrapper>
  );
}

export default memo(OrgBoards, (prevProps, nextProps) => {
  const areEqual =
    prevProps.columns === nextProps.columns &&
    prevProps.hasMore === nextProps.hasMore &&
    prevProps.orgData?.id === nextProps.orgData?.id &&
    prevProps.statuses === nextProps.statuses &&
    prevProps.podIds === nextProps.podIds &&
    prevProps.userId === nextProps.userId &&
    prevProps.entityType === nextProps.entityType &&
    prevProps.loading === nextProps.loading &&
    prevProps.loading === nextProps.loading &&
    prevProps.activeView === nextProps.activeView;
    prevProps.searchColumns === nextProps.searchColumns;
  return areEqual;
});
