import RolePill from 'components/Common/RolePill';
import CheckMarkIcon from 'components/Icons/checkMark';
import palette from 'theme/palette';
import {
  RoleFilterSelect,
  RoleFilterSelectMenuIconWrapper,
  RoleFilterSelectMenuItem,
  RoleFilterSelectValueDisplay,
} from './styles';

type Role = {
  label: string;
  value: string;
};

type Props = {
  roles: Role[];
  selectedRoleIds: string[];
  handleRoleFilterChange: (role: string) => void;
};

const RoleFilter = (props: Props) => {
  const { roles, selectedRoleIds, handleRoleFilterChange } = props;

  const value = 'Showing all roles';
  const onChange = () => {};

  const renderMemberRoleSelection = () => {
    const isSelectedRoleDefault = selectedRoleIds?.length === 0;
    const isSingleRoleSelected = selectedRoleIds?.length === 1;
    const correspondingRole = roles?.find((role) => role.value === selectedRoleIds[0]);

    return (
      <RoleFilterSelectValueDisplay>
        {isSelectedRoleDefault ? (
          'Showing all roles'
        ) : isSingleRoleSelected ? (
          <RolePill roleName={correspondingRole?.label} />
        ) : (
          'Multiple roles selected'
        )}
      </RoleFilterSelectValueDisplay>
    );
  };

  return (
    <RoleFilterSelect renderValue={renderMemberRoleSelection} value={value} onChange={onChange}>
      {roles?.map((role) => (
        <RoleFilterSelectMenuItem key={role.value} value={role.value} onClick={handleRoleFilterChange}>
          <RolePill roleName={role.label} />
          {selectedRoleIds?.includes(role.value) ? (
            <RoleFilterSelectMenuIconWrapper isSelected>
              <CheckMarkIcon fillColor={palette.highlightPurple} />
            </RoleFilterSelectMenuIconWrapper>
          ) : (
            <RoleFilterSelectMenuIconWrapper />
          )}
        </RoleFilterSelectMenuItem>
      ))}
    </RoleFilterSelect>
  );
};

export default RoleFilter;
