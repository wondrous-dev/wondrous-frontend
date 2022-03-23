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
  setColumns: React.Dispatch<React.SetStateAction<[]>>;
};

const PodBoards = (props: Props) => {
  const { columns, onLoadMore, hasMore, onSearch, onFilterChange, setColumns } = props;
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
        setColumns={setColumns}
      />
    </Wrapper>
  );
};

export default PodBoards;
