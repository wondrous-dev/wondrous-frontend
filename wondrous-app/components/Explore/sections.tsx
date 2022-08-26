import Link from 'next/link';
import BountyBoard from 'components/Common/BountyBoard';
import { ShowMoreButton } from 'components/Common/ListViewAccordion/styles';
import TaskViewModal from 'components/Common/TaskViewModal';
import { useRouter } from 'next/router';
import { delQuery } from 'utils';
import { useLocation } from 'utils/useLocation';
import { useState, useEffect } from 'react';
import { SafeImage } from '../Common/Image';
import {
  OrgDescription,
  OrgName,
  StyledGridItem,
  OrgsSectionHeader,
  SectionSubheader,
  SectionWrapper,
  BountySectionHeader,
  ShowMoreButtonWrapper,
  Masonry,
  LogoContainer,
} from './styles';
import { FeaturedList } from './constants';

function OrgItem({ org }) {
  const { username, headerUrl, bio, imageUrl, name, headerImage } = org;

  return (
    <Link href={`/organization/${username}/boards`}>
      <StyledGridItem>
        {headerImage}
        {headerUrl && <SafeImage useNextImage={false} style={{ width: '100%' }} src={headerUrl} />}
        <LogoContainer>
          <SafeImage useNextImage width={56} height={56} src={imageUrl} />
        </LogoContainer>
        <OrgName>{name}</OrgName>
        <OrgDescription>{bio}</OrgDescription>
      </StyledGridItem>
    </Link>
  );
}

export function DaoSection() {
  return (
    <SectionWrapper>
      <OrgsSectionHeader>Our Alpha Partners</OrgsSectionHeader>
      <SectionSubheader>Work with the best DAO partners in the space.</SectionSubheader>
      <Masonry>
        {FeaturedList.map((org, index) => (
          <OrgItem key={index} org={org} />
        ))}
      </Masonry>
    </SectionWrapper>
  );
}

let windowOffset = 0;

export function BountySection({ bounties = [], fetchMore = () => {}, hasMore }) {
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
    const { params } = location;
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
    const newUrl = `${delQuery(router.asPath)}`;
    location.push(newUrl);
    setOpenModal(false);
  };

  return (
    <SectionWrapper>
      <BountySectionHeader>Discover work</BountySectionHeader>
      <SectionSubheader>Make crypto while contributing to your favorite DAOs</SectionSubheader>

      <TaskViewModal
        disableEnforceFocus
        open={openModal}
        shouldFocusAfterRender={false}
        handleClose={handleModalClose}
        taskId={location?.params?.task?.toString()}
      />

      <BountyBoard Container={Masonry} tasks={bounties} displayOrg handleCardClick={handleCardClick} />
      {hasMore && !!bounties?.length && (
        <ShowMoreButtonWrapper>
          <ShowMoreButton type="button" onClick={() => fetchMore()}>
            Show more
          </ShowMoreButton>
        </ShowMoreButtonWrapper>
      )}
    </SectionWrapper>
  );
}
