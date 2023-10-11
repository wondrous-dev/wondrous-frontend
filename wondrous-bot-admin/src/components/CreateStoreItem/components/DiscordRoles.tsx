import SelectComponent from "components/Shared/Select";
import { useContext, useMemo } from "react";
import CreateQuestContext from "utils/context/CreateQuestContext";
import GlobalContext from "utils/context/GlobalContext";
import { useDiscordRoles } from "utils/discord";

const DiscordRoles = ({ setStoreItemData, storeItemData }) => {
  const { errors = {}, setErrors } = useContext(CreateQuestContext);
  const activeError = errors["discordRoleName"]  || errors["discordRoleId"] || errors["discordGuildId"];
  const { activeOrg } = useContext(GlobalContext);
  const roles = useDiscordRoles({
    orgId: activeOrg?.id,
  });

  const allRoles = useMemo(() => {
    return roles
      .map((role) =>
        role.roles.map((newRole) => ({
          ...newRole,
          discordGuildId: role.guildId,
        }))
      )
      .flat()
      ?.map((role) => ({
        value: role.id,
        label: role.name,
        discordGuildId: role.discordGuildId,
      }));
  }, [roles]);

  const onChange = (value) => {
    const role = allRoles?.find((role) => role.value === value);
    setStoreItemData((prev) => {
      return {
        ...prev,
        config: {
          ...prev.config,
          additionalData: {
            ...prev.config.additionalData,
            discordRoleId: value,
            discordGuildId: role.discordGuildId,
            discordRoleName: role.label,
          },
        },
      };
    });
    if (activeError) {
      setErrors((prev) => ({
        ...prev,
        discordRoleId: null,
        discordRoleName: null,
        discordGuildId: null,
      }));
    }
  };

  return (
    <SelectComponent
      options={allRoles || []}
      onChange={onChange}
      error={activeError}
      value={storeItemData?.config?.additionalData?.discordRoleId}
    />
  );
};

export default DiscordRoles;
