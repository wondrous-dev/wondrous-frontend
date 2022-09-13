import { useState, useEffect } from 'react';
import BountyBoard from 'components/Common/BountyBoard';
import { ShowMoreButton } from 'components/Common/ListViewAccordion/styles';
import TaskViewModal from 'components/Common/TaskViewModal';
import { useRouter } from 'next/router';
import { delQuery } from 'utils';
import { useLocation } from 'utils/useLocation';
import { ButtonPrimary } from 'components/Common/button';
import {
  BountySectionHeader,
  Gr15DEIExplainer,
  GR15DEIExplainerContainer,
  Gr15DEIExplainerDescription,
  Gr15DEIExplainerSubheader,
  Gr15DEIExplainerInnerDiv,
  Gr15DEIExplainerTitleText,
  Gr15DEIExploreOrgsContainer,
  SectionSubheader,
  SectionWrapper,
  ShowMoreButtonWrapper,
  StyledGridContainer,
  Gr15DEIExploreOrgsInnerDiv,
  Gr15DEIButtonText,
  Gr15DEIButtonDiv,
} from './styles';
import ExploreOrgGr15Modal from './modal';

const BountySection = ({ isMobile, bounties = [], fetchMore = () => {}, hasMore, gr15DEI }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openExploreGr15Modal, setExploreGr15Modal] = useState(false);
  const [showSponsors, setShowSponsors] = useState(false);
  const [showGrantees, setShowGrantees] = useState(false);
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
      {gr15DEI ? (
        <GR15DEIExplainerContainer container spacing={2}>
          <ExploreOrgGr15Modal
            showSponsors={showSponsors}
            setShowSponsors={setShowSponsors}
            showGrantees={showGrantees}
            setShowGrantees={setShowGrantees}
            open={openExploreGr15Modal}
            handleClose={() => setExploreGr15Modal(false)}
          />
          <Gr15DEIExplainer item sm={6} xs={12}>
            <Gr15DEIExplainerInnerDiv>
              <Gr15DEIExplainerTitleText>Gitcoin Grants Round 15</Gr15DEIExplainerTitleText>
              <Gr15DEIExplainerSubheader>Diversity, Equity and Inclusion</Gr15DEIExplainerSubheader>
              <Gr15DEIExplainerDescription>
                Help advance DEI in web3, ensuring individuals from all backgrounds have an equal opportunity to
                participate. Members get exclusive access to opportunities on this page.
              </Gr15DEIExplainerDescription>
            </Gr15DEIExplainerInnerDiv>
          </Gr15DEIExplainer>
          <Gr15DEIExploreOrgsContainer item sm={6} xs={12}>
            <Gr15DEIExplainerInnerDiv
              style={{
                padding: '0',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                style={{
                  height: '100%',
                  borderTopLeftRadius: '8px',
                  borderBottomLeftRadius: '8px',
                }}
                src="/images/initiatives/gr15DEI/explore.png"
                alt="gr15 explore icon"
              />
              <Gr15DEIExploreOrgsInnerDiv>
                <Gr15DEIExplainerTitleText
                  style={{
                    fontSize: '18px',
                  }}
                >
                  Which orgs are part of the scheme?
                </Gr15DEIExplainerTitleText>
                <Gr15DEIButtonDiv>
                  <ButtonPrimary
                    style={{
                      marginRight: '8px',
                    }}
                    onClick={() => {
                      setShowSponsors(true);
                      setExploreGr15Modal(true);
                    }}
                  >
                    <Gr15DEIButtonText>Explore Sponsors</Gr15DEIButtonText>
                  </ButtonPrimary>
                  <ButtonPrimary
                    style={{
                      marginRight: '8px',
                    }}
                    onClick={() => {
                      setShowGrantees(true);
                      setExploreGr15Modal(true);
                    }}
                  >
                    {' '}
                    <Gr15DEIButtonText>Explore Grantees</Gr15DEIButtonText>
                  </ButtonPrimary>
                </Gr15DEIButtonDiv>
              </Gr15DEIExploreOrgsInnerDiv>
            </Gr15DEIExplainerInnerDiv>
          </Gr15DEIExploreOrgsContainer>
        </GR15DEIExplainerContainer>
      ) : (
        <>
          <BountySectionHeader>Discover work</BountySectionHeader>
          <SectionSubheader>Make crypto while contributing to your favorite DAOs</SectionSubheader>
        </>
      )}

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
