import React, { useEffect, useRef, useState, forwardRef } from 'react';
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
  const overFlowBoxUsersRef = useRef(null);
  const listUserItemRef = useRef(null);
  const overFlowBoxPodRef = useRef(null);
  const listPodItemRef = useRef(null);
  const [activeTab, setActiveTab] = useState(MODAL_TABS_MAP.CONTRIBUTORS);
  const [getOrgPods, { data: orgPodData }] = useLazyQuery(GET_ORG_PODS);
  const [virtualPaginationCount, setVirtualPaginationcount] = useState(5);

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

  const searchUser = (searchQuery) => {
    const localSearchQuery = searchQuery.toLowerCase();
    if (searchQuery) {
      const newList = userList.filter((item) => {
        if (item.username && item.bio) {
          return (
            item.username.toLowerCase().includes(localSearchQuery) || item.bio.toLowerCase().includes(localSearchQuery)
          );
        }
        if (item.username) {
          return item.username.toLowerCase().includes(localSearchQuery);
        }
        if (item.bio) {
          return item.bio.toLowerCase().includes(localSearchQuery);
        }
      });
      setSearchedUserList(newList);
    } else setSearchedUserList(userList);
  };

  const searchPod = (searchQuery) => {
    const localSearchQuery = searchQuery.toLowerCase();
    if (searchQuery) {
      const newList = podList.filter((item) => {
        if (item.name && item.description) {
          return (
            item.name.toLowerCase().includes(localSearchQuery) ||
            item.description.toLowerCase().includes(localSearchQuery)
          );
        }
        if (item.name) {
          return item.name.toLowerCase().includes(localSearchQuery);
        }
        if (item.description) {
          return item.description.toLowerCase().includes(localSearchQuery);
        }
      });
      setSearchedPodList(newList);
    } else setSearchedPodList(podList);
  };

  const paginateDataList = (dataList, perPageCount) =>
    Array(Math.ceil(dataList.length / perPageCount))
      .fill(null)
      .map((_, index) => index * perPageCount)
      .map((currentPageStartIndex) => dataList.slice(currentPageStartIndex, currentPageStartIndex + perPageCount));

  useEffect(() => {
    console.log('useEffect [searchedUserList, virtualPaginationCount]');
    if (searchedUserList) {
      const newPaginatedUserList = paginateDataList(searchedUserList, virtualPaginationCount);
      setPaginatedUserList(newPaginatedUserList);
    }
  }, [searchedUserList, virtualPaginationCount]);

  useEffect(() => {
    console.log('useEffect [searchedPodList, virtualPaginationCount]');
    if (searchedPodList) {
      const newPaginatedPodList = paginateDataList(searchedPodList, virtualPaginationCount);
      setPaginatedPodList(newPaginatedPodList);
    }
  }, [searchedPodList, virtualPaginationCount]);

  useEffect(() => {
    console.log('useEffect [orgId, podId, displayPods, displayUsers, showUsers, showPods, pods]');
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
    console.log('useEffect userList');
    if (userList) {
      setSearchedUserList([...userList]);
    }
  }, [userList]);

  useEffect(() => {
    console.log('useEffect podList');
    if (podList) {
      setSearchedPodList([...podList]);
    }
  }, [podList]);

  useEffect(() => {
    console.log('useEffect [paginatedUserList, overFlowBoxUsersRef.current, listUserItemRef.current, displayUsers])');
    if (overFlowBoxUsersRef.current && listUserItemRef.current && displayUsers) {
      const boxHeight = overFlowBoxUsersRef.current.offsetHeight;
      const listHeight = listUserItemRef.current.offsetHeight + 16;
      const paginationCount = boxHeight / listHeight;
      setVirtualPaginationcount(Math.ceil(paginationCount));
    }
  }, [paginatedUserList, overFlowBoxUsersRef.current, listUserItemRef.current, displayUsers]);

  useEffect(() => {
    console.log('useEffect [paginatedPodList, overFlowBoxPodRef.current, listPodItemRef.current, displayPods]');
    if (overFlowBoxPodRef.current && listPodItemRef.current && displayPods) {
      const boxHeight = overFlowBoxPodRef.current.offsetHeight;
      const listHeight = listPodItemRef.current.offsetHeight + 16;
      const paginationCount = boxHeight / listHeight;
      setVirtualPaginationcount(Math.ceil(paginationCount) - 2);
    }
  }, [paginatedPodList, overFlowBoxPodRef.current, listPodItemRef.current, displayPods]);

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
                searchUser(e.target.value);
              } else if (displayPods) {
                searchPod(e.target.value);
              }
            }}
            placeholder={`Search ${displayPods ? 'pods' : 'contributors'}...`}
            type="text"
            className="search"
          />
        </SearchBox>
        {displayUsers && (
          <OverflowBox ref={overFlowBoxUsersRef}>
            {listLoading && (
              <ActivityIndicatorContainer>
                <CircularProgress />
              </ActivityIndicatorContainer>
            )}
            {paginatedUserList.map((item, i) => {
              console.log('paginatedUserList map item ', item, 'index ', i);
              return (
                <Snap key={i} className="section_scroll">
                  {item.map((user, index) => {
                    console.log('paginated item map user ', user, 'index ', index);
                    return <UserItem ref={(el) => listUserItemRef} key={user?.id} user={user} />;
                  })}
                </Snap>
              );
            })}
          </OverflowBox>
        )}
        {displayPods && (
          <OverflowBox ref={overFlowBoxPodRef}>
            {listLoading && (
              <ActivityIndicatorContainer>
                <CircularProgress />
              </ActivityIndicatorContainer>
            )}

            {paginatedPodList.map((item, i) => (
              <Snap key={i} className="section_scroll">
                {item.map((pod, index) => (
                  <PodItem ref={listPodItemRef} key={pod?.id} pod={pod} />
                ))}
              </Snap>
            ))}
          </OverflowBox>
        )}
      </TaskModalBaseCard>
    </Modal>
  );
}
