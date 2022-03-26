import React, { useEffect, useState } from 'react';

import Wrapper from '../wrapper/wrapper';
import CreatePodIcon from '../../Icons/createPod';
import Boards from '../../Common/Boards';
import { OrgPod } from '../../../types/pod';
import { FILTER_STATUSES } from '../../../services/board';

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
  handleCardOpening?: (section: any, isOpen: boolean) => any;
  setColumns: React.Dispatch<React.SetStateAction<{}>>;
};

const OrgBoards = (props: Props) => {
  const {
    handleCardOpening,
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
      <Boards
        filterSchema={filterSchema}
        handleCardOpening={handleCardOpening}
        onSearch={onSearch}
        onFilterChange={onFilterChange}
        columns={columns}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        statuses={statuses}
        podIds={podIds}
        setColumns={setColumns}
      />
    </Wrapper>
  );
};

export default OrgBoards;
