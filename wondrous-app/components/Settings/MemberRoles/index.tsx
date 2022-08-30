import React from 'react';
import pluralize from 'pluralize';

import { Text } from 'components/styled';
import { Role } from 'types/common';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import PodIconWithoutBg from 'components/Icons/podIconWithoutBg';
import {
  AvailableRoles,
  AvailableRolesCount,
  AvailableRolesLabel,
  AvailableRolesLabelWrapper,
  Avatars,
  Container,
  MemberRole,
  MemberRoleEmoji,
  MemberRoleLabel,
  MemberRolesList,
  PodMembers,
} from './styled';
import { getRoleColor, getRoleEmoji } from '../Members/MembersTableRow/helpers';

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
            {`${users.length} `}
            <Text as="span" color="#6C6C6C">
              pod {pluralize('member', users.length)}
            </Text>
          </div>
          <PodIconWithoutBg />

          <Avatars style={{ width: `fit-content` }}>
            {users.map(({ user }, index) =>
              user?.thumbnailPicture ? (
                <SafeImage
                  useNextImage={false}
                  key={user.id}
                  style={{ left: index * width - index * overlapLeft }}
                  src={user?.thumbnailPicture}
                />
              ) : (
                <DefaultUserImage key={user.id} style={{ left: index * width - index * overlapLeft }} />
              )
            )}
          </Avatars>
        </PodMembers>
      ) : null}

      <AvailableRoles>
        <AvailableRolesLabelWrapper>
          <AvailableRolesCount>{roleList.length}</AvailableRolesCount>
          <AvailableRolesLabel>
            {pluralize('role', roleList.length)} in {isDAO ? 'DAO' : 'POD'}
          </AvailableRolesLabel>
        </AvailableRolesLabelWrapper>
        <MemberRolesList>
          {roleList.map((role) => (
            <MemberRole key={role.name} borderColor={getRoleColor(role)}>
              <MemberRoleEmoji>{getRoleEmoji(role)}</MemberRoleEmoji>
              <MemberRoleLabel>{role.name}</MemberRoleLabel>
            </MemberRole>
          ))}
        </MemberRolesList>
      </AvailableRoles>
    </Container>
  );
}

export default MemberRoles;
