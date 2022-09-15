import React from 'react';
import Grid from '@mui/material/Grid';
import Tooltip from 'components/Tooltip';

import palette from 'theme/palette';
import { DropDown } from 'components/Common/dropdown';
import DropdownItem from 'components/Common/DropdownItem';
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
          <DropDown DropdownHandler={TaskMenuIcon} dropDownStyle={{ transform: 'unset' }}>
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
          </DropDown>
        </div>
      </Tooltip>
    </Grid>
  );
}

export default TokenGatingActionMenu;
