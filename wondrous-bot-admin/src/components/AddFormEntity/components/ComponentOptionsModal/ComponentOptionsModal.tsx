import { Button, Grid, Stack, Typography, useTheme } from "@mui/material";
import { COMPONENT_CATEGORIES } from "components/AddFormEntity/constants";
import SafeImage from "components/SafeImage";
import Modal from "components/Shared/Modal";
import { ColumnContainer, OptionButton, OptionsColumnContainer } from "./styles";

const chooseIcon = (icon, category) => {
  if (!icon) {
    // in case icon is not provided, particularly for custom integrations, return a default icon
    return <img src={"/wonder.svg"} alt={icon} style={{ width: "25px", height: "25px", borderRadius: "6px" }} />;
  }
  if (category === COMPONENT_CATEGORIES.CUSTOM) {
    return (
      <SafeImage
        src={icon}
        alt="icon"
        style={{ width: "25px", height: "25px", borderRadius: "6px", objectFit: "cover" }}
      />
    );
  }
  return <img src={icon} alt={icon} />;
};

const OptionsColumn = ({ colOptions, options, onClick, onClose, showBorder }) => {
  return (
    <OptionsColumnContainer $showBorder={showBorder}>
      {colOptions.map((category) => (
        <Stack spacing={2} key={category}>
          <Typography fontWeight={600} color="#737373" textTransform="capitalize">
            {category}
          </Typography>
          <Stack alignItems="start">
            {options[category].map((option) => (
              <OptionButton
                disableRipple
                onClick={() => {
                  onClick(option.value);
                  onClose();
                }}
                startIcon={chooseIcon(option.icon, category)}
              >
                <Typography key={option.value} color="#262627" textAlign="left">
                  {option.label}
                </Typography>
              </OptionButton>
            ))}
          </Stack>
        </Stack>
      ))}
    </OptionsColumnContainer>
  );
};

const ComponentOptionsModal = ({ open, onClose, onClick, options }) => {
  const groupedOptionsByCategory = options.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {});

  const leftColOptions = [COMPONENT_CATEGORIES.ACTION, COMPONENT_CATEGORIES.TWITTER];
  const midColOptions = [COMPONENT_CATEGORIES.DISCORD, COMPONENT_CATEGORIES.YOUTUBE, COMPONENT_CATEGORIES.CRYPTO];
  const rightColOptions = [COMPONENT_CATEGORIES.CUSTOM];

  const hasCustomComponent = options.some((option) => option.category === COMPONENT_CATEGORIES.CUSTOM);

  return (
    <Modal open={open} onClose={onClose} maxWidth={hasCustomComponent ? 1200 : 800}>
      <ColumnContainer>
        <OptionsColumn
          colOptions={leftColOptions}
          options={groupedOptionsByCategory}
          onClose={onClose}
          onClick={onClick}
          showBorder={false}
        />
        <OptionsColumn
          colOptions={midColOptions}
          options={groupedOptionsByCategory}
          onClose={onClose}
          onClick={onClick}
          showBorder
        />
        {hasCustomComponent && (
          <OptionsColumn
            colOptions={rightColOptions}
            options={groupedOptionsByCategory}
            onClose={onClose}
            onClick={onClick}
            showBorder
          />
        )}
      </ColumnContainer>
    </Modal>
  );
};

export default ComponentOptionsModal;
