import RolePill from 'components/Common/RolePill';
import { Role } from 'types/common';
import { FilteredRolesContainer } from './styles';

type Props = {
  roles: Role[];
  selectedRoleIds: string[];
};

const FilteredRoles = (props: Props) => {
  const { roles, selectedRoleIds } = props;

  const selectedRoles = roles?.filter((role) => selectedRoleIds.includes(role.id));

  return (
    <FilteredRolesContainer>
      {selectedRoles?.map((role) => (
        <RolePill key={role.id} roleName={role.name} />
      ))}
    </FilteredRolesContainer>
  );
};

export default FilteredRoles;
