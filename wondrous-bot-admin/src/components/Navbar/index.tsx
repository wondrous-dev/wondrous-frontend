import {
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { DefaultLink } from 'components/Shared/styles';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

import { HeaderBar } from './styles';
import { Link } from 'react-router-dom';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const LINKS = [
    {
      path: '/members',
      label: 'MEMBERS',
    },
    {
      path: '/quests',
      label: 'QUESTS',
    },
    {
      path: '/levels',
      label: 'LEVELS',
    },
  ];
  return (
    <HeaderBar>
      <Link to="/">
      <img src='/wonder.svg' />
      </Link>
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Grid container display='flex' gap='42px' alignItems='center'>
          {LINKS.map((link) => (
            <Grid item key={link.label}>
              <DefaultLink to={link.path}>{link.label}</DefaultLink>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          size='large'
          edge='end'
          color='inherit'
          aria-label='menu'
          onClick={handleMenu}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          sx={{
            padding: '0',
          }}
          onClose={handleClose}
          onClick={handleClose}
        >
          {LINKS.map((link) => (
            <MenuItem
              key={link.label}
              component={DefaultLink}
              to={link.path}
              onClick={handleClose}
            >
              {link.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </HeaderBar>
  );
};

export default Header;
