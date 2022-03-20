import React, { useEffect, useState } from 'react';

import Wrapper from '../wrapper/wrapper';
import CreatePodIcon from '../../Icons/createPod';
import Boards from '../../Common/Boards';
import { OrgPod } from '../../../types/pod';
import { FILTER_STATUSES } from '../../../services/board';

type Props = {
  orgPods: OrgPod[];
  onSearch: (searchString: string) => Promise<any>;
  onFilterChange: (searchString: string) => Promise<any>;
  columns: Array<any>;
  onLoadMore: any;
  onColumnSectionToggle: (column: object, isOpen: boolean) => unknown;
  orgData: any;
  hasMore: any;
  selectOptions: any;
  searchString: string;
};

const OrgBoards = (props: Props) => {
  const { columns, onLoadMore, hasMore, orgData, orgPods, onSearch, onFilterChange, onColumnSectionToggle } = props;
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
        onSearch={onSearch}
        onFilterChange={onFilterChange}
        columns={columns}
        onLoadMore={onLoadMore}
        onColumnSectionToggle={onColumnSectionToggle}
        hasMore={hasMore}
      />
    </Wrapper>
  );
};

export default OrgBoards;
