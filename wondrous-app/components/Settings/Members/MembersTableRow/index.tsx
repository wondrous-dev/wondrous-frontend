import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Grid, Typography } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import CopyIcon from 'components/Icons/copy';
import { useWonderWeb3 } from 'services/web3';
import PodIcon from 'components/Icons/podIcon';
import { DropDown, DropDownItem } from 'components/Common/dropdown';
import { TaskMenuIcon } from 'components/Icons/taskMenu';
import palette from 'theme/palette';
import MemberRoleSelectionDropdown from './MemberRoleSelectionDropdown';
import {
  DefaultProfilePicture,
  UserOptions,
  UserPodCount,
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

  const userPodCount = user?.additionalInfo?.podCount;

  const handleAddressCopy = () => {
    navigator.clipboard.writeText(userENSNameOrWalletAddress);
    setHasAddressBeenCopied(true);

    setTimeout(() => {
      setHasAddressBeenCopied(false);
    }, 1500);
  };

  return (
    <Grid display="flex" alignItems="center" gap="80px">
      <Link href={`/profile/${user?.username}/about`} passHref>
        <UserProfile>
          <SafeImage
            useNextImage
            src={userProfilePicture}
            placeholderComp={<DefaultProfilePicture />}
            width="40px"
            height="40px"
            style={{
              borderRadius: '50%',
            }}
          />
          <Grid display="flex" flexDirection="column" gap="2px">
            {!!userFullName && (
              <Typography fontSize={15} fontWeight={700}>
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
        <UserPodCount>
          <Grid
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="6px"
            bgcolor={palette.background.default}
          >
            <PodIcon strokeColor={palette.blue20} />
          </Grid>
          {userPodCount || 0} {userPodCount ? 'Pods' : 'Pod'}
        </UserPodCount>
        <UserOptions>
          <DropDown
            DropdownHandler={() => <TaskMenuIcon fill="transparent" fillOnHover="transparent" stroke={palette.white} />}
          >
            <DropDownItem
              onClick={() => promptRemoveUser(user)}
              style={{
                color: palette.white,
                zIndex: 120,
              }}
            >
              Remove Member
            </DropDownItem>
          </DropDown>
        </UserOptions>
      </Grid>
    </Grid>
  );
};

export default MemberTableRow;
