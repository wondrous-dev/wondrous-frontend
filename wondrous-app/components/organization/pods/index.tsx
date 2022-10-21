import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Grid, Typography } from '@mui/material';

import palette from 'theme/palette';
import typography from 'theme/typography';

import { useMe } from 'components/Auth/withAuth';

import { capitalize } from 'utils/common';
import { GET_ORG_PODS, GET_USER_PODS } from 'graphql/queries';

import Link from 'next/link';
import { PodItemWrapper, StyledTab, StyledTabs } from './styles';

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

  const user = useMe();
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

  const handleChange = (_, newValue: number) => {
    setActivePodView(newValue);
  };

  return (
    <Grid sx={{ padding: '120px 0', margin: '0 auto', maxWidth: '720px' }}>
      <Typography sx={{ color: palette.white, fontWeight: 700, fontFamily: typography.fontFamily, fontSize: '24px' }}>
        Pods in {capitalize(orgName)}
      </Typography>

      <StyledTabs value={activePodView} onChange={handleChange}>
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
    </Grid>
  );
};

export default Pods;
