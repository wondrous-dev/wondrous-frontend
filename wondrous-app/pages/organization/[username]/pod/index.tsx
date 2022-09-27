import { useState } from 'react';
import {
  PodPageWrapper,
  PodPageInnerContainer,
  MainHeading,
  TabContainer,
  ShowALlTab,
  PodsIamInTab,
  PodsIamNotInTab,
  TabsOptionContainer,
  TabsOption,
  SearchBarContainer,
  SearchBarIcon,
  SearchInput,
} from './styles';
// import { GET_ORG_PODS } from 'graphql/queries/org';
// import { useLazyQuery } from '@apollo/client';

const PodPage = ({ orgData }) => {
  enum TabState {
    ShowAll = 'showAll',
    PodsIamIn = 'podsIamIn',
    PodsIamNotIn = 'podsIamNotIn',
  }

  const [tabState, setTabState] = useState(TabState.ShowAll);
  const [searchText, setSerchText] = useState('');

  return (
    <PodPageWrapper>
      <PodPageInnerContainer>
        <MainHeading>Pods in Wonderverse</MainHeading>
        <TabsOptionContainer>
          <TabsOption onClick={() => setTabState(TabState.ShowAll)} active={tabState === TabState.ShowAll}>
            Show all
          </TabsOption>
          <TabsOption onClick={() => setTabState(TabState.PodsIamIn)} active={tabState === TabState.PodsIamIn}>
            Pods I'm in
          </TabsOption>
          <TabsOption onClick={() => setTabState(TabState.PodsIamNotIn)} active={tabState === TabState.PodsIamNotIn}>
            Pods I'm not in
          </TabsOption>
        </TabsOptionContainer>

        <TabContainer>
          <ShowALlTab active={tabState === TabState.ShowAll}>
            <SearchBarContainer>
              <SearchBarIcon />
              <SearchInput
                placeholder="Search pods..."
                value={searchText}
                onChange={(e) => setSerchText(e.target.value)}
              />
            </SearchBarContainer>
          </ShowALlTab>

          <PodsIamInTab active={tabState === TabState.PodsIamIn}>
            <MainHeading>Hello I am Tab 2</MainHeading>
          </PodsIamInTab>

          <PodsIamNotInTab active={tabState === TabState.PodsIamNotIn}>
            <MainHeading>Hello I am Tab 3</MainHeading>
          </PodsIamNotInTab>
        </TabContainer>
      </PodPageInnerContainer>
    </PodPageWrapper>
  );
};

export default PodPage;
