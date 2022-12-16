import { useLazyQuery } from '@apollo/client';
import { EXPLORE_MODAL_TABS_MAP, LINK } from 'utils/constants';
import React, { useCallback, useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
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
        window.open(`${LINK}/organization/${org?.username}/home`);
      }}
    >
      <SafeImage
        src={org?.profilePicture}
        placeholderComp={
          <TokenEmptyLogo>
            <DAOEmptyIcon />
          </TokenEmptyLogo>
        }
        width={42}
        height={42}
        useNextImage
        style={{
          borderRadius: '6px',
        }}
        alt="Organization logo"
      />
      <OrgItemDescriptionDiv>
        <OrgItemDescriptionTitle>{org?.name}</OrgItemDescriptionTitle>
        <OrgItemDescription>{org?.description}</OrgItemDescription>
      </OrgItemDescriptionDiv>
    </OrgItemContainer>
  );
};

export default function ExploreOrgGr15Modal(props) {
  const { showSponsors, showGrantees, setShowSponsors, setShowGrantees, open, handleClose } = props;
  const [listLoading, setListLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const [getGr15Sponsors, { data: sponsorData }] = useLazyQuery(GET_GR15_SPONSORS, {
    onCompleted: () => {
      setListLoading(false);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getGr15Grantees, { data: granteeData }] = useLazyQuery(GET_GR15_GRANTEES, {
    onCompleted: () => {
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

  const setActiveTabCallback = useCallback(
    (tab) => {
      if (tab === EXPLORE_MODAL_TABS_MAP.SPONSORS) {
        setShowGrantees(false);
        setShowSponsors(true);
        setActiveTab(EXPLORE_MODAL_TABS_MAP.SPONSORS);
        getGr15Sponsors();
      } else if (tab === EXPLORE_MODAL_TABS_MAP.GRANTEES) {
        setShowGrantees(true);
        setShowSponsors(false);
        setActiveTab(EXPLORE_MODAL_TABS_MAP.GRANTEES);
        getGr15Grantees();
      }
    },
    [setShowGrantees, setShowSponsors, setActiveTab, getGr15Grantees, getGr15Sponsors]
  );

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
          <Title>{showSponsors ? 'GR15-DEI sponsors' : 'GR15-DEI grantees'}</Title>
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
                setActiveTabCallback(EXPLORE_MODAL_TABS_MAP.SPONSORS);
              }}
            >
              <StyledTab isActive={activeTab === EXPLORE_MODAL_TABS_MAP.SPONSORS} label="Sponsors" />
            </TabText>
            <TabText
              onClick={() => {
                setActiveTabCallback(EXPLORE_MODAL_TABS_MAP.GRANTEES);
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
            {sponsorData?.getGr15Sponsors.map((org, i) => (
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

            {granteeData?.getGr15Grantees.map((org, i) => (
              <OrgItem key={org?.id} org={org} />
            ))}
          </OverflowBox>
        )}
      </TaskModalBaseCard>
    </Modal>
  );
}
