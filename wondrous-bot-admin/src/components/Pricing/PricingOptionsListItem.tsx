import { Box, Button, List, ListItem, Typography } from "@mui/material";
import CheckIcon from "components/Icons/Check";
import PricingBestBadge from "components/Icons/pricing-best-badge.svg";
import { useEffect, useRef, useState } from "react";
import { BillingIntervalValue } from "./BillingInterval";
import { PricingOptionsListItemInnerWrapper, PricingOptionsListItemWrapper } from "./styles";
import { useSubscription } from "utils/hooks";
import { format } from "date-fns";
import { useMe } from "components/Auth";

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
  percentSavings?: number;
  yearlyLink?: string;
  settings?: boolean;
};

type PricingOptionsListItemProps = PricingOptionsListItemType & {
  billingInterval: BillingIntervalValue;
  settings?: boolean;
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

export const getPlan = (plan) => {
  if (!plan) return PricingOptionsTitle.Basic;
  if (plan === "hobby" || plan === "hobby_annual") return PricingOptionsTitle.Hobby;
  if (plan === "premium" || plan === "premium_annual") return PricingOptionsTitle.Premium;
  if (plan === "ecosystem" || plan === "ecomosystem_annual") return PricingOptionsTitle.Ecosystem;
};
const STRIPE_MANAGE_SUBSCRIPTION_LINK = import.meta.env.VITE_PRODUCTION
  ? "https://billing.stripe.com/p/login/fZefYZfFDdyk6NG8ww"
  : "https://billing.stripe.com/p/login/test_3csbKGfr73hIg2QdQQ";
const PricingOptionsListItem = ({
  colorScheme,
  title,
  description,
  monthlyPrice,
  annualPrice,
  buttonText,
  features,
  link,
  yearlyLink,
  best = false,
  billingInterval,
  savings,
  percentSavings,
  settings,
}: PricingOptionsListItemProps) => {
  const subscription = useSubscription();
  const plan = getPlan(subscription?.tier);
  const user = useMe()?.user;
  const userPurchasedSubscription = user?.id === subscription?.additionalData?.purchasedUserId;
  const canceled = subscription?.status === "canceled" && subscription?.additionalData?.cancelAtPeriodEnd;
  const willExpire =
    canceled &&
    new Date() < new Date(subscription?.additionalData?.currentPeriodEnd) &&
    format(new Date(subscription?.additionalData?.currentPeriodEnd), "MM/dd/yyyy");
  const expired = canceled && new Date() > new Date(subscription?.additionalData?.currentPeriodEnd);
  const price = billingInterval === BillingIntervalValue.monthly ? monthlyPrice : annualPrice;
  const billingPeriod = billingInterval === BillingIntervalValue.monthly ? "Per Server/Mo" : "Per Server/Year";
  const savingsText =
    billingInterval === BillingIntervalValue.annual &&
    savings &&
    `(${percentSavings}% off save ${formatCurrency(savings)})`;
  const { childHeight, ref } = useGetChildHeight();
  const currentPlan = plan === title;
  const canPurchaseNewPlan =
    !currentPlan &&
    !expired &&
    ((subscription && userPurchasedSubscription) || !subscription || title === PricingOptionsTitle.Ecosystem);
  return (
    <PricingOptionsListItemWrapper $colorScheme={colorScheme} $childHeight={childHeight} $willExpire={willExpire}>
      <PricingOptionsListItemInnerWrapper $colorScheme={colorScheme} ref={ref}>
        <a
          {...(canPurchaseNewPlan && {
            href:
              billingInterval === BillingIntervalValue.annual &&
              (title === PricingOptionsTitle.Hobby || title === PricingOptionsTitle.Premium)
                ? yearlyLink
                : link,
          })}
          {...(currentPlan &&
            title !== PricingOptionsTitle.Basic &&
            userPurchasedSubscription && { href: STRIPE_MANAGE_SUBSCRIPTION_LINK })}
          target="_blank"
          style={{
            textDecoration: "none",
          }}
        >
          {best && !settings && (
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
          <Box
            color="#000"
            display="flex"
            flexDirection="column"
            padding="24px"
            alignItems={settings ? "center" : "flex-start"}
            borderBottom="2px solid #DADADA"
          >
            <Typography
              fontWeight="600"
              fontFamily="Poppins, sans-serif"
              textAlign={settings ? "center" : "left"}
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
              {title === PricingOptionsTitle.Ecosystem && (
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "black",
                  }}
                >
                  From
                </span>
              )}
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
                ...(currentPlan &&
                  !expired && {
                    background: colorScheme,
                  }),
                "&:active": {
                  outline: "0 !important",
                },
              }}
            >
              {currentPlan && !expired ? (willExpire ? "Renew" : "Your current plan") : buttonText}
            </Button>
            {willExpire && currentPlan && (
              <Typography
                textAlign={"center"}
                fontFamily="Poppins, sans-serif"
                color="#4D4D4D"
                fontWeight="500"
                fontSize="13px"
                marginTop="8px"
                marginBottom="-16px"
              >
                Your subscription will expire on <b>08/12/23</b>
              </Typography>
            )}
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
                  minWidth="18px"
                  minHeight="18px"
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
