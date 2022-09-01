import React from 'react';
import pluralize from 'pluralize';

import { Grid, Typography } from '@mui/material';
import { Text } from 'components/styled';
import { Role } from 'types/common';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import PodIconWithoutBg from 'components/Icons/podIconWithoutBg';
import palette from 'theme/palette';
import { Avatars, Container, MemberRole, PodMembers } from './styled';
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

      <Grid display="flex" alignItems="center" gap="30px">
        <Grid display="flex" alignItems="center" gap="4px">
          <Typography color={palette.white} fontSize={14} fontWeight={500} minWidth="fit-content">
            {roleList.length}
          </Typography>
          <Typography color={palette.grey60} fontSize={14} fontWeight={500} minWidth="fit-content">
            {pluralize('role', roleList.length)} in {isDAO ? 'DAO' : 'POD'}
          </Typography>
        </Grid>
        <Grid display="flex" alignItems="center" gap="10px">
          {roleList.map((role) => (
            <MemberRole key={role.name} borderColor={getRoleColor(role)}>
              <span>{getRoleEmoji(role)}</span>
              <Typography color={palette.white} textTransform="capitalize" fontSize={13} fontWeight={500}>
                {role.name}
              </Typography>
            </MemberRole>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}

export default MemberRoles;
