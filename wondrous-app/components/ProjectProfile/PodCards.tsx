import Grid from '@mui/material/Grid';
import Button from 'components/Button';
import PodIcon from 'components/Icons/podIcon';
import CreateButton from 'components/ProjectProfile/CreateButton';
import HeaderTitle from 'components/ProjectProfile/HeaderTitle';
import PodCard from 'components/ProjectProfile/PodCard';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import palette from 'theme/palette';
import { ENTITIES_TYPES } from 'utils/constants';

import { useEntityCreateButtonProps, useGetOrgPods } from './helpers';

const EmptyWrapper = styled.div`
  background-image: url(/images/project/pod-empty-bg.svg);
  background-color: ${palette.grey950};
  background-size: 70%;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 76px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoPods = () => (
  <EmptyWrapper>
    <CreateButton {...useEntityCreateButtonProps(ENTITIES_TYPES.POD)} />
  </EmptyWrapper>
);

const PodCardContent = ({ pods }) => {
  const numbersOfPodsToShow = 6;
  return pods?.slice(0, numbersOfPodsToShow).map((pod) => <PodCard key={pod.id} {...pod} />);
};

const ShowAllButton = () => {
  const router = useRouter();
  return (
    <Button
      color="grey"
      borderRadius={6}
      buttonTheme={{
        height: '35px',
        paddingX: 10,
        paddingY: 10,
        fontSize: 13,
        fontWeight: 500,
      }}
      onClick={() => router.push(`/organization/${router.query.username}/pods`)}
    >
      Show all
    </Button>
  );
};

const PodCards = () => {
  const pods = useGetOrgPods();
  const podsComponent = isEmpty(pods) ? <NoPods /> : <PodCardContent pods={pods} />;
  return (
    <Grid container bgcolor={palette.black97} padding="14px" gap="14px">
      <Grid container justifyContent="space-between">
        <HeaderTitle IconComponent={PodIcon} text="Pods" />
        <ShowAllButton />
      </Grid>
      <Grid container item width="100%" height="fit-content" gap="8px" flexWrap="nowrap">
        {podsComponent}
      </Grid>
    </Grid>
  );
};

export default PodCards;
