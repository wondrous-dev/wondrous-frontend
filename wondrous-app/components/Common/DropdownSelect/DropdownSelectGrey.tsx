import React, { useState } from 'react';
import ArrowDropDownIcon from 'components/Icons/arrowDropDown';
import DropdownSelect from 'components/Common/DropdownSelect';
import styled from 'styled-components';

export const RolesDropdown = styled(DropdownSelect)`
  .MuiInputBase-formControl {
    background: #1e1e1e;
    margin-top: 16px;
  }
`;

const MenuProps = {
  disableScrollLock: true,
  PaperProps: {
    style: {
      borderRadius: '6px',
      border: '1px solid #6A6A6A',
      maxHeight: '250px',
      background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 109.19%)',
      padding: '0 7px',
    },
  },
};

const DropdownSelectGrey = (props) => {
  const [inviteeRole, setInviteeRole] = useState(null);
  return (
    <RolesDropdown
      {...props}
      displayEmpty
      inputProps={{ 'aria-label': 'Without label' }}
      title="Role"
      titleStyle={{
        marginBottom: '-8px',
        marginTop: '16px',
      }}
      MenuProps={MenuProps}
      IconComponent={() => <ArrowDropDownIcon style={{ height: '7px', right: '15px' }} fill="#CCBBFF" />}
      value={inviteeRole}
      setValue={setInviteeRole}
      // options={filterRoles(roleList, null, userIsOwner)}
      style={{
        background: 'red',
      }}
      formSelectStyle={{
        width: 'auto',
        flex: 1,
        maxWidth: 'none',
      }}
    />
  );
};

export default DropdownSelectGrey;
