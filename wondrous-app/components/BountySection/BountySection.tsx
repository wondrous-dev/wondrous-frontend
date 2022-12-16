import { useState } from 'react';
import BountyBoard from 'components/Common/BountyBoard';
import { ShowMoreButton } from 'components/Common/ListViewAccordion/styles';
import { useTaskActions } from 'utils/hooks';
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
  Gr15Img,
} from './styles';
import ExploreOrgGr15Modal from './modal';

const BountyBoardContainer = ({ children }) => (
  <StyledGridContainer columns={{ xs: 1, sm: 2, md: 2, lg: 3 }}>{children}</StyledGridContainer>
);

const BountySection = ({ bounties = [], fetchMore = () => {}, hasMore, gr15DEI }) => {
  const [openExploreGr15Modal, setExploreGr15Modal] = useState(false);
  const [showSponsors, setShowSponsors] = useState(false);
  const [showGrantees, setShowGrantees] = useState(false);
  const { openTaskViewModal } = useTaskActions();

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
              <Gr15Img src="/images/initiatives/gr15DEI/explore.png" alt="gr15 explore icon" />
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
          <BountySectionHeader>Explore work</BountySectionHeader>
          <SectionSubheader>Make crypto while contributing to your favorite web3 teams</SectionSubheader>
        </>
      )}

      <BountyBoard Container={BountyBoardContainer} tasks={bounties} displayOrg handleCardClick={openTaskViewModal} />
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
