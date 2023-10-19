import { useLazyQuery } from "@apollo/client";
import AutocompleteOptionsComponent from "components/AddFormEntity/components/AutocompleteComponent";
import { GET_COMMUNITY_USERS_FOR_ORG } from "graphql/queries";
import { useEffect, useState } from "react";
import { useGlobalContext } from "utils/hooks";

export const MemberPageSearchBar = ({ onChange, member }) => {
  const [getCmtyUsersForOrg, { data, loading, error }] = useLazyQuery(GET_COMMUNITY_USERS_FOR_ORG, {
    fetchPolicy: "cache-and-network",
  });
  const [searchString, setSearchString] = useState("");
  const { activeOrg } = useGlobalContext();
  useEffect(() => {
    if (activeOrg?.id && searchString) {
      getCmtyUsersForOrg({
        variables: {
          input: {
            orgId: activeOrg?.id,
            searchString,
          },
        },
      });
    }
  }, [activeOrg?.id, searchString]);
  const options = data?.getCmtyUsersForOrg?.map((option) => {
    const username = option?.username || option?.discordUsername || option?.telegramUsername || "N/A";
    return {
      label: username,
      value: option?.id,
    };
  });
  return (
    <AutocompleteOptionsComponent
      fullWidth
      options={options || []}
      bgColor="white"
      value={member}
      onChange={(value) => onChange(value)}
      inputProps={{
        onChange: (e) => {
          setSearchString(e.target.value);
        },
      }}
    />
  );
};
