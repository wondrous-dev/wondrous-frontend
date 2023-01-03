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
  handleRoleFilterChange: (roleId: string) => void;
};

const RoleFilterSelection = (props: Props) => {
  const { roles, selectedRoleIds, handleRoleFilterChange } = props;

  const value = 'Showing all roles';

  const renderMemberRoleSelection = () => {
    const areAllRolesSelected = selectedRoleIds?.length === roles?.length;
    const isSelectedRoleDefault = selectedRoleIds?.length === 0;
    const isSingleRoleSelected = selectedRoleIds?.length === 1;
    const correspondingRole = roles?.find((role) => role.value === selectedRoleIds[0]);

    return (
      <RoleFilterSelectValueDisplay>
        {isSelectedRoleDefault || areAllRolesSelected ? (
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
    <RoleFilterSelect
      renderValue={renderMemberRoleSelection}
      value={value}
      onChange={(ev) => {
        handleRoleFilterChange(ev.target.value);
      }}
    >
      {roles?.map((role) => (
        <RoleFilterSelectMenuItem key={role.value} value={role.value}>
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

export default RoleFilterSelection;
