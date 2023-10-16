import { useLazyQuery, useMutation } from "@apollo/client";
import { Box, FormControl, Grid } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import { DisconnectButton, SharedLabel } from "components/ConnectBotComponent/styles";
import EmptyState from "components/EmptyState";
import { ErrorTypography } from "components/Login/styles";
import { NotificationWrapper } from "components/Settings/NotificationSettings/styles";
import SettingsLayout from "components/Shared/SettingsLayout";
import Spinner from "components/Shared/Spinner";
import TextField from "components/Shared/TextField";
import { SharedSecondaryButton } from "components/Shared/styles";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { CREATE_ORG_QUEST_CATEGORY, DELETE_ORG_QUEST_CATEGORY } from "graphql/mutations";
import { GET_QUEST_CATEGORIES } from "graphql/queries";
import { useEffect, useState } from "react";
import { EMPTY_STATE_TYPES } from "utils/constants";
import useAlerts, { useGlobalContext } from "utils/hooks";

const CategoriesSettingsPage = () => {
  const { activeOrg } = useGlobalContext();
  const [categoryTitle, setCategoryTitle] = useState("");
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useAlerts();

  const [getQuestCategories, { data, loading, fetchMore }] = useLazyQuery(GET_QUEST_CATEGORIES, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  const [deleteOrgQuestCategory, {loading: deleteLoading}] = useMutation(DELETE_ORG_QUEST_CATEGORY, {
    refetchQueries: ["getOrgQuestCategories"],
    onCompleted: () => {
      setSnackbarAlertMessage("Quest category deleted successfully.");
      setSnackbarAlertOpen(true);
      setCategoryTitle("");
    },
    onError: () => {
      setSnackbarAlertMessage("Something went wrong. Please try again later.");
      setSnackbarAlertOpen(true);
    },
  });

  const [createQuestCategory, { loading: createLoading }] = useMutation(CREATE_ORG_QUEST_CATEGORY, {
    refetchQueries: ["getOrgQuestCategories"],
    onCompleted: () => {
      setSnackbarAlertMessage("Quest category created successfully.");
      setSnackbarAlertOpen(true);
      setCategoryTitle("");
    },
    onError: () => {
      setSnackbarAlertMessage("Something went wrong. Please try again later.");
      setSnackbarAlertOpen(true);
    },
  });

  useEffect(() => {
    if (!activeOrg?.id) return;
    getQuestCategories({
      variables: {
        orgId: activeOrg?.id,
      },
    });
  }, [activeOrg?.id]);

  const handleCreate = async (categoryTitle) => {
    await createQuestCategory({
      variables: {
        orgId: activeOrg?.id,
        category: categoryTitle,
      },
    });
  };

  const handleDelete = async (categoryId) => {
    await deleteOrgQuestCategory({
      variables: {
        categoryId,
      },
    });
  };

  return (
    <>
      <SettingsLayout title="Quest Categories">
        <Grid
          flex="1"
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          gap="32px"
          width={{
            xs: "100%",
            sm: "70%",
          }}
        >
          <SharedLabel>Manage quest categories</SharedLabel>
          <NotificationWrapper style={{ padding: "14px" }}>
            <Grid display="flex" gap="14px" flexDirection="column" width="100%">
              <Box display="flex" gap="20%" alignItems="center" width="100%" justifyContent="space-between">
                <Box display="flex" gap="14px" alignItems="center" width="100%">
                  <TextField multiline={false} value={categoryTitle} onChange={setCategoryTitle} />
                  <SharedSecondaryButton onClick={() => handleCreate(categoryTitle)}>
                    {createLoading ? <Spinner /> : "Add Category"}
                  </SharedSecondaryButton>
                </Box>
              </Box>
              {!data?.getOrgQuestCategories?.length && !loading && (
                <EmptyState
                  labelColor="#CDCDCD"
                  sx={{
                    border: "1px solid #CDCDCD",
                  }}
                  type={EMPTY_STATE_TYPES.CATEGORIES}
                />
              )}
              <Grid display="flex" flexDirection="column" gap="10px" width="100%" paddingTop="12px">
                {data?.getOrgQuestCategories?.map((item, idx) => {
                  return (
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      width="100%"
                      gap="12px"
                    >
                      <Box width="100%" justifyContent="space-between" alignItems="center" display="flex">
                        <SharedLabel>{item.category}</SharedLabel>
                        <DisconnectButton onClick={() => handleDelete(item.id)}>Delete</DisconnectButton>
                      </Box>
                      {idx !== data?.getOrgQuestCategories?.length - 1 && <Divider />}
                    </Box>
                  );
                })}
              </Grid>
            </Grid>
          </NotificationWrapper>
        </Grid>
      </SettingsLayout>
    </>
  );
};

export default CategoriesSettingsPage;
