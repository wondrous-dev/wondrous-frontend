import { styled } from '@mui/material/styles';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { menuItemStyles, menuStyles } from './DocItemsMenuStyles';

const StyledMenuItem = styled(MenuItem)(menuItemStyles);
const StyledMenu = styled(Menu)(menuStyles);

const DocItemsMenu = ({ anchorEl, open, onClose, onEdit, onDelete }) => (
  <StyledMenu
    id="basic-menu"
    anchorEl={anchorEl}
    open={open}
    onClose={onClose}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'center',
      horizontal: 'center',
    }}
  >
    <StyledMenuItem onClick={onEdit} sx={{ display: 'block' }}>
      Edit doc
    </StyledMenuItem>
    <StyledMenuItem onClick={onDelete} sx={{ display: 'block' }}>
      Delete doc
    </StyledMenuItem>
  </StyledMenu>
);

export default DocItemsMenu;
