import { Box, Grid, Modal, Typography } from '@mui/material';
import SearchSuggestions from 'components/SearchSuggestions';
import { useState } from 'react';
import { Input, SpotlightFooter, Wrapper } from './styles';

const Spotlight = ({ isOpen, onClose }) => {
  const [options, setOptions] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Wrapper width={600}>
        <Grid>
          <Input
            placeholder="Select a command or search"
            inputProps={{
              tabIndex: -1,
            }}
          />
        </Grid>
        <SearchSuggestions show={Object.keys(options)?.length === 0} />
        <SpotlightFooter display="flex" justifyContent="space-between" alignItems="center" />
      </Wrapper>
    </Modal>
  );
};

export default Spotlight;
