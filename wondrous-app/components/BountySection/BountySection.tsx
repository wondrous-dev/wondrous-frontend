import { useState, useEffect } from 'react';
import BountyBoard from 'components/Common/BountyBoard';
import { ShowMoreButton } from 'components/Common/ListViewAccordion/styles';
import TaskViewModal from 'components/Common/TaskViewModal';
import { useRouter } from 'next/router';
import { delQuery } from 'utils';
import { useLocation } from 'utils/useLocation';
import {
  BountySectionHeader,
  SectionSubheader,
  SectionWrapper,
  ShowMoreButtonWrapper,
  StyledGridContainer,
} from './styles';

const BountySection = ({ isMobile, bounties = [], fetchMore = () => {}, hasMore }) => {
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const location = useLocation();

  const handleCardClick = (bounty) => {
    const newUrl = `${delQuery(router.asPath)}?task=${bounty?.id}`;
    location.push(newUrl);
    document.body.setAttribute('style', `position: fixed; top: -${window.scrollY}px; left:0; right:0`);
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

      <BountyBoard Container={StyledGridContainer} tasks={bounties} displayOrg handleCardClick={handleCardClick} />
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

export default BountySection;
