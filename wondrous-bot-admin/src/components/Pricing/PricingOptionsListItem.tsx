import { Box, Button, List, ListItem, Typography } from "@mui/material";
import CheckIcon from "components/Icons/Check";
import PricingBestBadge from "components/Icons/pricing-best-badge.svg";
import { useEffect, useRef, useState } from "react";
import { BillingIntervalValue } from "./BillingInterval";
import { PricingOptionsListItemInnerWrapper, PricingOptionsListItemWrapper } from "./styles";

export enum PricingOptionsTitle {
  Basic = "Basic",
  Hobby = "Hobby",
  Premium = "Premium",
  Ecosystem = "Ecosystem",
}

export type PricingOptionsListItemType = {
  colorScheme: string;
  title: PricingOptionsTitle;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  buttonText: string;
  features: string[];
  best?: boolean;
  link?: string;
  savings?: number;
};

type PricingOptionsListItemProps = PricingOptionsListItemType & {
  billingInterval: BillingIntervalValue;
};

const useGetChildHeight = () => {
  const [childHeight, setChildHeight] = useState();
  const ref = useRef(null);

  useEffect(() => {
    setChildHeight(ref.current.clientHeight);
  }, []);

  return { childHeight, ref };
};

const formatCurrency = (amount: number) =>
  amount &&
  amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const PricingOptionsListItem = ({
  colorScheme,
  title,
  description,
  monthlyPrice,
  annualPrice,
  buttonText,
  features,
  link,
  best = false,
  billingInterval,
  savings,
}: PricingOptionsListItemProps) => {
  const price = billingInterval === BillingIntervalValue.monthly ? monthlyPrice : annualPrice;
  const billingPeriod = billingInterval === BillingIntervalValue.monthly ? "Per Server/Mo" : "Per Server/Year";
  const savingsText =
    billingInterval === BillingIntervalValue.annual && savings && `(20% off save ${formatCurrency(savings)})`;
  const { childHeight, ref } = useGetChildHeight();
  return (
    <PricingOptionsListItemWrapper $colorScheme={colorScheme} $childHeight={childHeight}>
      <PricingOptionsListItemInnerWrapper $colorScheme={colorScheme} ref={ref}>
        <a
          href={link}
          target="_blank"
          style={{
            textDecoration: "none",
          }}
        >
          {best && (
            <Box
              position="absolute"
              sx={{
                top: 10,
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
            borderRadius="16px 16px 0 0"
            overflow="hidden"
            padding="14px"
          >
            <Typography color="#FFF" fontSize="14px" fontFamily="Poppins, sans-serif" fontWeight="600">
              {title}
            </Typography>
          </Box>
          <Box color="#000" display="flex" flexDirection="column" padding="24px" borderBottom="2px solid #DADADA">
            <Typography
              fontWeight="600"
              fontFamily="Poppins, sans-serif"
              sx={{
                width: {
                  xs: "auto",
                  md: "160px",
                  lg: "auto",
                },
              }}
            >
              {description}
            </Typography>
            <Typography
              fontFamily="Poppins, sans-serif"
              color={colorScheme}
              fontWeight="800"
              fontSize="62px"
              lineHeight="1"
              marginTop="18px"
              sx={{
                fontSize: {
                  xs: "62px",
                  md: "52px",
                  lg: "62px",
                },
              }}
            >
              {formatCurrency(price)}
            </Typography>
            <Typography
              fontFamily="Poppins, sans-serif"
              color="#4D4D4D"
              fontWeight="500"
              fontSize="13px"
              marginTop="8px"
              sx={{
                minHeight: {
                  md: "40px",
                  lg: "auto",
                },
              }}
            >
              {billingPeriod} {savingsText}
            </Typography>
            <Button
              disableRipple
              disableFocusRipple
              variant="text"
              className="cta-button"
              sx={{
                marginTop: "18px",
                border: `3px solid ${colorScheme}`,
                borderRadius: "1000px",
                width: "fit-content",
                minWidth: "85px",
                paddingX: "12px",
                color: "#000",
                fontWeight: "600",
                outline: "0 !important",
                fontFamily: "Poppins",
                textTransform: "capitalize",
                "&:active": {
                  outline: "0 !important",
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
              gap: "14px",
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
                  width="18px"
                  height="18px"
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
        </a>
      </PricingOptionsListItemInnerWrapper>
    </PricingOptionsListItemWrapper>
  );
};

export default PricingOptionsListItem;
