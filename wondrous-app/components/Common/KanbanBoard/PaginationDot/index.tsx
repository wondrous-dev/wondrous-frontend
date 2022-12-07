import React from 'react';

import { PaginationDotContainer } from './styles';

const PaginationDot = ({ active, onClick }) => (
  <PaginationDotContainer active={active} onClick={onClick}>
    <span />
  </PaginationDotContainer>
);

export default PaginationDot;
