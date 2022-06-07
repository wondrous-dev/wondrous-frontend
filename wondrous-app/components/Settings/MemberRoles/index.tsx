import React from 'react';
import pluralize from 'pluralize';

import { Tag, Text } from 'components/styled';
import { Role } from 'types/common';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import PodIconWithoutBg from 'components/Icons/podIconWithoutBg';
import { Avatars, Container, PodMembers } from './styled';

type Props = {
  roleList: Role[];
  isDAO: boolean;
  users: Array<{ user: { thumbnailPicture: string; id: string } }>;
};

function MemberRoles({ roleList = [], users = [], isDAO }: Props) {
  const width = 30;
  const overlapLeft = 5;
  const containerWidth = users.length * width - overlapLeft * (users.length - 1) + 2;

  if (!users.length) {
    return null;
  }

  return (
    <Container withPodMembers={!isDAO}>
      {!isDAO ? (
        <PodMembers>
          <div>
            {users.length + ' '}
            <Text as="span" color="#6C6C6C">
              pod {pluralize('member', users.length)}
            </Text>
          </div>
          <PodIconWithoutBg />

          <Avatars style={{ width: `fit-content` }}>
            {users.map(({ user }, index) => {
              return user?.thumbnailPicture ? (
                <SafeImage
                  key={user.id}
                  style={{ left: index * width - index * overlapLeft }}
                  src={user?.thumbnailPicture}
                />
              ) : (
                <DefaultUserImage key={user.id} style={{ left: index * width - index * overlapLeft }} />
              );
            })}
          </Avatars>
        </PodMembers>
      ) : null}

      <div>
        {roleList.length + ' '}
        <Text as="span" color="#6C6C6C" marginRight="8px">
          {pluralize('role', roleList.length)} in {isDAO ? 'DAO' : 'POD'}
        </Text>
        {roleList.map((role) => (
          <Tag key={role.name}>{role.name}</Tag>
        ))}
      </div>
    </Container>
  );
}

export default MemberRoles;
