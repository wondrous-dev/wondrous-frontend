import React, { useEffect, useState } from 'react';

import Wrapper from '../wrapper/wrapper';
import CreatePodIcon from '../../Icons/createPod';
import Boards from '../../Common/Boards';
import { OrgPod } from '../../../types/pod';
import { FILTER_STATUSES } from '../../../services/board';
import { DEFAULT_STATUS_ARR } from '@utils/constants';
import { TaskFilter } from '../../../types/task';

type Props = {
  orgPods: OrgPod[];
  onSearch: (searchString: string) => Promise<unknown>;
  onFilterChange: ({ statuses, podIds }: TaskFilter) => unknown;
  columns: Array<unknown>;
  onLoadMore: unknown;
  onColumnSectionToggle: (column: object, isOpen: boolean) => unknown;
  orgData: unknown;
  hasMore: unknown;
  selectOptions: unknown;
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
