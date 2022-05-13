import React, { useEffect, useState } from 'react';

import Wrapper from '../wrapper/wrapper';
import CreatePodIcon from '../../Icons/createPod';
import Boards from '../../Common/Boards';
import { OrgPod } from 'types/pod';
import { FILTER_STATUSES } from 'services/board';
import BoardsActivity from 'components/Common/BoardsActivity';

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
  } = props;
  const [filterSchema, setFilterSchema] = useState([
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
    FILTER_STATUSES,
  ]);

  useEffect(() => {
    const schema = [...filterSchema];
    schema[0].items = orgPods.map((pod) => ({
      ...pod,
      icon: <CreatePodIcon />,
    }));

    setFilterSchema(schema);
  }, [orgPods]);

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
      <Boards columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} setColumns={setColumns} />
    </Wrapper>
  );
};

export default OrgBoards;
