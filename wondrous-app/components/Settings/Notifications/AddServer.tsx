import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';
import { CloseModalBtn } from 'components/Modal/styles';
import AddWonderBotToDiscordConfig from './AddWonderBotToDiscordConfig';
import { AddServerButton, AddServerPlusIcon } from './styles';

const AddServer = ({ orgId, type, podId }) => {
  const [addServerPanelOpen, setAddServerPanelOpen] = useState(false);

  const toggleServerPanel = () => setAddServerPanelOpen((prev) => !prev);

  if (!addServerPanelOpen) {
    return (
      <AddServerButton onClick={toggleServerPanel}>
        <AddServerPlusIcon />
        Add server
      </AddServerButton>
    );
  }

  return (
    <Grid
      container
      sx={{ cursor: 'pointer', background: palette.grey920, borderRadius: '6px' }}
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid
        display="flex"
        item
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        sx={{ padding: '10px 15px' }}
      >
        <Typography color={palette.blue20} fontSize="14px">
          Adding new server
        </Typography>
        <CloseModalBtn onClick={toggleServerPanel} />
      </Grid>
      <Grid sx={{ background: palette.grey99 }} width="100%">
        <AddWonderBotToDiscordConfig orgId={orgId} onSave={toggleServerPanel} type={type} podId={podId} />
      </Grid>
    </Grid>
  );
};

export default AddServer;
