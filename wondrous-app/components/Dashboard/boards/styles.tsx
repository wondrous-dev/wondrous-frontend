import React from 'react';
import styled from 'styled-components';
import { MenuItem, TextField } from '@mui/material';
import Accordion from '../../Common/Accordion';
import { BoardFiltersContainer } from 'components/Common/BoardFilters/styles';
import { BoardsSubheaderWrapper } from 'components/organization/wrapper/styles';

export const BoardsContainer = styled.div`
  margin-top: 42px;
`;

export const FilterOrg = styled(Accordion)`
  width: 100%;
  padding: 0;
`;

export const FilterItemOrgIcon = styled.div`
  display: flex;
  align-items: center;
  margin-left: -10px;
`;

export const DashboardPanelWrapper = styled.div`
  margin-top: -140px;
  width: 100%;
`;

export const BoardsWrapper = styled.div`
  width: 95%;
  margin: 0 auto;
`;

export const BoardsActivityWrapper = styled(BoardsSubheaderWrapper)`
  && {
    grid-template-columns: 1fr;
  }
`;
