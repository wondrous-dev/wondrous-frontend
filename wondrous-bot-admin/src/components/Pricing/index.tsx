import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import PricingOptionsList from "./PricingOptionsList";

const useHeight = () => {
  const theme = useTheme();
  const isXlScreenOnly = useMediaQuery(theme.breakpoints.up("xl"));
  const height = isXlScreenOnly ? "100vh" : "100%";
  return height;
};

const PricingComponent = () => {
  const height = useHeight();
  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="center" marginTop="50px">
        <Typography fontSize="32px" color="#06040A" fontWeight="600" fontFamily="Poppins, sans-serif">
          Pricing
        </Typography>
        <Typography
          color="#000000"
          fontSize="14px"
          fontWeight="600"
          fontFamily="Space Grotesk, sans-serif"
          textAlign="center"
        >
          Upgrade your community with our premium features
        </Typography>
      </Box>
      <Box width="100%" display="flex" height={height} justifyContent="center" position="relative" marginTop="32px">
        <PricingOptionsList />
        <Box
          sx={{
            position: "absolute",
            backgroundImage: "url(/images/pricing-bg.png)",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            height: height,
            zIndex: 0,
            bottom: 0,
            top: 84,
            left: 0,
            right: 0,
          }}
        />
      </Box>
    </>
  );
};

export default PricingComponent;
