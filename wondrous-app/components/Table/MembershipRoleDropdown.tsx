import React from 'react';
import DropdownSelect from 'components/Common/DropdownSelect/dropdownSelect';
import ArrowDropDownIcon from 'components/Icons/arrowDropDown';

const MembershipRoleDropdown = (props) => {
  const { onChange, role, roles } = props;

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

  return (
    <DropdownSelect
      value={role?.id}
      setValue={(roleId) => onChange(roles.find((role) => role.id === roleId))}
      MenuProps={MenuProps}
      IconComponent={() => <ArrowDropDownIcon style={{ height: '7px' }} fill="#CCBBFF" />}
      labelText="Choose role"
      options={roles.map((role) => {
        return { label: role?.name, value: role?.id };
      })}
      innerStyle={{
        marginTop: 0,
        padding: 0,
      }}
      labelStyle={{
        marginTop: '-15px',
      }}
      formSelectStyle={{
        height: 'auto',
        background: '#1b1b1b',
        border: '0.5px solid #4b4b4b',
      }}
    />
  );
};

export default MembershipRoleDropdown;
