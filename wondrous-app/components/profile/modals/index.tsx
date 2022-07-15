import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import { CircularProgress } from '@mui/material';
import { GET_ORG_PODS, GET_ORG_USERS } from 'graphql/queries/org';
import { GET_POD_USERS } from 'graphql/queries/pod';
import { useLazyQuery } from '@apollo/client';
import Image from 'next/image';

import { TaskModalBaseCard } from '../../Common/Task/styles';
import {
  CommentLine,
  Container,
  DefaultProfilePicture,
  FlexTitle,
  NameText,
  OverflowBox,
  PodExplainerText,
  PodWrapper,
  SearchBox,
  Snap,
  StyledTab,
  StyledTabs,
  TabContainerText,
  TabText,
  Title,
  UserProfilePicture,
  UserWrapper,
} from './styles';
import { useRouter } from 'next/router';
import { CommentTopFlexDiv } from '../../Comment/styles';
import { cutString } from 'utils/helpers';
import { RichTextViewer } from 'components/RichText';

const PodItem = (props) => {
  const router = useRouter();
  const { pod } = props;
  return (
    <PodWrapper
      onClick={() =>
        router.push(`/pod/${pod?.id}/boards`, undefined, {
          shallow: true,
        })
      }
    >
      <TabContainerText
        style={{
          fontWeight: 'bolder',
        }}
      >
        {pod?.name}
      </TabContainerText>
      <PodExplainerText>
        <RichTextViewer text={pod?.description} />
      </PodExplainerText>
    </PodWrapper>
  );
};

const UserItem = (props) => {
  const router = useRouter();
  const { user } = props;
  return (
    <UserWrapper
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <CommentTopFlexDiv>
          <NameText
            style={{
              marginBottom: '4px',
            }}
          >
            {user?.username}
          </NameText>
        </CommentTopFlexDiv>
        <CommentLine>{cutString(user?.bio)}</CommentLine>
      </div>
    </UserWrapper>
  );
};

export const MoreInfoModal = (props) => {
  const { orgId, podId, showUsers, showPods, open, handleClose, name } = props;
  const [displayUsers, setDisplayUsers] = useState(showUsers);
  const [listLoading, setListLoading] = useState(true);
  const [displayPods, setDisplayPods] = useState(showPods);
  const [userList, setUserList] = useState([]);
  const [podList, setPodList] = useState([]);
  const [userListSearch, setUserListSearch] = useState([]);
  const [podListSearch, setPodListSearch] = useState([]);
  const [dividedUserList, setDividedUserList] = useState([]);
  const [dividedPodList, setDividedPodList] = useState([]);
  const [activeTab, setActiveTab] = useState('contributors');
  const [getOrgPods, { data: orgPodData }] = useLazyQuery(GET_ORG_PODS);
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

  const searchUser = (value) => {
    if (value) {
      const newList = userList.filter((item) => {
        if (item.username && item.bio) {
          return (
            item.username.toLowerCase().includes(value.toLowerCase()) ||
            item.bio.toLowerCase().includes(value.toLowerCase())
          );
        } else if (item.username) {
          return item.username.toLowerCase().includes(value.toLowerCase());
        } else if (item.description) {
          return item.bio.toLowerCase().includes(value.toLowerCase());
        }
      });
      setUserListSearch(newList);
    } else {
      setUserListSearch(userList);
    }
  };
  const searchPod = (value) => {
    if (value) {
      const newList = podList.filter((item) => {
        if (item.name && item.description) {
          return (
            item.name.toLowerCase().includes(value.toLowerCase()) ||
            item.description.toLowerCase().includes(value.toLowerCase())
          );
        } else if (item.name) {
          return item.name.toLowerCase().includes(value.toLowerCase());
        } else if (item.description) {
          return item.description.toLowerCase().includes(value.toLowerCase());
        }
      });
      setPodListSearch(newList);
    } else {
      setPodListSearch(podList);
    }
  };
  const array_chunks = (array, chunk_size) =>
    Array(Math.ceil(array.length / chunk_size))
      .fill(0)
      .map((_, index) => index * chunk_size)
      .map((begin) => array.slice(begin, begin + chunk_size));
  useEffect(() => {
    if (userListSearch) {
      const newlist = array_chunks(userListSearch, 5);
      setDividedUserList(newlist);
    }
  }, [userListSearch]);
  useEffect(() => {
    if (podListSearch) {
      const newlist = array_chunks(podListSearch, 5);
      setDividedPodList(newlist);
    }
  }, [podListSearch]);
  useEffect(() => {
    if (showUsers && !displayUsers && !displayPods) {
      setDisplayUsers(true);
    }
    if (showPods && !displayUsers && !displayPods) {
      setDisplayPods(true);
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
      setUserListSearch([...userList]);
    }
  }, [userList]);
  useEffect(() => {
    if (podList) {
      setPodListSearch([...podList]);
    }
  }, [podList]);

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        setDisplayUsers(false);
        setDisplayPods(false);
      }}
    >
      <TaskModalBaseCard>
        <FlexTitle>
          <Title>{name}</Title>
          <Image
            onClick={() => {
              handleClose();
              setDisplayUsers(false);
              setDisplayPods(false);
            }}
            src="/images/icons/cancelIcon.svg"
            alt="cancel"
            width={32}
            height={32}
          />
        </FlexTitle>
        <Container>
          <StyledTabs
            value={activeTab}
            variant={'fullWidth'}
            style={{
              marginTop: '16px',
            }}
          >
            <TabText
              onClick={() => {
                setDisplayPods(false);
                setDisplayUsers(true);
                setActiveTab('contributors');
              }}
            >
              <StyledTab isActive={activeTab === 'contributors'} label={'Contributors'} />
            </TabText>
            <TabText
              onClick={() => {
                setDisplayPods(true);
                setDisplayUsers(false);
                setActiveTab('pod');
              }}
            >
              <StyledTab isActive={activeTab === 'pod'} label={'Pods'} />{' '}
            </TabText>
          </StyledTabs>
        </Container>

        <SearchBox>
          <Image src="/images/icons/search.svg" alt="search" width={20} height={18} />
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
          <OverflowBox>
            {listLoading && (
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                <CircularProgress />
              </div>
            )}
            {dividedUserList.map((item, i) => {
              return (
                <Snap key={i} className="section_scroll">
                  {item.map((user, index) => {
                    return <UserItem key={user?.id} user={user} />;
                  })}
                </Snap>
              );
            })}
          </OverflowBox>
        )}
        {displayPods && (
          <OverflowBox>
            {listLoading && (
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                <CircularProgress />
              </div>
            )}

            {dividedPodList.map((item, i) => {
              return (
                <Snap key={i} className="section_scroll">
                  {item.map((pod, index) => {
                    return <PodItem key={pod?.id} pod={pod} />;
                  })}
                </Snap>
              );
            })}
          </OverflowBox>
        )}
      </TaskModalBaseCard>
    </Modal>
  );
};
