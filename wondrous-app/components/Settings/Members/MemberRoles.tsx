import React from 'react';
import Box from '@mui/material/Box';
import styled from 'styled-components';

import { Tag, Text } from 'components/styled';

export const Container = styled.div`
  display: flex;
  color: white;
  margin: 23px 0;
  padding: 23px 0;
  line-height: 28px;
  align-items: center;
  font-weight: 500;
  font-size: 15px;
  border-top: 1px solid #232323;
  border-bottom: 1px solid #232323;
`;

type Props = {
  userRoles: string[];
  isDAO: boolean;
};

function MemberRoles({ userRoles, isDAO }: Props) {
  return (
    <Container>
      <Box marginRight="30px">
        {userRoles.length + ' '}
        <Text as="span" color="#6C6C6C">
          roles in {isDAO ? 'DAO' : 'POD'}
        </Text>
      </Box>
      {userRoles.map((role) => (
        <Tag key={role}>{role}</Tag>
      ))}
    </Container>
  );
}

export default MemberRoles;
