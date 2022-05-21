import React, { useEffect, useState } from 'react';

import Wrapper from '../wrapper/wrapper';
import CreatePodIcon from '../../Icons/createPod';
import Boards from '../../Common/Boards';
import { OrgPod } from 'types/pod';
import { FILTER_STATUSES } from 'services/board';
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
  orgPods: OrgPod[];
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

const OrgBoards = (props: Props) => {
  const {
    columns,
    onLoadMore,
    hasMore,
    orgData,
    orgPods,
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

  const defaultFilterSchema: any = [
    {
      name: 'podIds',
      label: 'Pods',
      multiChoice: true,
      items: orgPods.map((pod) => ({
        ...pod,
        icon: <CreatePodIcon />,
        count: pod.contributorCount,
      })),
    },
  ];

  entityType === ENTITIES_TYPES.TASK && defaultFilterSchema.push(FILTER_STATUSES);

  const [filterSchema, setFilterSchema] = useState(defaultFilterSchema);

  useEffect(() => {
    const schema = [...filterSchema];
    schema[0].items = orgPods.map((pod) => ({
      ...pod,
      icon: <CreatePodIcon />,
    }));

    setFilterSchema(schema);
  }, [orgPods]);

  const ActiveBoard = BOARDS_MAP[entityType];

  return (
    <Wrapper orgData={orgData}>
      <BoardsActivity
        onSearch={onSearch}
        filterSchema={filterSchema}
        onFilterChange={onFilterChange}
        statuses={statuses}
        podIds={podIds}
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
