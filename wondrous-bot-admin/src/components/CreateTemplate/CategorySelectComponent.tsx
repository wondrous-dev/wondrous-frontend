import { useLazyQuery, useMutation } from "@apollo/client";
import { ButtonBase, createFilterOptions } from "@mui/material";
import AutocompleteOptionsComponent from "components/AddFormEntity/components/AutocompleteComponent";
import { CREATE_ORG_QUEST_CATEGORY, DELETE_ORG_QUEST_CATEGORY } from "graphql/mutations";
import { GET_QUEST_CATEGORIES } from "graphql/queries";
import { useEffect, useMemo } from "react";
import { useGlobalContext } from "utils/hooks";
import CloseIcon from "@mui/icons-material/Close";

const filter = createFilterOptions();

const CategorySelectComponent = ({ onChange, stateKey, value, ...props }) => {
  const { activeOrg } = useGlobalContext();
  const [getQuestCategories, { data, loading, fetchMore }] = useLazyQuery(GET_QUEST_CATEGORIES, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    if(!data && value) {
      getQuestCategories({
        variables: {
          orgId: activeOrg?.id,
        },
      });
    }
  }, [data, value])

  const [deleteOrgQuestCategory, { loading: deleteLoading }] = useMutation(DELETE_ORG_QUEST_CATEGORY, {
    refetchQueries: ["getOrgQuestCategories"],
  });

  const [createQuestCategory, { loading: createLoading }] = useMutation(CREATE_ORG_QUEST_CATEGORY, {
    refetchQueries: ["getOrgQuestCategories"],
  });

  const handleDelete = async (id, category) => {
    await deleteOrgQuestCategory({
      variables: {
        categoryId: id,
      },
    });
    if (category === value) {
      onChange(null);
    }
  };

  const handleSelectOpen = async () => {
    if(!data) {
      await getQuestCategories({
        variables: {
          orgId: activeOrg?.id,
        },
      });  
    }
  };
  const options = useMemo(() => {
    if (!data?.getOrgQuestCategories) return [];

    return data?.getOrgQuestCategories?.length
      ? data?.getOrgQuestCategories?.map((item, idx) => ({
          label: item.category,
          value: item.category,
          id: item.id,
          displayCustomOnHover: true,
          customComponent: () => (
            <ButtonBase
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id, item.category);
              }}
              sx={{
                backgroundColor: "transparent",
                borderRadius: "100%",
                "&:hover": {
                  backgroundColor: "#c6bbfc",
                },
              }}
            >
              <CloseIcon
                sx={{
                  color: "black",
                }}
              />
            </ButtonBase>
          ),
        }))
      : [
          {
            value: "no-categ",
            label: "Nothing found",
            disabled: true,
          },
        ];
  }, [data?.getOrgQuestCategories, value]);

  const handleCreate = async (value) => {
    try {
      await createQuestCategory({
        variables: {
          orgId: activeOrg?.id,
          category: value,
        },
      });
      onChange(value);
    } catch (error) {}
  };

  return (
    <AutocompleteOptionsComponent
      options={options}
      bgColor="#e8e8e8"
      fullWidth
      value={value}
      placeholder="Select or create category"
      onChange={(value, option) => {
        if (option?.toCreate) {
          return handleCreate(value);
        }
        onChange(value);
      }}
      autocompletProps={{
        selectOnFocus: true,
        disableClearable: false,
        clearOnBlur: true,
        onOpen: handleSelectOpen,
        handleHomeEndKeys: true,
        openOnInput: true,
        freeSolo: true,
        getOptionLabel: (option) => {
          if (option.toCreate) {
            return option?.value;
          }
          return option?.label || options?.find((i) => i.value === option)?.label || option;
        },
        filterOptions: (options, params) => {
          const filtered = filter(options, params);
          const { inputValue } = params;
          // Suggest the creation of a new value
          const isExisting = options.some((option) => inputValue === option.label);
          if (inputValue !== "" && !isExisting) {
            filtered.push({
              value: inputValue,
              label: `Create "${inputValue}"`,
              toCreate: true,
            });
          }
          return filtered;
        },
      }}
    />
  );
};

export default CategorySelectComponent;
