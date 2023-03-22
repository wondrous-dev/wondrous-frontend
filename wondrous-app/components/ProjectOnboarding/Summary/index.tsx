import { Backdrop, Grid } from '@mui/material';
import Modal from 'components/Modal';
import palette from 'theme/palette';

const Summary = () => {
  const items = [
    {
      label: 'Project title',
      value: 'CrystalDAO',
    },
    {
      label: 'Username',
      value: '@crystaldao',
    },
    {
      divider: true,
    },
    {
      label: 'Project type',
      value: 'Social Good',
    },
    {
      label: 'Twitter',
      value: '@crystaldao',
    },
    {
      label: 'Project Logo',
      value: 'steveftp.png',
    },
    {
      label: 'Header',
      value: 'header.png',
    },
    {
      divider: true,
    },
  ];
  return (
    <Backdrop
      open
      sx={{
        zIndex: '1000',
        background: 'linear-gradient(180deg, #7730d3 -5.04%, #1c0e94 26.14%, #151629 71.11%)',
        opacity: '0.6',
      }}
    >
      <Modal
        open
        onClose={() => {}}
        title="Confirm details"
        maxWidth={860}
        modalBodyStyle={{
          padding: '0px',
        }}
      >
        <Grid
          container
          direction={{
            xs: 'column',
            sm: 'row',
          }}
        >
          <Grid
            display="flex"
            flexDirection="column"
            padding="24px"
            flexBasis={{
              xs: '100%',
              sm: '60%',
            }}
            height="500px"
          />
          <Grid
            bgcolor={palette.grey910}
            height="500px"
            padding="24px"
            flexBasis={{
              xs: '100%',
              sm: '40%',
            }}
          />
        </Grid>
      </Modal>
    </Backdrop>
  );
};

export default Summary;
