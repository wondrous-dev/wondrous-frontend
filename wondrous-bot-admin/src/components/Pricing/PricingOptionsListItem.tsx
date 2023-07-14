import { Box, Button, List, ListItem, Typography } from "@mui/material";
import CheckIcon from "components/Icons/Check";
import PricingBestBadge from "components/Icons/pricing-best-badge.svg";
import { PricingOptionsListItemWrapper } from "./styles";

export type PricingOptionsListItemProps = {
  colorScheme: string;
  title: string;
  description: string;
  price: number;
  buttonText: string;
  features: string[];
  best?: boolean;
};

const PricingOptionsListItem = ({
  colorScheme,
  title,
  description,
  price,
  buttonText,
  features,
  best = false,
}: PricingOptionsListItemProps) => {
  return (
    <PricingOptionsListItemWrapper>
      {best && (
        <Box
          position="absolute"
          sx={{
            top: -45,
            right: 10,
            zIndex: 10,
          }}
        >
          <img src={PricingBestBadge} />
        </Box>
      )}
      <Box
        bgcolor={colorScheme}
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="16px 16px 0 0"
        overflow="hidden"
        padding="14px"
      >
        <Typography color="#FFF" fontSize="14px" fontFamily="Poppins, sans-serif" fontWeight="600">
          {title}
        </Typography>
      </Box>
      <Box
        color="#000"
        style={{
          outline: "1px solid black",
        }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        padding="24px"
      >
        <Typography fontWeight="600" fontFamily="Poppins, sans-serif">
          {description}
        </Typography>
        <Typography
          fontFamily="Poppins, sans-serif"
          color={colorScheme}
          fontWeight="800"
          fontSize="62px"
          lineHeight="1"
          marginTop="18px"
        >
          ${price}
        </Typography>
        <Typography fontFamily="Poppins, sans-serif" color="#4D4D4D" fontWeight="500" fontSize="13px" marginTop="8px">
          Per Server/Mo
        </Typography>
        <Button
          disableRipple
          disableFocusRipple
          variant="text"
          sx={{
            marginTop: "18px",
            border: `3px solid ${colorScheme}`,
            borderRadius: "1000px",
            width: "fit-content",
            minWidth: "85px",
            paddingX: "12px",
            color: "#000",
            fontWeight: "600",
            textTransform: "capitalize",
            "&:hover": {
              borderColor: colorScheme,
              background: "transparent",
            },
          }}
        >
          {buttonText}
        </Button>
      </Box>
      <List
        sx={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {features.map((feature) => (
          <ListItem
            key={feature}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#4d4d4d",
              fontSize: "13px",
              fontWeight: "500",
              padding: 0,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            <Box
              width="14px"
              height="14px"
              bgcolor={colorScheme}
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="100px"
            >
              <CheckIcon />
            </Box>
            {feature}
          </ListItem>
        ))}
      </List>
    </PricingOptionsListItemWrapper>
  );
};

export default PricingOptionsListItem;