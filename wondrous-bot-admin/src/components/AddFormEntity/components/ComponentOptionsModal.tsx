import { Button, Grid, Stack, Typography } from "@mui/material";
import Modal from "components/Shared/Modal";
import { COMPONENT_CATEGORIES, COMPONENT_OPTIONS } from "../constants";

const OptionsColumn = ({ colOptions, options, onClick, onClose }) => {
  return (
    <Stack spacing={4}>
      {colOptions.map((category) => (
        <Stack spacing={2} key={category}>
          <Typography fontWeight={600} color="#737373" textTransform="capitalize">
            {category}
          </Typography>
          <Stack alignItems="start">
            {options[category].map((option) => (
              <Button
                disableRipple
                onClick={() => {
                  onClick(option.value);
                  onClose();
                }}
                sx={{
                  textTransform: "capitalize",
                  gap: 1,
                  borderRadius: "6px",
                  "&:hover": {
                    backgroundColor: "#EDEDED",
                  },
                }}
              >
                {option?.icon && <img src={option?.icon} alt={option.label} />}
                <Typography key={option.value} color="#262627">
                  {option.label}
                </Typography>
              </Button>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

const ComponentOptionsModal = ({ open, onClose, onClick }) => {
  const groupedOptionsByCategory = COMPONENT_OPTIONS.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {});

  const leftColOptions = [COMPONENT_CATEGORIES.ACTION, COMPONENT_CATEGORIES.TWITTER];
  const rightColOptions = [COMPONENT_CATEGORIES.DISCORD, COMPONENT_CATEGORIES.YOUTUBE, COMPONENT_CATEGORIES.CRYPTO];

  return (
    <Modal open={open} onClose={onClose} maxWidth={700}>
      <Grid container justifyContent="space-between" rowGap={3}>
        <Stack spacing={3}>
          <OptionsColumn
            colOptions={leftColOptions}
            options={groupedOptionsByCategory}
            onClose={onClose}
            onClick={onClick}
          />
        </Stack>
        <Stack spacing={3}>
          <OptionsColumn
            colOptions={rightColOptions}
            options={groupedOptionsByCategory}
            onClose={onClose}
            onClick={onClick}
          />
        </Stack>
      </Grid>
    </Modal>
  );
};

export default ComponentOptionsModal;
