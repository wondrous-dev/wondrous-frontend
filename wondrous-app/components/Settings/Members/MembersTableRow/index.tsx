import { useEffect, useState } from 'react';
import Link from 'next/link';
import MemberRoleDropdown from 'components/Settings/Members/MemberRoleDropdown';
import { SafeImage } from 'components/Common/Image';
import CopyIcon from 'components/Icons/copy';
import { useWonderWeb3 } from 'services/web3';
import PodIcon from 'components/Icons/podIcon';
import { DropDown, DropDownItem } from 'components/Common/dropdown';
import { TaskMenuIcon } from 'components/Icons/taskMenu';
import MemberRoleSelectionDropdown from './MemberRoleSelectionDropdown';
import {
  DefaultProfilePicture,
  UserOptions,
  UserPodCount,
  UserPodIconContainer,
  UserProfile,
  UserProfileDetailsContainer,
  UserProfileName,
  UserProfileNameContainer,
  UserProfileUsername,
  UserRowWrapper,
  UserWalletAddress,
  UserWalletAddressContainer,
  WalletAddressEmptyState,
} from './styles';
import { addressTag } from './helpers';

const MemberTableRow = ({ user, role, orgId, podId, roleList }) => {
  const [hasAddressBeenCopied, setHasAddressBeenCopied] = useState(false);
  const [userWalletAddressTag, setUserWalletAddressTag] = useState('');

  const wonderWeb3 = useWonderWeb3();

  useEffect(() => {
    if (user?.activeEthAddress) {
      setUserWalletAddressTag(user.activeEthAddress);

      wonderWeb3.getENSNameFromEthAddress(user.activeEthAddress).then((ensName) => {
        if (ensName) {
          setUserWalletAddressTag(ensName);
        }
      });
    }
  }, [user?.activeEthAddress]);

  const userId = user?.id;
  const userProfilePicture = user?.thumbnailPicture;
  const userFullName = user?.firstName && `${user?.firstName} ${user?.lastName}` && user?.lastName;
  const username = `@${user?.username}`;

  // const userWalletAddress = user?.activeEthAddress;
  const userPodCount = +user?.additionalInfo?.podCount;

  const handleAddressCopy = () => {
    navigator.clipboard.writeText(userWalletAddressTag);
    setHasAddressBeenCopied(true);

    setTimeout(() => {
      setHasAddressBeenCopied(false);
    }, 1500);
  };

  return (
    <UserRowWrapper>
      <Link href={`/profile/${user?.username}/about`} passHref>
        <UserProfile>
          {userProfilePicture ? (
            <SafeImage
              useNextImage={false}
              src={userProfilePicture}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
              }}
            />
          ) : (
            <DefaultProfilePicture />
          )}
          <UserProfileNameContainer>
            {!!userFullName && <UserProfileName>{userFullName}</UserProfileName>}
            <UserProfileUsername>{username}</UserProfileUsername>
          </UserProfileNameContainer>
        </UserProfile>
      </Link>
      <UserProfileDetailsContainer>
        {userWalletAddressTag ? (
          <UserWalletAddressContainer hasAddressBeenCopied={hasAddressBeenCopied} onClick={handleAddressCopy}>
            <UserWalletAddress hasAddressBeenCopied={hasAddressBeenCopied}>
              {hasAddressBeenCopied ? 'Text copied!' : addressTag(userWalletAddressTag)}
            </UserWalletAddress>
            <CopyIcon color={hasAddressBeenCopied ? '#06FFA5' : '#CCBBFF'} />
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
          <UserPodIconContainer>
            <PodIcon strokeColor="#CCBBFF" />
          </UserPodIconContainer>
          {userPodCount || 0} {userPodCount ? 'Pods' : 'Pod'}
        </UserPodCount>
        <UserOptions>
          <DropDown DropdownHandler={() => <TaskMenuIcon fill="transparent" fillOnHover="transparent" stroke="#fff" />}>
            <DropDownItem
              onClick={() => {}}
              style={{
                color: '#fff',
                zIndex: 120,
              }}
            >
              Remove Member
            </DropDownItem>
          </DropDown>
        </UserOptions>
      </UserProfileDetailsContainer>
    </UserRowWrapper>
  );
};

export default MemberTableRow;
