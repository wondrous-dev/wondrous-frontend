import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Grid, Typography } from '@mui/material';

import { useMe } from 'components/Auth/withAuth';

import { useOrgBoard } from 'utils/hooks';
import { capitalize } from 'utils/common';
import { ENTITIES_TYPES, PERMISSIONS } from 'utils/constants';
import { GET_ORG_PODS, GET_USER_PODS } from 'graphql/queries';
import { parseUserPermissionContext } from 'utils/helpers';

import palette from 'theme/palette';
import typography from 'theme/typography';

import PlusIcon from 'components/Icons/plus';
import { CreateEntity } from 'components/CreateEntity';
import { CreateNewPodButton, CreateNewPodIconWrapper, PodItemWrapper, StyledTab, StyledTabs } from './styles';

import PodItem from './PodItem';
import { PodView } from './constants';

const TabLabel = ({ label, count, isActive }) => (
  <Grid sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <Typography
      sx={{
        color: isActive ? palette.white : palette.grey51,
        fontWeight: 500,
        fontFamily: typography.fontFamily,
        fontSize: '14px',
      }}
    >
      {label}
    </Typography>
    {!!count && (
      <Typography
        sx={{
          color: isActive ? palette.white : palette.grey51,
          background: isActive ? palette.grey87 : palette.grey87,
          padding: '2px',
          borderRadius: '4px',
          fontWeight: 500,
          fontFamily: typography.fontFamily,
          fontSize: '14px',
        }}
      >
        {count}
      </Typography>
    )}
  </Grid>
);

const Pods = (props) => {
  const { orgData } = props;

  const [activePodView, setActivePodView] = useState(PodView.ALL);
  const [activePodsList, setActivePodsList] = useState([]);
  const [showCreatePodModal, setShowCreatePodModal] = useState(false);

  const user = useMe();
  const { userPermissionsContext } = useOrgBoard() || {};
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: orgData?.id,
  });
  const [getOrgPods, { data: orgPodsData }] = useLazyQuery(GET_ORG_PODS, {
    fetchPolicy: 'cache-and-network',
  });
  const [getUserPods, { data: userPodsData }] = useLazyQuery(GET_USER_PODS, {
    fetchPolicy: 'network-only',
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

  useEffect(() => {
    if (orgData?.id) {
      getOrgPods({ variables: { orgId: orgData?.id } });
    }
  }, [orgData?.id]);

  useEffect(() => {
    if (user?.id) {
      getUserPods({ variables: { userId: user?.id } });
    }
  }, [user?.id]);

  useEffect(() => {
    if (activePodView === PodView.ALL) {
      setActivePodsList(orgPods);
    } else if (activePodView === PodView.USER_IS_MEMBER_OF) {
      setActivePodsList(orgPodsUserIsIn);
    } else {
      setActivePodsList(orgPodsUserIsNotIn);
    }
  }, [activePodView, orgPods?.length, orgPodsUserIsIn?.length, orgPodsUserIsNotIn?.length]);

  const handleActiveTabChange = (_, newValue: number) => {
    setActivePodView(newValue);
  };

  const handleOpenCreatePodModal = () => {
    setShowCreatePodModal(true);
  };

  const handleCloseCreatePodModal = () => {
    setShowCreatePodModal(false);
  };

  return (
    <Grid sx={{ padding: '120px 0', margin: '0 auto', maxWidth: '720px' }}>
      <Typography sx={{ color: palette.white, fontWeight: 700, fontFamily: typography.fontFamily, fontSize: '24px' }}>
        Pods in {capitalize(orgName)}
      </Typography>

      <StyledTabs value={activePodView} onChange={handleActiveTabChange}>
        <StyledTab
          label={<TabLabel label="Show all" count={orgPods?.length} isActive={activePodView === PodView.ALL} />}
        />
        <StyledTab
          label={
            <TabLabel
              label="Pods I’m in"
              count={orgPodsUserIsIn?.length}
              isActive={activePodView === PodView.USER_IS_MEMBER_OF}
            />
          }
        />
        <StyledTab
          label={
            <TabLabel
              label="Pods I’m not in"
              count={orgPodsUserIsNotIn?.length}
              isActive={activePodView === PodView.USER_IS_NOT_MEMBER_OF}
            />
          }
        />
      </StyledTabs>

      {canUserCreatePods && (
        <Grid
          sx={{
            padding: '14px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: palette.black92,
            borderRadius: '6px',
          }}
        >
          <CreateNewPodButton onClick={handleOpenCreatePodModal}>
            <CreateNewPodIconWrapper>
              <PlusIcon />
            </CreateNewPodIconWrapper>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: palette.white }}>Create new pod</Typography>
          </CreateNewPodButton>
        </Grid>
      )}

      <Grid sx={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {activePodsList?.length &&
          activePodsList?.map((podData) => (
            <Link key={podData?.id} href={`/pod/${podData?.id}/boards`} passHref>
              <PodItemWrapper>
                <PodItem podData={podData} />
              </PodItemWrapper>
            </Link>
          ))}
      </Grid>

      <CreateEntity
        open={showCreatePodModal}
        entityType={ENTITIES_TYPES.POD}
        handleCloseModal={handleCloseCreatePodModal}
        handleClose={handleCloseCreatePodModal}
        cancel={handleCloseCreatePodModal}
      />
    </Grid>
  );
};

export default Pods;
