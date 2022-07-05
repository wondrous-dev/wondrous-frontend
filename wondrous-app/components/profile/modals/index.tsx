import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import Modal from '@mui/material/Modal';
import { CircularProgress } from '@mui/material';

import { format, formatDistance } from 'date-fns';
import { useInView } from 'react-intersection-observer';
import { GET_ORG_PODS, GET_ORG_USERS } from 'graphql/queries/org';
import { GET_POD_USERS } from 'graphql/queries/pod';
import { useLazyQuery } from '@apollo/client';
import { TaskModalBaseCard, TaskSubmissionHeaderCreatorText } from '../../Common/Task/styles';
import { TabContainer, Tab, TabContainerText, PodExplainerText } from './styles';
import { DefaultProfilePicture, PodWrapper, Title, UserProfilePicture, UserWrapper } from './styles';
import { useRouter } from 'next/router';
import { CommentText, CommentTopFlexDiv } from '../../Comment/styles';
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
      <PodExplainerText>{cutString(pod?.description)}</PodExplainerText>
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
      {user?.profilePicture ? <UserProfilePicture src={user?.profilePicture} /> : <DefaultProfilePicture />}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <CommentTopFlexDiv>
          <TaskSubmissionHeaderCreatorText
            style={{
              marginBottom: '4px',
            }}
          >
            {user?.username}
          </TaskSubmissionHeaderCreatorText>
        </CommentTopFlexDiv>
        <CommentText>{cutString(user?.bio)}</CommentText>
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
        <Title>{name}</Title>
        <TabContainer>
          <Tab
            selected={displayUsers}
            onClick={() => {
              setDisplayPods(false);
              setDisplayUsers(true);
            }}
          >
            <TabContainerText>Contributors</TabContainerText>
          </Tab>
          {orgId && (
            <Tab
              selected={displayPods}
              onClick={() => {
                setDisplayPods(true);
                setDisplayUsers(false);
              }}
            >
              <TabContainerText>Pods</TabContainerText>
            </Tab>
          )}
        </TabContainer>
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
        {displayUsers && <>{userList && userList.map((user) => <UserItem key={user?.id} user={user} />)}</>}
        {displayPods && <>{podList && podList.map((pod) => <PodItem key={pod?.id} pod={pod} />)}</>}
      </TaskModalBaseCard>
    </Modal>
  );
};
