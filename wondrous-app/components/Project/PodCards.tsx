import Grid from '@mui/material/Grid';
import Button from 'components/Button';
import PodIcon from 'components/Icons/podIcon';
import CreateButton from 'components/Project/CreateButton';
import HeaderTitle from 'components/Project/HeaderTitle';
import PodCard from 'components/Project/PodCard';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import { ENTITIES_TYPES } from 'utils/constants';
import { useEntityCreateButtonProps } from './hooks';

const EmptyWrapper = styled.div`
  background-image: url(/images/project/pod-empty-bg.svg);
  background-color: #212121;
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

interface PodCardsProps {
  pods: Array<any>;
}

const useNoPods = () => (
  <EmptyWrapper>
    <CreateButton {...useEntityCreateButtonProps(ENTITIES_TYPES.POD)} />
  </EmptyWrapper>
);

const podCardContent = (pods: PodCardsProps['pods']) =>
  pods.slice(0, 6).map((pod) => <PodCard key={pod.id} {...pod} />);

const PodCards = ({ pods }: PodCardsProps) => {
  const emptyComponent = useNoPods();
  const podsComponent = isEmpty(pods) ? emptyComponent : podCardContent(pods);
  return (
    <Grid container bgcolor="#141414" padding="14px" gap="14px">
      <Grid container justifyContent="space-between">
        <HeaderTitle IconComponent={PodIcon} text="Pods" />
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
        >
          Show all
        </Button>
      </Grid>
      <Grid container item width="100%" height="fit-content" gap="8px" flexWrap="nowrap">
        {podsComponent}
      </Grid>
    </Grid>
  );
};

export default PodCards;
