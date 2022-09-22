import { Badge } from '@mui/material';
import React from 'react';
import Link from 'next/link';
import { useHotkey } from 'utils/hooks';
import { useHotkeys } from 'react-hotkeys-hook';
import { useRouter } from 'next/router';
import { SafeImage } from '../Image';
import styles, { ButtonIcon, DaoIconWrapper, NoLogoDAO } from './styles';
import SidebarTooltip from '../SidebarMainTooltip';

const SideBarMainDaoLink = ({ id, name, username, isActive, thumbnailPicture, profilePicture, index }) => {
  const showBadge = useHotkey();
  const router = useRouter();
  const fixedIndex = (index + 1).toString();

  useHotkeys(fixedIndex, () => {
    router.push(`/organization/${username}/boards?entity=task`);
  });

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
