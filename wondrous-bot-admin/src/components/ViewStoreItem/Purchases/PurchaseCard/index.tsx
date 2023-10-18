import { Typography, Grid, Box } from "@mui/material";
import AccordionComponent from "components/Shared/Accordion";
import { StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { Label } from "components/QuestsList/styles";
import moment from "moment";
import { MONTH_DAY_FULL_YEAR, STORE_ITEM_TYPES } from "utils/constants";
import { useMemo } from "react";

const PurchaseCard = ({ purchase, discordRoles, storeItem }) => {
  const username =
    purchase?.cmtyUser?.username || purchase?.cmtyUser?.discordUsername || purchase?.cmtyUser?.telegramUsername;

    const discordRoleName = useMemo(() => {
        const allRoles = discordRoles?.map((role) => role.roles).flat();
        return allRoles?.find((item) => item.id === storeItem.additionalData?.discordRoleId)?.name;
      }, [discordRoles, storeItem?.additionalData?.discordRoleId]);

  return (
    <AccordionComponent
      renderTitle={() => (
        <Typography fontFamily="Poppins" fontWeight={600} fontSize="13px" lineHeight="20px" color="black">
          {username}
        </Typography>
      )}
    >
      <Grid bgcolor="white" gap="18px" padding="14px" display="flex" flexDirection="column">
        <Grid display="flex" flexDirection="column" gap="8px" alignItems="flex-start" justifyContent="flex-start">
          <Box display="flex" alignItems="center" gap="2px">
          <Label fontSize="12px" color="#2A8D5C" fontWeight={500}>
            Purchased on:{" "}
          </Label>
            <Label color="#2A8D5C" fontWeight={700} fontSize="12px">
              {moment(purchase?.createdAt)?.format(MONTH_DAY_FULL_YEAR)}
            </Label>
          </Box>
        </Grid>
        <Grid display="flex" alignItems="center" gap="20px">
          <StyledViewQuestResults $isReward>Points price: {purchase?.pointAmount}</StyledViewQuestResults>
          {purchase?.discountCodeId ? (
            <StyledViewQuestResults $isReward>Discount code: {purchase?.discountCode?.code}</StyledViewQuestResults>
          ) : null}
          {storeItem.type === STORE_ITEM_TYPES.DISCORD_ROLE && discordRoleName ? (
            <StyledViewQuestResults $isReward>Discord role: {discordRoleName}</StyledViewQuestResults>
          ) : null}
        </Grid>
      </Grid>
    </AccordionComponent>
  );
};

export default PurchaseCard;
