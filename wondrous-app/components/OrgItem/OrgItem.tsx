import Link from 'next/link';
import palette from 'theme/palette';

import { SafeImage } from 'components/Common/Image';

import { OrgDescription, OrgName, StyledGridItem } from './styles';

const OrgItem = ({ org }) => {
  const { username, headerUrl, bio, imageUrl, name, headerImage } = org;
  return (
    <Link href={`/organization/${username}/boards`} style={{ textDecoration: 'none' }} passHref>
      <StyledGridItem>
        {headerImage && headerImage}
        {headerUrl && (
          <SafeImage
            useNextImage={false}
            style={{
              width: '100%',
              borderRadius: '12px 12px 0px 0px',
              objectFit: 'cover',
            }}
            src={headerUrl}
            alt="DAO logo"
          />
        )}
        <div>
          <SafeImage
            useNextImage={false}
            src={imageUrl}
            style={{
              borderRadius: '5px',
              width: '64px',
              border: '4px solid #1E1E1E',
              height: '64px',
              marginTop: '-32px',
              marginBottom: '16px',
              objectFit: 'cover',
              background: palette.black,
            }}
            alt="Image"
          />
        </div>
        <OrgName>{name}</OrgName>
        <OrgDescription>{bio}</OrgDescription>
      </StyledGridItem>
    </Link>
  );
};

export default OrgItem;
