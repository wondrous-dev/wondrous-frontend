import { FeaturedList, gridMobileStyles } from './constants';
import { OrgDescription, OrgName, StyledGridContainer, StyledGridItem, StyledGridItemContainer } from './styles';
import { SafeImage } from '../Common/Image';
import Link from 'next/link';

const OrgItem = ({ org }) => {
  const { username, headerUrl, bio, imageUrl, name, headerImage } = org;
  return (
    <StyledGridItemContainer item md={4}>
      <Link href={`/organization/${username}/boards`}>
        <StyledGridItem key={username}>
          {headerImage && <>{headerImage}</>}
          {headerUrl && (
            <SafeImage
              style={{
                width: '100%',
                borderRadius: '12px 12px 0px 0px',
                objectFit: 'cover',
              }}
              src={headerUrl}
            />
          )}
          <div>
            <SafeImage
              src={imageUrl}
              style={{
                borderRadius: '5px',
                width: '64px',
                border: '4px solid #1E1E1E',
                height: '64px',
                marginTop: '-32px',
                marginBottom: '16px',
                objectFit: 'cover',
              }}
            />
          </div>
          <OrgName>{name}</OrgName>
          <OrgDescription>{bio}</OrgDescription>
        </StyledGridItem>
      </Link>
    </StyledGridItemContainer>
  );
};

export const DaoSection = ({ isMobile }) => {
  return (
    <StyledGridContainer container spacing={3} columns={3} style={isMobile ? gridMobileStyles : {}}>
      {FeaturedList.map((org, index) => (
        <OrgItem key={index} org={org} />
      ))}
    </StyledGridContainer>
  );
};

export const BountySection = ({ isMobile, bounties }) => {
  return (
    <StyledGridContainer container spacing={3} columns={3} style={isMobile ? gridMobileStyles : {}}>
      {bounties.map(
        (bounty, index) => null
        // <OrgItem key={index} org={org} />
      )}
    </StyledGridContainer>
  );
};
