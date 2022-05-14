import React, { useEffect, useState } from 'react';

import Wrapper from '../wrapper/wrapper';
import CreatePodIcon from '../../Icons/createPod';
import Boards from '../../Common/Boards';
import { OrgPod } from 'types/pod';
import { FILTER_STATUSES } from 'services/board';
import BoardsActivity from 'components/Common/BoardsActivity';
import { ENTITIES_TYPES } from 'utils/constants';
import MilestoneBoard from 'components/Common/MilestoneBoard';

const BOARDS_MAP = {
  [ENTITIES_TYPES.TASK]: Boards,
  [ENTITIES_TYPES.MILESTONE]: MilestoneBoard,
  [ENTITIES_TYPES.PROPOSAL]: Boards,
  [ENTITIES_TYPES.BOUNTY]: Boards,
};

type Props = {
  orgPods: OrgPod[];
  onSearch: (searchString: string) => Promise<any>;
  onFilterChange: ({}) => any;
  columns: Array<any>;
  onLoadMore: any;
  orgData: any;
  hasMore: any;
  selectOptions: any;
  searchString: string;
  statuses: string[];
  podIds: string[];
  setColumns: React.Dispatch<React.SetStateAction<{}>>;
  userId?: string;
  entityType: string;
  loading: boolean;
  activeView: string
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
      {!loading && (
        <ActiveBoard
          activeView={activeView}
          columns={columns}
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          setColumns={setColumns}
        />
      )}
    </Wrapper>
  );
};

export default OrgBoards;
