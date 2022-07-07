import { FeaturedList, gridMobileStyles } from './constants';
import {
  OrgDescription,
  OrgName,
  StyledGridContainer,
  StyledGridItem,
  OrgsSectionHeader,
  SectionSubheader,
  SectionWrapper,
  BountySectionHeader,
  ShowMoreButtonWrapper,
} from './styles';
import { SafeImage } from '../Common/Image';
import Link from 'next/link';
import BountyBoard from 'components/Common/BountyBoard';
import { ShowMoreButton } from 'components/ListView/styles';
import TaskViewModal from 'components/Common/TaskViewModal';
import { useRouter } from 'next/router';
import { delQuery } from 'utils';
import { useLocation } from 'utils/useLocation';
import { useState, useEffect } from 'react';
import palette from 'theme/palette';

const OrgItem = ({ org }) => {
  const { username, headerUrl, bio, imageUrl, name, headerImage } = org;
  return (
    <Link href={`/organization/${username}/boards`}>
      <StyledGridItem>
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
              background: palette.black,
            }}
          />
        </div>
        <OrgName>{name}</OrgName>
        <OrgDescription>{bio}</OrgDescription>
      </StyledGridItem>
    </Link>
  );
};

export const DaoSection = ({ isMobile }) => {
  return (
    <SectionWrapper>
      <OrgsSectionHeader>Our Alpha Partners</OrgsSectionHeader>
      <SectionSubheader>Work with the best DAO partners in the space.</SectionSubheader>
      <StyledGridContainer
        spacing={3}
        columns={{ xs: 1, sm: 2, md: 2, lg: 3 }}
        style={isMobile ? gridMobileStyles : {}}
      >
        {FeaturedList.map((org, index) => (
          <OrgItem key={index} org={org} />
        ))}
      </StyledGridContainer>
    </SectionWrapper>
  );
};

let windowOffset = 0;

export const BountySection = ({ isMobile, bounties = [], fetchMore = () => {}, hasMore }) => {
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const location = useLocation();

  const handleCardClick = (bounty) => {
    const newUrl = `${delQuery(router.asPath)}?task=${bounty?.id}`;
    location.push(newUrl);
    windowOffset = window.scrollY;
    document.body.setAttribute('style', `position: fixed; top: -${windowOffset}px; left:0; right:0`);
  };

  useEffect(() => {
    const params = location.params;
    if (params.task || params.taskProposal) {
      setOpenModal(true);
    }
  }, [location]);

  const handleModalClose = () => {
    const style = document.body.getAttribute('style');
    const top = style.match(/(?<=top: -)(.*?)(?=px)/);
    document.body.setAttribute('style', '');
    if (top?.length > 0) {
      window?.scrollTo(0, Number(top[0]));
    }
    let newUrl = `${delQuery(router.asPath)}`;
    location.push(newUrl);
    setOpenModal(false);
  };

  return (
    <SectionWrapper>
      <BountySectionHeader>Discover work</BountySectionHeader>
      <SectionSubheader>Make crypto while contributing to your favorite DAOs</SectionSubheader>

      <StyledGridContainer
        container
        spacing={3}
        columns={{ xs: 1, sm: 2, lg: 3 }}
        style={isMobile ? gridMobileStyles : {}}
      >
        <TaskViewModal
          disableEnforceFocus
          open={openModal}
          shouldFocusAfterRender={false}
          handleClose={handleModalClose}
          taskId={location?.params?.task?.toString()}
        />

        <BountyBoard tasks={bounties} handleCardClick={handleCardClick} />
      </StyledGridContainer>
      {hasMore && !!bounties?.length && (
        <ShowMoreButtonWrapper>
          <ShowMoreButton type="button" onClick={() => fetchMore()}>
            Show more
          </ShowMoreButton>
        </ShowMoreButtonWrapper>
      )}
    </SectionWrapper>
  );
};
