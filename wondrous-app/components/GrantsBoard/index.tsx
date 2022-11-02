import { useState } from 'react';
import GrantsFilters from 'components/GrantsFilters';
import { GRANTS_FILTERS } from 'services/board';

const GrantsBoard = () => {
  const [activeFilter, setActiveFilter] = useState(GRANTS_FILTERS[0].value);
  return <GrantsFilters onFilterChange={setActiveFilter} activeFilter={activeFilter} />;
};

export default GrantsBoard;
