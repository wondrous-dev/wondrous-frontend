import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';
import TableComponent from './Table';

export default {
  title: 'Data Display/Table',
  component: TableComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Tables display sets of data. **The current example just demonstrates how table looks like, there is no common component yet.**',
      },
    },
  },
} as ComponentMeta<typeof TableComponent>;

const BasicExampleTemplate: ComponentStory<typeof TableComponent> = (args) => <TableComponent {...args} />;

export const BasicExample = BasicExampleTemplate.bind({});

BasicExample.parameters = {
  docs: {
    source: {
      code: `
<StyledTableContainer>
  <StyledTable>
    <StyledTableHead>
      <StyledTableRow>
        <StyledTableCell align="center" width="56px">
          DAO
        </StyledTableCell>
        <StyledTableCell align="center">Created by :</StyledTableCell>
        <StyledTableCell align="center">Status</StyledTableCell>
        <StyledTableCell align="center">Reward</StyledTableCell>
      </StyledTableRow>
    </StyledTableHead>
  
    <StyledTableBody>
      <StyledTableCell align="center">Wonder</StyledTableCell>
      <StyledTableCell align="center">Owner</StyledTableCell>
      <StyledTableCell align="center">Open</StyledTableCell>
      <StyledTableCell align="center">1000$</StyledTableCell>
    </StyledTableBody>
  
    <StyledTableBody>
      <StyledTableCell align="center">Wonder</StyledTableCell>
      <StyledTableCell align="center">Owner</StyledTableCell>
      <StyledTableCell align="center">Open</StyledTableCell>
      <StyledTableCell align="center">1000$</StyledTableCell>
    </StyledTableBody>
  
    <StyledTableBody>
      <StyledTableCell align="center">Wonder</StyledTableCell>
      <StyledTableCell align="center">Owner</StyledTableCell>
      <StyledTableCell align="center">Open</StyledTableCell>
      <StyledTableCell align="center">1000$</StyledTableCell>
    </StyledTableBody>
  </StyledTable>
</StyledTableContainer>
      `,
      language: 'jsx',
      type: 'auto',
    },
  },
};
