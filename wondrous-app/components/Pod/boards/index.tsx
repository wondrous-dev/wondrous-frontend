import Boards from '@components/Common/Boards';
import { FILTER_STATUSES } from '@services/board';
import React, { useState } from 'react';
import Wrapper from '../wrapper';

type Props = {
  onSearch: (searchString: string) => Promise<any>;
  onFilterChange: (searchString: string) => Promise<any>;
  columns: Array<any>;
  onLoadMore: any;
  hasMore: any;
  selectOptions: any;
  searchString: string;
};

const PodBoards = (props: Props) => {
  const { columns, onLoadMore, hasMore, onSearch, onFilterChange } = props;
  const filterSchema = [FILTER_STATUSES];
  return (
    <Wrapper>
      <Boards
        filterSchema={filterSchema}
        onSearch={onSearch}
        onFilterChange={onFilterChange}
        columns={columns}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
      />
    </Wrapper>
  );
};

export default PodBoards;
