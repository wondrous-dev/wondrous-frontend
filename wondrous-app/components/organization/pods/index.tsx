import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import { useMe } from 'components/Auth/withAuth';

import { useOrgBoard } from 'utils/hooks';
import { capitalize } from 'utils/common';
import { ENTITIES_TYPES, PERMISSIONS } from 'utils/constants';
import { GET_ORG_ARCHIVED_PODS, GET_ORG_PODS, GET_USER_PODS } from 'graphql/queries';
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
  const { data: archivedPodsData } = useQuery(GET_ORG_ARCHIVED_PODS, {
    fetchPolicy: 'network-only',
    variables: {
      orgId: orgData?.id,
    },
  });

  const orgName = orgData?.name || orgData?.username;
  const orgPods = orgPodsData?.getOrgPods;
  const userPods = userPodsData?.getUserPods;
  const orgPodsUserIsIn = userPods?.filter((pod) => pod.org?.id === orgData?.id);
  const orgPodsUserIsNotIn = orgPods?.filter(
    (pod) => !orgPodsUserIsIn?.find((podUserIsIn) => podUserIsIn.id === pod.id)
  );
  const archivedPods = archivedPodsData?.getOrgArchivedPods;
  const canUserCreateOrUnarchivePods =
    permissions.includes(PERMISSIONS.FULL_ACCESS) || permissions.includes(PERMISSIONS.MANAGE_POD);

  const tabs = [
    {
      label: 'Show all',
      count: orgPods?.length,
      view: PodView.ALL_PODS,
    },
    {
      label: 'Pods I’m in',
      count: orgPodsUserIsIn?.length,
      view: PodView.PODS_USER_IS_MEMBER_OF,
    },
    {
      label: 'Pods I’m not in',
      count: orgPodsUserIsNotIn?.length,
      view: PodView.PODS_USER_IS_NOT_MEMBER_OF,
    },
    !!canUserCreateOrUnarchivePods && {
      label: 'Archived Pods',
      count: archivedPods?.length,
      view: PodView.ARCHIVED_PODS,
    },
  ];

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
    if (activePodView === PodView.ARCHIVED_PODS) {
      return archivedPods;
    }
    return [];
  }, [activePodView, orgPods?.length, orgPodsUserIsIn?.length, orgPodsUserIsNotIn?.length, archivedPods?.length]);

  useEffect(() => {
    const activePodsList = getActivePodsList();
    setActivePodsList(activePodsList);
  }, [activePodView, orgPods?.length, orgPodsUserIsIn?.length, orgPodsUserIsNotIn?.length, archivedPods?.length]);

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
    [activePodView, orgPods?.length, orgPodsUserIsIn?.length, orgPodsUserIsNotIn?.length, archivedPods?.length]
  );

  const handleOpenCreatePodModal = () => {
    setShowCreatePodModal(true);
  };

  const handleCloseCreatePodModal = () => {
    setShowCreatePodModal(false);
  };

  const setActivePodViewToAllPods = () => {
    setActivePodView(PodView.ALL_PODS);
  };

  return (
    <PodsContainer>
      <PodHeadline>Pods in {capitalize(orgName)}</PodHeadline>

      <StyledTabs value={activePodView} onChange={handleActiveTabChange}>
        {tabs?.map((tab) => (
          <StyledTab
            label={
              <TabLabel label={tab.label} count={tab.count} isActive={activePodView === tab.view} key={tab.view} />
            }
          />
        ))}
      </StyledTabs>

      <SearchPods placeholder="Search pods..." onChange={handleSearchPods} />

      {canUserCreateOrUnarchivePods && (
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
                <PodItem
                  podData={podData}
                  showUnarchivePod={activePodView === PodView.ARCHIVED_PODS}
                  setActivePodViewToAllPods={setActivePodViewToAllPods}
                />
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
