import { useLazyQuery } from "@apollo/client";
import { useMediaQuery } from "@mui/material";
import AutocompleteOptionsComponent from "components/AddFormEntity/components/AutocompleteComponent";
import { SEARCH_COMMUNITY_USERS_FOR_ORG } from "graphql/queries";
import { useCallback, useEffect, useState } from "react";
import { useGlobalContext } from "utils/hooks";
import { debounce } from "lodash";

export const MemberPageSearchBar = ({ onChange, member, setMemberInfo }) => {
  const [searchCmtyUsersForOrg, { data, loading, error }] = useLazyQuery(SEARCH_COMMUNITY_USERS_FOR_ORG, {
    fetchPolicy: "cache-and-network",
  });
  const { activeOrg } = useGlobalContext();
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

  const search = useCallback(debounce(searchCmtyUsersForOrg, 1000), []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    search({
      variables: {
        input: {
          orgId: activeOrg?.id,
          searchString: value,
        },
      },
    });
  };

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));

  return (
    <AutocompleteOptionsComponent
      options={options || []}
      bgColor="white"
      fullWidth={isMobile}
      value={member}
      onChange={onChange}
      disableClearable={false}
      onClear={() => setMemberInfo(null)}
      inputProps={{
        onChange: handleInputChange,
      }}
    />
  );
};
