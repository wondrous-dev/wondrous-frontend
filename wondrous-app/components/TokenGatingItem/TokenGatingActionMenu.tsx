import React from 'react';
import Grid from '@mui/material/Grid';
import Tooltip from 'components/Tooltip';

import palette from 'theme/palette';
<<<<<<< HEAD
import Dropdown from 'components/Common/Dropdown';
import DropdownItem from 'components/Common/DropdownItem';
=======
import { DropDown, DropDownItem } from 'components/Common/dropdown';
>>>>>>> fd1501d7 (Feature/guild (#978))
import { TaskMenuIcon } from 'components/Icons/taskMenu';

type Props = {
  onEdit?: () => void;
  onDelete?: () => void;
};

function TokenGatingActionMenu({ onEdit, onDelete }: Props) {
  const dropdownItemStyle = {
    marginRight: '12px',
    color: palette.white,
  };

  return (
    <Grid container direction="row" justifyContent="flex-end" alignItems="center">
      <Tooltip title="More actions" placement="top">
        <div>
<<<<<<< HEAD
          <Dropdown DropdownHandler={TaskMenuIcon} dropDownStyle={{ transform: 'unset' }}>
            {onEdit ? (
              <DropdownItem onClick={onEdit} style={dropdownItemStyle}>
                Edit
              </DropdownItem>
            ) : null}

            {onDelete ? (
              <DropdownItem style={dropdownItemStyle} onClick={onDelete}>
                Delete
              </DropdownItem>
            ) : null}
          </Dropdown>
=======
          <DropDown DropdownHandler={TaskMenuIcon} dropDownStyle={{ transform: 'unset' }}>
            {onEdit ? (
              <DropDownItem onClick={onEdit} style={dropdownItemStyle}>
                Edit
              </DropDownItem>
            ) : null}

            {onDelete ? (
              <DropDownItem style={dropdownItemStyle} onClick={onDelete}>
                Delete
              </DropDownItem>
            ) : null}
          </DropDown>
>>>>>>> fd1501d7 (Feature/guild (#978))
        </div>
      </Tooltip>
    </Grid>
  );
}

export default TokenGatingActionMenu;
