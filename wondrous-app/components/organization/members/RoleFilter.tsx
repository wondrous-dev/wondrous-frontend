import { RoleFilterSelect } from './styles';

type Props = {
  roles: string[];
};

const RoleFilter = (props: Props) => {
  const { roles } = props;

  const value = 'Showing all roles';
  const onChange = () => {};

  const renderMemberRoleSelection = () => {
    const correspondingRole = 'Showing all roles';
    // const correspondingRole = options.find((r) => r.value === roleId);

    return (
      <div>
        {correspondingRole}
        {/* <MemberRoleSelectValueDisplay>
            <MemberRole borderColor={getRoleColor(correspondingRole)}>
              <span>{getRoleEmoji(correspondingRole)}</span>
              <Typography color={palette.white} textTransform="capitalize" fontSize={13} fontWeight={500}>
                {correspondingRole?.label}
              </Typography>
            </MemberRole>
          </MemberRoleSelectValueDisplay> */}
      </div>
    );
  };

  return <RoleFilterSelect renderValue={renderMemberRoleSelection} value={value} onChange={onChange} />;
};

export default RoleFilter;
