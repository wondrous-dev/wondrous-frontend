import React from 'react';
import Grid from '@mui/material/Grid';
import Tooltip from 'components/Tooltip';

import palette from 'theme/palette';
import { DropDown, DropDownItem } from 'components/Common/dropdown';
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
        </div>
      </Tooltip>
    </Grid>
  );
}

export default TokenGatingActionMenu;
