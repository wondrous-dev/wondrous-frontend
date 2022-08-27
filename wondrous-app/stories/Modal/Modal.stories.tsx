import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Modal as ModalComponent } from 'components/Modal';
import { ThemeProvider as StyledComponentProvider } from 'styled-components';
import { Button } from 'components/Button';
import theme from 'theme';

export default {
  title: 'Utils/Modal',
  component: ModalComponent,
  parameters: {
    docs: {
      description: {
        component: `The modal component provides a solid foundation for creating dialogs, popovers, lightboxes, or whatever else.`,
      },
    },
  },
} as ComponentMeta<typeof ModalComponent>;

const BasicModalTemplate: ComponentStory<typeof ModalComponent> = (props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const footerRight = (
    <>
      <Button color="grey" onClick={handleClose}>
        Close
      </Button>
      <Button color="primary">Save Changes</Button>
    </>
  );

  return (
    <StyledComponentProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex' }}>
          <Button onClick={handleOpen}>Open modal</Button>
        </Box>

        <ModalComponent title="Modal title" onClose={handleClose} footerRight={footerRight} open={open} {...props}>
          <Typography sx={{ color: 'white' }}>Woohoo, you're reading this text in a modal!</Typography>
        </ModalComponent>
      </ThemeProvider>
    </StyledComponentProvider>
  );
};

export const BasicModal = BasicModalTemplate.bind({});
