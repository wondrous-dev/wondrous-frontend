import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import { GET_ORG_PODS, GET_ORG_USERS } from 'graphql/queries/org';
import { GET_POD_USERS } from 'graphql/queries/pod';
import { useLazyQuery } from '@apollo/client';
import { UserProfilePicture } from 'components/Common/ProfilePictureHelpers';

import SearchIcon from 'components/Icons/search';
import { TaskModalBaseCard } from 'components/Common/Task/styles';
import { useRouter } from 'next/router';
import { CommentTopFlexDiv } from 'components/Comment/styles';
import { cutString } from 'utils/helpers';
import { useBoards } from 'utils/hooks';
import CloseModalIcon from 'components/Icons/closeModal';
import { MODAL_TABS_MAP } from 'utils/constants';
import { LIMIT } from 'services/board';
import { LoadMore } from 'components/SearchTasks/styles';
import { useInView } from 'react-intersection-observer';
import PlateRichTextViewer from 'components/PlateRichEditor/PlateRichTextViewer';
import {
  ActivityIndicatorContainer,
  CloseIconContainer,
  CommentLine,
  Container,
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
  UserWrapper,
} from './styles';

const PodItem = forwardRef((props: any, ref) => {
  const router = useRouter();
  const { pod } = props;
  return (
    <PodWrapper
      ref={ref}
      onClick={() =>
        router.push(`/pod/${pod?.id}/home`, undefined, {
          shallow: true,
        })
      }
    >
      <TabContainerText>{pod?.name}</TabContainerText>
      <PodExplainerText as="div">
        <PlateRichTextViewer text={pod?.description} />
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
      <UserProfilePicture avatar={user?.thumbnailPicture || user?.profilePicture} />
      <UserMetaDataContainer>
        <CommentTopFlexDiv>
          <NameText>{user?.username}</NameText>
        </CommentTopFlexDiv>
        <CommentLine>{cutString(user?.bio)}</CommentLine>
      </UserMetaDataContainer>
    </UserWrapper>
  );
});

function MoreInfoModal(props) {
  const { orgId, podId, showUsers, showPods, open, handleClose, name } = props;
  const { podBoard } = useBoards();
  const [hasMoreUsers, setHasMoreUsers] = useState(false);
  const [podList, setPodList] = useState([]);
  const [searchedUserList, setSearchedUserList] = useState([]);
  const [searchedPodList, setSearchedPodList] = useState([]);
  const [paginatedUserList, setPaginatedUserList] = useState([]);
  const [paginatedPodList, setPaginatedPodList] = useState([]);
  const usersOverflowBoxRef = useRef(null);
  const userListItemRef = useRef(null);
  const podsOverflowBoxRef = useRef(null);
  const podListItemRef = useRef(null);
  const [activeTab, setActiveTab] = useState(null);
  const displayUsers = activeTab === MODAL_TABS_MAP.CONTRIBUTORS;
  const displayPods = activeTab === MODAL_TABS_MAP.PODS;
  const [getOrgPods, { data: orgPodData }] = useLazyQuery(GET_ORG_PODS, {
    fetchPolicy: 'cache-and-network',
  });
  const [userVirtualPaginationCount, setUserVirtualPaginationCount] = useState(5);
  const [podVirtualPaginationCount, setPodVirtualPaginationCount] = useState(5);
  const shouldMonitorUsersListRef = useRef(true);
  const shouldMonitorPodsListRef = useRef(true);
  const [loadMoreRef, inView] = useInView({});

  const handleHasMore = (userData) => setHasMoreUsers(userData?.length === LIMIT);

  const [getOrgUsers, { previousData, fetchMore, data: orgUsers, loading: orgUsersLoading }] = useLazyQuery(
    GET_ORG_USERS,
    {
      onCompleted: (data) => {
        const userData = data.getOrgUsers;
        if (!previousData) {
          handleHasMore(userData);
        }
      },
      fetchPolicy: 'cache-and-network',
    }
  );

  const [
    getPodUsers,
    { previousData: previousPodUsersData, fetchMore: fetchMorePodUsers, data: podUsers, loading: podUsersLoading },
  ] = useLazyQuery(GET_POD_USERS, {
    onCompleted: (data) => {
      const userData = data.getPodUsers;
      if (!previousData) {
        handleHasMore(userData);
      }
    },
    fetchPolicy: 'cache-and-network',
  });

  const listLoading = orgUsersLoading || podUsersLoading;

  const userList = useMemo(() => {
    const userData = orgUsers?.getOrgUsers || podUsers?.getPodUsers;
    return userData?.map((userRole) => userRole.user);
  }, [orgUsers, podUsers]);

  const handleFetchMoreUsers = () => {
    if (displayUsers) {
      if (podId) {
        fetchMorePodUsers({
          variables: {
            offset: userList.length,
          },
        }).then(({ data }) => handleHasMore(data?.getPodUsers));
      } else {
        fetchMore({
          variables: {
            offset: userList.length,
          },
        }).then(({ data }) => handleHasMore(data?.getOrgUsers));
      }
    }
  };

  useEffect(() => {
    if (hasMoreUsers && inView && userList.length) handleFetchMoreUsers();
  }, [hasMoreUsers, inView, previousData]);

  const pods = orgPodData?.getOrgPods;

  const SEARCH_TYPE_USER = 1;
  const SEARCH_TYPE_POD = 2;

  const searchUserOrPod = (searchQuery, searchType = SEARCH_TYPE_USER) => {
    if (searchType === SEARCH_TYPE_USER) {
      const searchFunction = podId ? getPodUsers : getOrgUsers;
      return searchFunction({
        variables: {
          searchString: searchQuery,
          offset: 0,
          ...(podId ? { podId } : { orgId }),
          limit: LIMIT,
        },
      }).then(({ data }) => {
        const userData = data?.getOrgUsers || data?.getPodUsers;
        return handleHasMore(userData);
      });
    }
    const localSearchQuery = searchQuery.toLowerCase();
    const setFunctionForListToSearch = searchType === SEARCH_TYPE_USER ? setSearchedUserList : setSearchedPodList;
    if (searchQuery) {
      const searchFields = ['name', 'description'];
      const newList = podList.filter((item) =>
        searchFields.some((field) => item[field]?.toLowerCase().includes(localSearchQuery))
      );
      setFunctionForListToSearch(newList);
    } else setFunctionForListToSearch(podList);
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
      setActiveTab(MODAL_TABS_MAP.CONTRIBUTORS);
    }
    if (showPods && !displayUsers && !displayPods) {
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
            limit: LIMIT,
          },
        });
      }
    } else if (podId) {
      if (displayUsers) {
        getPodUsers({
          variables: {
            podId,
            limit: LIMIT,
          },
        });
      }
    }
    if (pods) {
      setPodList(pods);
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
        setActiveTab(MODAL_TABS_MAP.CONTRIBUTORS);
      }}
    >
      <TaskModalBaseCard>
        <TitleSection>
          <Title>{name}</Title>
          <CloseIconContainer
            onClick={() => {
              handleClose();
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
                setActiveTab(MODAL_TABS_MAP.CONTRIBUTORS);
              }}
            >
              <StyledTab isActive={displayUsers} label="Contributors" />
            </TabText>
            ;
            {!podBoard && (
              <TabText
                onClick={() => {
                  setActiveTab(MODAL_TABS_MAP.PODS);
                }}
              >
                <StyledTab isActive={displayPods} label="Pods" />{' '}
              </TabText>
            )}
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
            <LoadMore ref={loadMoreRef} style={{ paddingTop: '10px', height: '2px', display: 'block' }} />
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

export default MoreInfoModal;
