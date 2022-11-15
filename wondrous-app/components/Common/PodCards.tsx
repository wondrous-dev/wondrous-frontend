import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from 'components/Button';
import PodCard from 'components/Common/PodCard';
import PodIcon from 'components/Icons/podIcon';
import styled from 'styled-components';

const HeaderText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    background: linear-gradient(266.31deg, #7427ff 1.4%, #f2c678 119.61%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

interface PodCardsProps {
  pods: Array<any>;
}

const PodCards = ({ pods }: PodCardsProps) => (
  <Grid container bgcolor="#141414" padding="14px" gap="14px">
    <Grid container justifyContent="space-between">
      <Grid container width="fit-content" gap="8px" alignItems="center" justifyContent="center">
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          bgcolor="#212121"
          borderRadius="35px"
          height="35px"
          width="35px"
        >
          <PodIcon />
        </Grid>
        <HeaderText>Pods</HeaderText>
      </Grid>
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
      {pods.slice(0, 6).map((pod) => (
        <PodCard key={pod.id} {...pod} />
      ))}
    </Grid>
  </Grid>
);

export default PodCards;
