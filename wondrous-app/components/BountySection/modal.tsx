import { useLazyQuery } from '@apollo/client';
import { EXPLORE_MODAL_TABS_MAP, LINK } from 'utils/constants';
import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import { CircularProgress } from '@mui/material';
import { GET_GR15_GRANTEES, GET_GR15_SPONSORS } from 'graphql/queries/org';
import { TaskModalBaseCard } from 'components/Common/Task/styles';
import CloseModalIcon from 'components/Icons/closeModal';
import {
  ActivityIndicatorContainer,
  CloseIconContainer,
  Container,
  ExploreStyledTabs,
  OverflowBox,
  StyledTab,
  TabText,
  Title,
  TitleSection,
} from 'components/profile/modals/styles';

import { SafeImage } from 'components/Common/Image';
import { TokenEmptyLogo } from 'components/organization/wrapper/styles';
import { DAOEmptyIcon } from 'components/Icons/dao';
import { OrgItemContainer, OrgItemDescription, OrgItemDescriptionDiv, OrgItemDescriptionTitle } from './styles';

const OrgItem = (props) => {
  const { org } = props;
  return (
    <OrgItemContainer
      onClick={() => {
        window.open(`${LINK}/organization/${org?.username}/boards?entity=task`);
      }}
    >
      <SafeImage
        src={org?.profilePicture}
        placeholderComp={
          <TokenEmptyLogo>
            <DAOEmptyIcon />
          </TokenEmptyLogo>
        }
        width="42px"
        height="42px"
        useNextImage
        style={{
          borderRadius: '6px',
        }}
      />
      <OrgItemDescriptionDiv>
        <OrgItemDescriptionTitle>{org?.name}</OrgItemDescriptionTitle>
        <OrgItemDescription>{org?.description}</OrgItemDescription>
      </OrgItemDescriptionDiv>
    </OrgItemContainer>
  );
};

export default function ExploreOrgGr15Modal(props) {
  const { showSponsors, showGrantees, setShowSponsors, setShowGrantees, open, handleClose, name } = props;
  const [listLoading, setListLoading] = useState(true);
  const [sponsorList, setSponsorList] = useState([]);
  const [granteeList, setGranteeList] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [getGr15Sponsors] = useLazyQuery(GET_GR15_SPONSORS, {
    onCompleted: (data) => {
      const sponsorData = data.getGr15Sponsors;
      setSponsorList(sponsorData || []);
      setListLoading(false);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getGr15Grantees] = useLazyQuery(GET_GR15_GRANTEES, {
    onCompleted: (data) => {
      const granteeData = data.getGr15Grantees;
      setGranteeList(granteeData || []);
      setListLoading(false);
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (showSponsors) {
      setActiveTab(EXPLORE_MODAL_TABS_MAP.SPONSORS);
      getGr15Sponsors();
    }
    if (showGrantees) {
      setActiveTab(EXPLORE_MODAL_TABS_MAP.GRANTEES);
      getGr15Grantees();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setShowGrantees, setShowSponsors, showSponsors, showGrantees]);

  return (
    <Modal
      open={open}
      onClose={() => {
        setShowSponsors(false);
        setShowGrantees(false);
        setActiveTab(null);
        handleClose();
      }}
    >
      <TaskModalBaseCard>
        <TitleSection>
          <Title>{name}</Title>
          <CloseIconContainer
            onClick={() => {
              setShowSponsors(false);
              setShowGrantees(false);
              setActiveTab(null);
              handleClose();
            }}
          >
            <CloseModalIcon />
          </CloseIconContainer>
        </TitleSection>
        <Container
          style={{
            marginBottom: '8px !important',
          }}
        >
          <ExploreStyledTabs value={activeTab} variant="fullWidth">
            <TabText
              onClick={() => {
                setShowGrantees(false);
                setShowSponsors(true);
                setActiveTab(EXPLORE_MODAL_TABS_MAP.SPONSORS);
                getGr15Sponsors();
              }}
            >
              <StyledTab isActive={activeTab === EXPLORE_MODAL_TABS_MAP.SPONSORS} label="Sponsors" />
            </TabText>
            <TabText
              onClick={() => {
                setShowGrantees(true);
                setShowSponsors(false);
                setActiveTab(EXPLORE_MODAL_TABS_MAP.GRANTEES);
                getGr15Grantees();
              }}
            >
              <StyledTab isActive={activeTab === EXPLORE_MODAL_TABS_MAP.GRANTEES} label="Grantees" />{' '}
            </TabText>
          </ExploreStyledTabs>
        </Container>
        {showSponsors && (
          <OverflowBox>
            {listLoading && (
              <ActivityIndicatorContainer>
                <CircularProgress />
              </ActivityIndicatorContainer>
            )}
            {sponsorList.map((org, i) => (
              <OrgItem key={org?.id} org={org} />
            ))}
          </OverflowBox>
        )}
        {showGrantees && (
          <OverflowBox>
            {listLoading && (
              <ActivityIndicatorContainer>
                <CircularProgress />
              </ActivityIndicatorContainer>
            )}

            {granteeList.map((org, i) => (
              <OrgItem key={org?.id} org={org} />
            ))}
          </OverflowBox>
        )}
      </TaskModalBaseCard>
    </Modal>
  );
}
