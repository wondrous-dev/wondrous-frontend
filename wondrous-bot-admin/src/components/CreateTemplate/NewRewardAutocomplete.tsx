import { Autocomplete, Button, Grid, ListItem, TextField, Typography } from "@mui/material";
import AddIcon from "components/Icons/Add.svg";
import { DiscordRoleIcon, TokensIcon } from "components/Icons/Rewards";
import { scrollbarStyles } from "components/Shared/styles";
import { PAYMENT_OPTIONS } from "./RewardUtils";

type NewRewardAutocompleteProps = {
  discordRoleOptions: { label: any; value: any }[];
  handleNewDiscordRole: (value: any) => void;
  handleNewToken: (value: any) => void;
  onRewardAdd: (reward: any) => void;
  paymentMethodOptions: { label: any; value: any }[];
  rewards: { [key: string]: any }[];
  setIsRewardModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewRewardAutocomplete = ({
  discordRoleOptions,
  handleNewDiscordRole,
  handleNewToken,
  onRewardAdd,
  paymentMethodOptions,
  rewards,
  setIsRewardModalOpen,
  show,
  setShow,
}: NewRewardAutocompleteProps) => {
  const selectOptions = [
    {
      onSelect: () => setIsRewardModalOpen(true),
      label: "Add new reward",
      Icon: () => (
        <Button
          sx={{
            minWidth: 0,
            width: "24px",
            height: "24px",
            bgcolor: "#B1A3F9",
            borderRadius: "6px",
          }}
        >
          <img src={AddIcon} />
        </Button>
      ),
      groupBy: "",
    },
    ...discordRoleOptions.map((i) => ({
      ...i,
      type: PAYMENT_OPTIONS.DISCORD_ROLE,
      groupBy: "Discord Role",
      onSelect: handleNewDiscordRole,
      Icon: DiscordRoleIcon,
    })),
    ...paymentMethodOptions.map((i) => ({
      ...i,
      type: PAYMENT_OPTIONS.TOKEN,
      groupBy: "Token Reward",
      onSelect: handleNewToken,
      Icon: TokensIcon,
    })),
  ];

  return (
    <>
      {show ? (
        <Grid container>
          <Autocomplete
            options={selectOptions}
            groupBy={(option) => option?.groupBy}
            onChange={(event, value, reason) => {
              if (reason === "selectOption") {
                const { onSelect, ...newReward } = value;
                onSelect({ newReward, rewards, onRewardAdd });
                setShow(false);
              }
            }}
            componentsProps={{
              paper: {
                sx: { padding: "6px", marginY: "8px", outline: "1px solid #000" },
              },
            }}
            renderOption={(props, option) => {
              const { label, Icon = null } = option;
              return (
                <ListItem
                  {...props}
                  sx={{
                    borderRadius: "6px",
                    "&&.Mui-focused": {
                      backgroundColor: "#C5C5C573",
                    },
                  }}
                  style={{
                    padding: "10px 8px",
                  }}
                >
                  <Grid container alignItems="center" gap="8px" borderRadius="6px">
                    {Icon && <Icon />}
                    <Typography fontSize="14px" fontWeight="500" fontFamily="Poppins">
                      {label}
                    </Typography>
                  </Grid>
                </ListItem>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                placeholder="Select a reward"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  sx: {
                    height: "40px",
                    padding: "0 10px",
                    "& input": {
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      padding: 0,
                    },
                  },
                }}
              />
            )}
            ListboxProps={{
              sx: {
                padding: "6px",
                maxHeight: "300px",
                overflowY: "auto",
                "& .MuiListSubheader-root": {
                  padding: "16px 8px 8px 8px",
                  lineHeight: 1,
                  fontFamily: "Poppins",
                },
                ...scrollbarStyles,
              },
            }}
            sx={{
              width: "100%",
              borderRadius: "6px",
              background: "#E8E8E8",
              "&:focus-within": {
                outline: "1px solid #000",
              },
            }}
          />
        </Grid>
      ) : (
        <Grid container item width="fit-content" justifySelf="flex-end" justifyContent="flex-end">
          <Button
            sx={{
              minWidth: 0,
              width: "30px",
              height: "30px",
              bgcolor: "#B1A3F9",
              borderRadius: "6px",
              outline: "1px solid #000",
            }}
            onClick={() => setShow(true)}
          >
            <img src={AddIcon} />
          </Button>
        </Grid>
      )}
    </>
  );
};

export default NewRewardAutocomplete;
