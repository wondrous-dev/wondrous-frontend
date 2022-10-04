import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Badge } from '@mui/material';

import { useHotkey } from 'utils/hooks';

import { SafeImage } from '../Image';
import SidebarTooltip from '../SidebarMainTooltip';

import styles, { ButtonIcon, DaoIconWrapper, NoLogoDAO } from './styles';

const SideBarMainDaoLink = ({ id, name, username, isActive, thumbnailPicture, profilePicture, index }) => {
  const showBadge = useHotkey();
  const router = useRouter();
  const fixedIndex = (index + 1).toString();

  useHotkeys(
    fixedIndex,
    () => {
      if (showBadge) {
        router.push(`/organization/${username}/boards?entity=task`);
      }
    },
    [showBadge]
  );

  return (
    <SidebarTooltip key={id} title={name}>
      <Badge badgeContent={fixedIndex} color="primary" invisible={!showBadge} sx={{ ...styles.hotkeyBadge }}>
        <Link key={id} href={`/organization/${username}/boards?entity=task`} passHref>
          <ButtonIcon button key={id} isActive={isActive}>
            <DaoIconWrapper>
              {thumbnailPicture || profilePicture ? (
                <SafeImage
                  useNextImage={false}
                  src={thumbnailPicture || profilePicture}
                  width={36}
                  height={36}
                  objectFit="cover"
                  style={{
                    borderRadius: '50%',
                  }}
                />
              ) : (
                <NoLogoDAO />
              )}
            </DaoIconWrapper>
          </ButtonIcon>
        </Link>
      </Badge>
    </SidebarTooltip>
  );
};

export default SideBarMainDaoLink;
