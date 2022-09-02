import SmartLink from 'components/Common/SmartLink';
import { DAOIcon } from 'components/Icons/dao';
import { NoLogoDAO } from 'components/Common/SidebarMain/styles';
import { format } from 'date-fns';
import { LINK } from 'utils/constants';

import { SafeImage } from 'components/Common/Image';
import {
  OrgCardWrapper,
  OrgCardBorderContainer,
  OrgCardTitleContainer,
  OrgCardImageWrapper,
  OrgCardTitle,
  OrgCardDescription,
  OrgCardInfo,
  OrgCardSection,
  OrgCardSectionPurpleText,
  OrgCardSectionChip,
  OrgCardSectionWhiteText,
} from './styles';

function OrgCard({ item }) {
  const userOrg = item;
  const org = item?.org;
  const role = item?.role;
  const taskViewUrl = `${LINK}/organization/${org?.username}/boards`;
  return (
    <SmartLink href={taskViewUrl} asLink>
      <OrgCardWrapper>
        <OrgCardBorderContainer>
          <OrgCardTitleContainer>
            <OrgCardImageWrapper>
              <SafeImage
                src={org?.thumbnailPicture || org?.profilePicture}
                placeholderComp={
                  <NoLogoDAO>
                    <DAOIcon />
                  </NoLogoDAO>
                }
                width="32px"
                height="32px"
                useNextImage
                style={{
                  borderRadius: '5px',
                }}
              />
            </OrgCardImageWrapper>

            <OrgCardTitle>{org.name}</OrgCardTitle>
          </OrgCardTitleContainer>

          <OrgCardDescription>{org.description}</OrgCardDescription>
        </OrgCardBorderContainer>
        <OrgCardInfo>
          <OrgCardSection>
            <OrgCardSectionPurpleText>Roles:</OrgCardSectionPurpleText>
            <OrgCardSectionChip>{role.name}</OrgCardSectionChip>
          </OrgCardSection>
          {/* <Box sx={styles.cardSection}>
          <Typography sx={styles.purpleText}>Tasks completed: </Typography>
          <Typography sx={styles.whiteText}>{0}</Typography>
        </Box> */}
          <OrgCardSection>
            <OrgCardSectionPurpleText>Member Since:</OrgCardSectionPurpleText>
            <OrgCardSectionWhiteText>{format(new Date(userOrg.joinedAt), 'MMM d yyyy')}</OrgCardSectionWhiteText>
          </OrgCardSection>
        </OrgCardInfo>
      </OrgCardWrapper>
    </SmartLink>
  );
}
export default OrgCard;
