import React from 'react';
import Box from '@mui/material/Box';
import styled from 'styled-components';

import { Tag, Text } from 'components/styled';
import { Role } from 'types/common';
import PodIcon from 'components/Icons/podIcon';
import { SafeImage } from 'components/Common/Image';
import { DefaultProfilePicture } from 'components/Settings/Members/styles';
import { array } from 'yup';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';

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

export const Avatars = styled.div`
  border: 1px solid #6accbc;
  border-radius: 190px;
  padding: 2px;
  height: 34px;
  position: relative;

  img {
    height: 30px;
    width: 30px;
    border: 1px solid black;
    border-radius: 50%;
    position: absolute;
    top: 1px;
  }
`;

type Props = {
  roleList: Role[];
  isDAO: boolean;
  users: Array<{ user: { thumbnailPicture: string; id: string } }>;
};

function MemberRoles({ roleList = [], users = [], isDAO }: Props) {
  return (
    <Container>
      {!isDAO ? (
        <Box marginRight="30px">
          {users.length + ' '}
          <Text as="span" color="#6C6C6C">
            pod members
          </Text>
          <PodIcon color="#6ACCBC" />

          <Avatars style={{ width: `${users.length * 28}px` }}>
            {users.map(({ user }, index) => {
              return user?.thumbnailPicture ? (
                <SafeImage style={{ left: index * 25 + 1 }} src={user?.thumbnailPicture} />
              ) : (
                <DefaultUserImage style={{ left: index * 25 + 1 }} />
              );
            })}
          </Avatars>
        </Box>
      ) : null}

      <Box marginRight="30px">
        {roleList.length + ' '}
        <Text as="span" color="#6C6C6C">
          roles in {isDAO ? 'DAO' : 'POD'}
        </Text>
      </Box>
      {roleList.map((role) => (
        <Tag key={role.name}>{role.name}</Tag>
      ))}
    </Container>
  );
}

export default MemberRoles;
