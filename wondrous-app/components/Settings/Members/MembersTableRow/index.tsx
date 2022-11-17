import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Grid, Typography } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import CopyIcon from 'components/Icons/copy';
import { useWonderWeb3 } from 'services/web3';
import PodIcon from 'components/Icons/podIcon';
import Dropdown from 'components/Common/Dropdown';
import DropdownItem from 'components/Common/DropdownItem';
import { TaskMenuIcon } from 'components/Icons/taskMenu';
import palette from 'theme/palette';
import MemberRoleSelectionDropdown from './MemberRoleSelectionDropdown';
import {
  DefaultProfilePicture,
  UserOptions,
  UserProfile,
  UserWalletAddress,
  UserWalletAddressContainer,
  WalletAddressEmptyState,
} from './styles';
import { getAddressToDisplay } from './helpers';

const MemberTableRow = ({ user, role, orgId, podId, roleList, promptRemoveUser }) => {
  const [hasAddressBeenCopied, setHasAddressBeenCopied] = useState(false);
  const [userENSNameOrWalletAddress, setUserENSNameOrWalletAddress] = useState('');

  const wonderWeb3 = useWonderWeb3();

  useEffect(() => {
    if (user?.activeEthAddress) {
      setUserENSNameOrWalletAddress(user.activeEthAddress);

      wonderWeb3.getENSNameFromEthAddress(user.activeEthAddress).then((ensName) => {
        if (ensName) {
          setUserENSNameOrWalletAddress(ensName);
        }
      });
    }
  }, [user?.activeEthAddress]);

  const userId = user?.id;
  const userProfilePicture = user?.thumbnailPicture;
  const userFullName = user?.firstName && `${user?.firstName} ${user?.lastName}` && user?.lastName;
  const username = `@${user?.username}`;

  const handleAddressCopy = () => {
    navigator.clipboard.writeText(userENSNameOrWalletAddress);
    setHasAddressBeenCopied(true);

    setTimeout(() => {
      setHasAddressBeenCopied(false);
    }, 1500);
  };

  return (
    <Grid display="flex" alignItems="center" gap="80px">
      <Link href={`/profile/${user?.username}/about`} passHref style={{ textDecoration: 'none' }}>
        <UserProfile>
          <SafeImage
            useNextImage
            src={userProfilePicture}
            placeholderComp={<DefaultProfilePicture />}
            width={40}
            height={40}
            style={{
              borderRadius: '50%',
            }}
            alt="Profile picture"
          />
          <Grid display="flex" flexDirection="column" gap="2px">
            {!!userFullName && (
              <Typography fontSize={15} fontWeight={700} color={palette.white}>
                {userFullName}
              </Typography>
            )}
            <Typography
              color={palette.grey250}
              fontSize={12}
              width="18ch"
              maxWidth="18ch"
              textOverflow="ellipsis"
              overflow="hidden"
            >
              {username}
            </Typography>
          </Grid>
        </UserProfile>
      </Link>
      <Grid display="flex" alignItems="center" gap="14px" flex={1}>
        {userENSNameOrWalletAddress ? (
          <UserWalletAddressContainer hasAddressBeenCopied={hasAddressBeenCopied} onClick={handleAddressCopy}>
            <UserWalletAddress hasAddressBeenCopied={hasAddressBeenCopied}>
              {hasAddressBeenCopied ? 'Text copied!' : getAddressToDisplay(userENSNameOrWalletAddress)}
            </UserWalletAddress>
            <CopyIcon color={hasAddressBeenCopied ? palette.green30 : palette.blue20} />
          </UserWalletAddressContainer>
        ) : (
          <WalletAddressEmptyState>No wallet added</WalletAddressEmptyState>
        )}
        <MemberRoleSelectionDropdown
          userId={userId}
          orgId={orgId}
          podId={podId}
          existingRole={role}
          roleList={roleList}
          username={user?.username}
        />
        <UserOptions>
          <Dropdown
            DropdownHandler={() => <TaskMenuIcon fill="transparent" fillOnHover="transparent" stroke={palette.white} />}
          >
            <DropdownItem
              onClick={() => promptRemoveUser(user)}
              style={{
                color: palette.white,
                zIndex: 120,
              }}
            >
              Remove Member
            </DropdownItem>
          </Dropdown>
        </UserOptions>
      </Grid>
    </Grid>
  );
};

export default MemberTableRow;
