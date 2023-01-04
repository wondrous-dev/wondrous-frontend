import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import Link from 'next/link';
import { useMemo } from 'react';
import { useGlobalContext } from 'utils/hooks';

const OrgSelector = () => {
  const { pageData } = useGlobalContext();
  const activePodOrg = useMemo(() => pageData?.pod?.org, [pageData?.pod]);

  const activeOrg = pageData?.orgData;
  const { profilePicture, username } = activeOrg || activePodOrg || {};

  return (
    <Link href={`/organization/${username}/home`}>
      <OrgProfilePicture profilePicture={profilePicture} style={{ height: '24px', width: '24px' }} />
    </Link>
  );
};

export default OrgSelector;
