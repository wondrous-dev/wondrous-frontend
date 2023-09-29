import { Box, Grid } from "@mui/material";
import { StorePointsIcon } from "components/Icons/Rewards";
import { CardHoverWrapper, CardWrapper, Label } from "components/QuestsList/styles";
import PageWrapper from "components/Shared/PageWrapper";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BG_TYPES, STORE_ITEM_TYPES, STORE_ITEM_LABELS } from "utils/constants";

const formatStoreData = (data = []) => {
  const result = {};
  data.forEach((storeItem) => {
    const storeItemType = storeItem.type;
    if (!result[storeItemType]) {
      result[storeItemType] = {
        label: STORE_ITEM_LABELS[storeItemType],
        items: [],
      };
    }

    result[storeItemType].items.push({
      label: storeItem.name,
      price: storeItem.ptPrice,
      id: storeItem.id,
      status: storeItem.status,
      totalPurchases: storeItem?.stats?.totalPurchases,
    });
  });

  return result;
};

const StoreItemsList = ({ data }) => {
  const navigate = useNavigate();
  const storeData = useMemo(() => {
    if (!data) return {};
    return formatStoreData(data);
  }, [data]);

  return (
    <PageWrapper
      bgType={BG_TYPES.QUESTS}
      containerProps={{
        minHeight: "100vh",
        flexDirection: "column",
        gap: "42px",
        padding: {
          xs: "14px 14px 120px 14px",
          sm: "24px 56px",
        },
      }}
    >
      {Object.keys(STORE_ITEM_TYPES).map((type, idx) => {
        if (!storeData[STORE_ITEM_TYPES[type]]) return null;
        return (
          <Grid
            display="flex"
            key={type}
            width="100%"
            flexDirection="column"
            gap="28px"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Label>{STORE_ITEM_LABELS[STORE_ITEM_TYPES[type]]}</Label>
            <Grid container gap="30px 14px">
              {storeData[STORE_ITEM_TYPES[type]]?.items?.map((item, idx) => {
                console.log(item, "ITM");
                return (
                  <CardHoverWrapper
                    onClick={() => navigate(`/store/items/${item.id}`)}
                    flex={1}
                    data-tour={idx === 0 ? "tutorial-quest-card" : ""}
                    key={item.id}
                    flexBasis={{
                      xs: "48%",
                      sm: "30%",
                      md: "24%",
                    }}
                    maxWidth={{
                      xs: "50%",
                      sm: "33%",
                      md: "24%",
                    }}
                  >
                    <CardWrapper item>
                      <Box
                        height="40px"
                        width="auto"
                        minWidth="40px"
                        bgcolor="#DCD4FF"
                        borderRadius="35px"
                        display="flex"
                        padding="4px"
                        justifyContent="center"
                        alignItems="center"
                        gap="3px"
                        flexDirection="column"
                      >
                        <StorePointsIcon />
                        <Label fontSize="12px" lineHeight="13px" fontWeight={600}>
                          {item.price}
                        </Label>
                      </Box>
                      <Label
                        fontSize="15px"
                        style={{
                          textAlign: "center",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {item.label}
                      </Label>
                      <Box display="flex" justifyContent="center" alignItems="center">
                        <Box
                          bgcolor="#C1B6F6"
                          padding="8px"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          borderRadius="6px"
                        >
                          <Label fontSize="14px" lineHeight="14px">
                            {item?.totalPurchases} {item?.totalPurchases === 1 ? "Purchase" : "Purchases"}
                          </Label>
                        </Box>
                      </Box>
                    </CardWrapper>
                  </CardHoverWrapper>
                );
              })}
            </Grid>
          </Grid>
        );
      })}
    </PageWrapper>
  );
};

export default StoreItemsList;
