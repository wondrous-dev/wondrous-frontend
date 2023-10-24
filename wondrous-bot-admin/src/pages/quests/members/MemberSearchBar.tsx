import { useLazyQuery } from "@apollo/client";
import AutocompleteOptionsComponent from "components/AddFormEntity/components/AutocompleteComponent";
import { GET_COMMUNITY_USERS_FOR_ORG, SEARCH_COMMUNITY_USERS_FOR_ORG } from "graphql/queries";
import { useEffect, useState } from "react";
import { useGlobalContext } from "utils/hooks";

export const MemberPageSearchBar = ({ onChange, member, setMemberInfo }) => {
  const [searchCmtyUsersForOrg, { data, loading, error }] = useLazyQuery(SEARCH_COMMUNITY_USERS_FOR_ORG, {
    fetchPolicy: "cache-and-network",
  });
  const [searchString, setSearchString] = useState("");
  const { activeOrg } = useGlobalContext();
  useEffect(() => {
    if (activeOrg?.id && searchString) {
      searchCmtyUsersForOrg({
        variables: {
          input: {
            orgId: activeOrg?.id,
            searchString,
          },
        },
      });
    }
  }, [activeOrg?.id, searchString]);
  const options = data?.searchCmtyUsersForOrg?.map((option) => {
    const username = option?.username || option?.discordUsername || option?.telegramUsername || "N/A";
    return {
      label: username,
      value: option?.id,
    };
  });
  useEffect(() => {
    if (member) {
      const user = data?.searchCmtyUsersForOrg?.find((option) => option?.id === member);
      setMemberInfo(user);
    }
  }, [member, data?.searchCmtyUsersForOrg]);
  return (
    <AutocompleteOptionsComponent
      options={options || []}
      bgColor="white"
      value={member}
      onChange={(value) => {
        onChange(value);
      }}
      disableClearable={false}
      onClear={() => setMemberInfo(null)}
      inputProps={{
        onChange: (e) => {
          setSearchString(e.target.value);
        },
      }}
    />
  );
};
