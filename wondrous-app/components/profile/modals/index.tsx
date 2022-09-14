import React, { forwardRef, useEffect, useRef, useState } from 'react';
import Modal from '@mui/material/Modal';
import { CircularProgress } from '@mui/material';
import { GET_ORG_PODS, GET_ORG_USERS } from 'graphql/queries/org';
import { GET_POD_USERS } from 'graphql/queries/pod';
import { useLazyQuery } from '@apollo/client';

import SearchIcon from 'components/Icons/search';
import { TaskModalBaseCard } from 'components/Common/Task/styles';
import { useRouter } from 'next/router';
import { CommentTopFlexDiv } from 'components/Comment/styles';
import { cutString } from 'utils/helpers';
import { RichTextViewer } from 'components/RichText';
import CloseModalIcon from 'components/Icons/closeModal';
import { MODAL_TABS_MAP } from 'utils/constants';
import {
  ActivityIndicatorContainer,
  CloseIconContainer,
  CommentLine,
  Container,
  DefaultProfilePicture,
  NameText,
  OverflowBox,
  PodExplainerText,
  PodWrapper,
  SearchBox,
  SearchIconContainer,
  Snap,
  StyledTab,
  StyledTabs,
  TabContainerText,
  TabText,
  Title,
  TitleSection,
  UserMetaDataContainer,
  UserProfilePicture,
  UserWrapper,
} from './styles';

const PodItem = forwardRef((props: any, ref) => {
  const router = useRouter();
  const { pod } = props;
  return (
    <PodWrapper
      ref={ref}
      onClick={() =>
        router.push(`/pod/${pod?.id}/boards`, undefined, {
          shallow: true,
        })
      }
    >
      <TabContainerText>{pod?.name}</TabContainerText>
      <PodExplainerText>
        <RichTextViewer text={pod?.description} />
      </PodExplainerText>
    </PodWrapper>
  );
});

const UserItem = forwardRef((props: any, ref) => {
  const router = useRouter();
  const { user } = props;

  return (
    <UserWrapper
      ref={ref}
      onClick={() =>
        router.push(`/profile/${user?.username}/about`, undefined, {
          shallow: true,
        })
      }
    >
      {user?.profilePicture ? (
        <UserProfilePicture src={user?.thumbnailPicture || user?.profilePicture} />
      ) : (
        <DefaultProfilePicture />
      )}
      <UserMetaDataContainer>
        <CommentTopFlexDiv>
          <NameText>{user?.username}</NameText>
        </CommentTopFlexDiv>
        <CommentLine>{cutString(user?.bio)}</CommentLine>
      </UserMetaDataContainer>
    </UserWrapper>
  );
});

