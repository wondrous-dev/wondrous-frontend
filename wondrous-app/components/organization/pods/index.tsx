import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import { useMe } from 'components/Auth/withAuth';

import { useOrgBoard } from 'utils/hooks';
import { capitalize } from 'utils/common';
import { ENTITIES_TYPES, PERMISSIONS } from 'utils/constants';
import { GET_ORG_PODS, GET_USER_PODS } from 'graphql/queries';
import { parseUserPermissionContext } from 'utils/helpers';

import PlusIcon from 'components/Icons/plus';
import { CreateEntity } from 'components/CreateEntity';
import {
  CreateNewPodButton,
  CreateNewPodButtonText,
  CreateNewPodButtonWrapper,
  CreateNewPodIconWrapper,
  PodHeadline,
  PodItemWrapper,
  PodsContainer,
  PodsList,
  SearchPods,
  StyledTab,
  StyledTabs,
  TabLabelContainer,
  TabLabelCount,
  TabLabelText,
} from './styles';

import PodItem from './PodItem';
import { PodView } from './constants';

const TabLabel = ({ label, count, isActive }) => (
  <TabLabelContainer>
    <TabLabelText isActive={isActive}>{label}</TabLabelText>
    {!!count && <TabLabelCount isActive={isActive}>{count}</TabLabelCount>}
  </TabLabelContainer>
);

const Pods = (props) => {
  const { orgData } = props;

  const [activePodView, setActivePodView] = useState(PodView.ALL_PODS);
  const [activePodsList, setActivePodsList] = useState([]);
  const [showCreatePodModal, setShowCreatePodModal] = useState(false);

  const user = useMe();
  const { userPermissionsContext } = useOrgBoard() || {};
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: orgData?.id,
  });
  const { data: orgPodsData } = useQuery(GET_ORG_PODS, {
    fetchPolicy: 'network-only',
    variables: {
      orgId: orgData?.id,
    },
  });
  const { data: userPodsData } = useQuery(GET_USER_PODS, {
    fetchPolicy: 'network-only',
    variables: {
      userId: user?.id,
    },
  });

  const orgName = orgData?.name || orgData?.username;
  const orgPods = orgPodsData?.getOrgPods;
  const userPods = userPodsData?.getUserPods;
  const orgPodsUserIsIn = userPods?.filter((pod) => pod.org?.id === orgData?.id);
  const orgPodsUserIsNotIn = orgPods?.filter(
    (pod) => !orgPodsUserIsIn?.find((podUserIsIn) => podUserIsIn.id === pod.id)
  );
  const canUserCreatePods =
    permissions.includes(PERMISSIONS.FULL_ACCESS) || permissions.includes(PERMISSIONS.MANAGE_POD);

  const getActivePodsList = useCallback(() => {
    if (activePodView === PodView.ALL_PODS) {
      return orgPods;
    }
    if (activePodView === PodView.PODS_USER_IS_MEMBER_OF) {
      return orgPodsUserIsIn;
    }
    if (activePodView === PodView.PODS_USER_IS_NOT_MEMBER_OF) {
      return orgPodsUserIsNotIn;
    }
    return [];
  }, [activePodView, orgPods?.length, orgPodsUserIsIn?.length, orgPodsUserIsNotIn?.length]);

  useEffect(() => {
    const activePodsList = getActivePodsList();
    setActivePodsList(activePodsList);
  }, [activePodView, orgPods?.length, orgPodsUserIsIn?.length, orgPodsUserIsNotIn?.length]);

  const handleActiveTabChange = (_, newValue: number) => {
    setActivePodView(newValue);
  };

  const handleSearchPods = useCallback(
    (ev) => {
      const searchValue = ev.target.value?.toLowerCase();
      const activePodsList = getActivePodsList();

      if (searchValue) {
        const filteredPods = activePodsList.filter(
          (pod) =>
            pod.name?.toLowerCase().includes(searchValue) ||
            pod.description?.toLowerCase()?.includes(searchValue) ||
            pod.id?.includes(searchValue)
        );
        setActivePodsList(filteredPods);
      } else {
        setActivePodsList(activePodsList);
      }
    },
    [activePodView, orgPods?.length, orgPodsUserIsIn?.length, orgPodsUserIsNotIn?.length]
  );

  const handleOpenCreatePodModal = () => {
    setShowCreatePodModal(true);
  };

  const handleCloseCreatePodModal = () => {
    setShowCreatePodModal(false);
  };

  return (
    <PodsContainer>
      <PodHeadline>Pods in {capitalize(orgName)}</PodHeadline>

      <StyledTabs value={activePodView} onChange={handleActiveTabChange}>
        <StyledTab
          label={<TabLabel label="Show all" count={orgPods?.length} isActive={activePodView === PodView.ALL_PODS} />}
        />
        <StyledTab
          label={
            <TabLabel
              label="Pods I’m in"
              count={orgPodsUserIsIn?.length}
              isActive={activePodView === PodView.PODS_USER_IS_MEMBER_OF}
            />
          }
        />
        <StyledTab
          label={
            <TabLabel
              label="Pods I’m not in"
              count={orgPodsUserIsNotIn?.length}
              isActive={activePodView === PodView.PODS_USER_IS_NOT_MEMBER_OF}
            />
          }
        />
      </StyledTabs>

      <SearchPods placeholder="Search pods..." onChange={handleSearchPods} />

      {canUserCreatePods && (
        <CreateNewPodButtonWrapper>
          <CreateNewPodButton onClick={handleOpenCreatePodModal}>
            <CreateNewPodIconWrapper>
              <PlusIcon />
            </CreateNewPodIconWrapper>
            <CreateNewPodButtonText>Create new pod</CreateNewPodButtonText>
          </CreateNewPodButton>
        </CreateNewPodButtonWrapper>
      )}

      <PodsList>
        {activePodsList?.length &&
          activePodsList?.map((podData) => (
            <Link key={podData?.id} href={`/pod/${podData?.id}/boards`} passHref>
              <PodItemWrapper>
                <PodItem podData={podData} />
              </PodItemWrapper>
            </Link>
          ))}
      </PodsList>

      <CreateEntity
        open={showCreatePodModal}
        entityType={ENTITIES_TYPES.POD}
        handleCloseModal={handleCloseCreatePodModal}
        handleClose={handleCloseCreatePodModal}
        cancel={handleCloseCreatePodModal}
      />
    </PodsContainer>
  );
};

export default Pods;
