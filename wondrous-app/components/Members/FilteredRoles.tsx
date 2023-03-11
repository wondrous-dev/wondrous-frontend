import { useMemo } from 'react';
import RolePill from 'components/Common/RolePill';
import { Role } from 'types/common';
import { FilteredRolesContainer } from './styles';

type Props = {
  roles: Role[];
  selectedRoleIds: string[];
};

const FilteredRoles = (props: Props) => {
  const { roles, selectedRoleIds } = props;

  const selectedRoles = useMemo(
    () => roles?.filter((role) => selectedRoleIds.includes(role.id)),
    [roles, selectedRoleIds]
  );

  return (
    <FilteredRolesContainer>
      {selectedRoles?.map((role) => (
        <RolePill key={role.id} roleName={role.name} />
      ))}
    </FilteredRolesContainer>
  );
};

export default FilteredRoles;