export function MoreInfoModal(props) {
  const { orgId, podId, showUsers, showPods, open, handleClose, name } = props;
  const [displayUsers, setDisplayUsers] = useState(showUsers);
  const [listLoading, setListLoading] = useState(true);
  const [displayPods, setDisplayPods] = useState(showPods);
  const [userList, setUserList] = useState([]);
  const [podList, setPodList] = useState([]);
  const [searchedUserList, setSearchedUserList] = useState([]);
  const [searchedPodList, setSearchedPodList] = useState([]);
  const [paginatedUserList, setPaginatedUserList] = useState([]);
  const [paginatedPodList, setPaginatedPodList] = useState([]);
  const usersOverflowBoxRef = useRef(null);
  const userListItemRef = useRef(null);
  const podsOverflowBoxRef = useRef(null);
  const podListItemRef = useRef(null);
  const [activeTab, setActiveTab] = useState(MODAL_TABS_MAP.CONTRIBUTORS);
  const [getOrgPods, { data: orgPodData }] = useLazyQuery(GET_ORG_PODS);
  const [userVirtualPaginationCount, setUserVirtualPaginationCount] = useState(5);
  const [podVirtualPaginationCount, setPodVirtualPaginationCount] = useState(5);
  const shouldMonitorUsersListRef = useRef(true);
  const shouldMonitorPodsListRef = useRef(true);

  const [getOrgUsers] = useLazyQuery(GET_ORG_USERS, {
    onCompleted: (data) => {
      const userData = data.getOrgUsers;
      const filteredData = userData?.map((userRole) => userRole.user);
      setUserList(filteredData || []);
      setListLoading(false);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getPodUsers] = useLazyQuery(GET_POD_USERS, {
    onCompleted: (data) => {
      const userData = data.getPodUsers;
      const filteredData = userData?.map((userRole) => userRole.user);
      setUserList(filteredData || []);
      setListLoading(false);
    },
    fetchPolicy: 'cache-and-network',
  });

  const pods = orgPodData?.getOrgPods;

  const SEARCH_TYPE_USER = 1;
  const SEARCH_TYPE_POD = 2;

  const searchUserOrPod = (searchQuery, searchType = SEARCH_TYPE_USER) => {
    const localSearchQuery = searchQuery.toLowerCase();
    const listToSearch = searchType === SEARCH_TYPE_USER ? userList : podList;
    const setFunctionForListToSearch = searchType === SEARCH_TYPE_USER ? setSearchedUserList : setSearchedPodList;
    if (searchQuery) {
      const searchFields = searchType === SEARCH_TYPE_USER ? ['username', 'bio'] : ['name', 'description'];
      const newList = listToSearch.filter((item) =>
        searchFields.some((field) => item[field]?.toLowerCase().includes(localSearchQuery))
      );
      setFunctionForListToSearch(newList);
    } else setFunctionForListToSearch(listToSearch);
  };

  const paginateDataList = (dataList, perPageCount) =>
    Array(Math.ceil(dataList.length / perPageCount))
      .fill(null)
      .map((_, index) => index * perPageCount)
      .map((currentPageStartIndex) => dataList.slice(currentPageStartIndex, currentPageStartIndex + perPageCount));

  useEffect(() => {
    if (searchedUserList) {
      const newPaginatedUserList = paginateDataList(searchedUserList, userVirtualPaginationCount);
      setPaginatedUserList(newPaginatedUserList);
    }
  }, [searchedUserList, userVirtualPaginationCount]);

  useEffect(() => {
    if (searchedPodList) {
      const newPaginatedPodList = paginateDataList(searchedPodList, podVirtualPaginationCount);
      setPaginatedPodList(newPaginatedPodList);
    }
  }, [searchedPodList, podVirtualPaginationCount]);

  useEffect(() => {
    if (showUsers && !displayUsers && !displayPods) {
      setDisplayUsers(true);
      setActiveTab(MODAL_TABS_MAP.CONTRIBUTORS);
    }
    if (showPods && !displayUsers && !displayPods) {
      setDisplayPods(true);
      setActiveTab(MODAL_TABS_MAP.PODS);
    }
    if (orgId) {
      if (displayPods) {
        getOrgPods({
          variables: {
            orgId,
          },
        });
      } else if (displayUsers) {
        getOrgUsers({
          variables: {
            orgId,
            limit: 1000, // TODO: paginate
          },
        });
      }
    } else if (podId) {
      if (displayUsers) {
        getPodUsers({
          variables: {
            podId,
            limit: 1000, // TODO: paginate
          },
        });
      }
    }
    if (pods) {
      setPodList(pods);
      setListLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, podId, displayPods, displayUsers, showUsers, showPods, pods]);

  useEffect(() => {
    if (userList) {
      setSearchedUserList([...userList]);
    }
  }, [userList]);

  useEffect(() => {
    if (podList) {
      setSearchedPodList([...podList]);
    }
  }, [podList]);

  useEffect(() => {
    if (usersOverflowBoxRef.current && userListItemRef.current && displayUsers && !!shouldMonitorUsersListRef.current) {
      const boxHeight = usersOverflowBoxRef.current.offsetHeight;
      const listHeight = userListItemRef.current.offsetHeight + 16;
      const paginationCount = boxHeight / listHeight;
      setUserVirtualPaginationCount(Math.ceil(paginationCount));
      shouldMonitorUsersListRef.current = false;
    }
  }, [paginatedUserList, displayUsers]);

  useEffect(() => {
    if (podsOverflowBoxRef.current && podListItemRef.current && !!shouldMonitorPodsListRef.current && displayPods) {
      const boxHeight = podsOverflowBoxRef.current.offsetHeight;
      const listHeight = podListItemRef.current.offsetHeight + 16;
      const paginationCount = boxHeight / listHeight;
      setPodVirtualPaginationCount(Math.ceil(paginationCount));
      shouldMonitorPodsListRef.current = false;
    }
  }, [paginatedPodList, displayPods]);

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        setDisplayUsers(false);
        setDisplayPods(false);
        setActiveTab(MODAL_TABS_MAP.CONTRIBUTORS);
      }}
    >
      <TaskModalBaseCard>
        <TitleSection>
          <Title>{name}</Title>
          <CloseIconContainer
            onClick={() => {
              handleClose();
              setDisplayUsers(false);
              setDisplayPods(false);
              setActiveTab(MODAL_TABS_MAP.CONTRIBUTORS);
            }}
          >
            <CloseModalIcon />
          </CloseIconContainer>
        </TitleSection>
        <Container>
          <StyledTabs value={activeTab} variant="fullWidth">
            <TabText
              onClick={() => {
                setDisplayPods(false);
                setDisplayUsers(true);
                setActiveTab(MODAL_TABS_MAP.CONTRIBUTORS);
              }}
            >
              <StyledTab isActive={activeTab === MODAL_TABS_MAP.CONTRIBUTORS} label="Contributors" />
            </TabText>
            <TabText
              onClick={() => {
                setDisplayPods(true);
                setDisplayUsers(false);
                setActiveTab(MODAL_TABS_MAP.PODS);
              }}
            >
              <StyledTab isActive={activeTab === MODAL_TABS_MAP.PODS} label="Pods" />{' '}
            </TabText>
          </StyledTabs>
        </Container>
        <SearchBox>
          <SearchIconContainer>
            <SearchIcon />
          </SearchIconContainer>

          <input
            onChange={(e) => {
              if (displayUsers) {
                searchUserOrPod(e.target.value, SEARCH_TYPE_USER);
              } else if (displayPods) {
                searchUserOrPod(e.target.value, SEARCH_TYPE_POD);
              }
            }}
            placeholder={`Search ${displayPods ? 'pods' : 'contributors'}...`}
            type="text"
            className="search"
          />
        </SearchBox>
        {displayUsers && (
          <OverflowBox ref={usersOverflowBoxRef}>
            {listLoading && (
              <ActivityIndicatorContainer>
                <CircularProgress />
              </ActivityIndicatorContainer>
            )}
            {paginatedUserList.map((item, i) => (
              <Snap key={item[0]?.id ?? i} className="section_scroll">
                {item.map((user) => (
                  <UserItem ref={userListItemRef} key={user?.id} user={user} />
                ))}
              </Snap>
            ))}
          </OverflowBox>
        )}
        {displayPods && (
          <OverflowBox ref={podsOverflowBoxRef}>
            {listLoading && (
              <ActivityIndicatorContainer>
                <CircularProgress />
              </ActivityIndicatorContainer>
            )}

            {paginatedPodList.map((item, i) => (
              <Snap key={item[0]?.id ?? i} className="section_scroll">
                {item.map((pod) => (
                  <PodItem ref={podListItemRef} key={pod?.id} pod={pod} />
                ))}
              </Snap>
            ))}
          </OverflowBox>
        )}
      </TaskModalBaseCard>
    </Modal>
  );
}
