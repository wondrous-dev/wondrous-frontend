import { memo, useEffect } from 'react';
import Boards from 'components/Common/Boards';
import withCardsLayout from 'components/Common/Boards/withCardsLayout';
import BountyBoard from 'components/Common/BountyBoard';
import MilestoneBoard from 'components/Common/MilestoneBoard';
import Wrapper from 'components/organization/wrapper/wrapper';
import { getFilterSchema } from 'utils/board';
import { ENTITIES_TYPES } from 'utils/constants';
import { ColumnsContext } from 'utils/contexts';

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
  } = props;

  const filterSchema = getFilterSchema(entityType, orgData?.id);
  const ActiveBoard = BOARDS_MAP[entityType];

  console.log('-----OrgBoards:render');

  useEffect(() => {
    console.log('-----OrgBoards:---->mounted');
    return () => console.log('-----OrgBoards:<-----unmounted AAAA');
  }, []);

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
      {/*<ColumnsContext.Provider value={{ columns, setColumns }}>*/}
      {/*  {!loading && (*/}
      {/*    <ActiveBoard*/}
      {/*      activeView={typeof activeView !== 'string' ? activeView[0] : activeView}*/}
      {/*      columns={columns}*/}
      {/*      onLoadMore={onLoadMore}*/}
      {/*      hasMore={hasMore}*/}
      {/*      setColumns={setColumns}*/}
      {/*      entityType={entityType}*/}
      {/*    />*/}
      {/*  )}*/}
      {/*</ColumnsContext.Provider>*/}
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
    prevProps.activeView === nextProps.activeView;
  //
  // console.log('-----OrgBoards:areEqual', prevProps, nextProps);
  // console.log(
  //   '-----OrgBoards:areEqual',
  //
  //   prevProps.columns === nextProps.columns,
  //   prevProps.hasMore === nextProps.hasMore,
  //   prevProps.orgData?.id === nextProps.orgData?.id,
  //   prevProps.statuses === nextProps.statuses,
  //   prevProps.podIds === nextProps.podIds,
  //   prevProps.userId === nextProps.userId,
  //   prevProps.entityType === nextProps.entityType,
  //   prevProps.loading === nextProps.loading,
  //   prevProps.activeView === nextProps.activeView
  // );

  return areEqual;
});
