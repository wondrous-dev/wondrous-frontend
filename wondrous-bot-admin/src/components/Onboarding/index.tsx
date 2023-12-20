import { useMutation } from "@apollo/client";
import { Box, ButtonBase, CircularProgress, FormControl, Grid, Typography } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import { Label } from "components/CreateTemplate/styles";
import { ErrorTypography } from "components/Login/styles";
import AuthLayout from "components/Shared/AuthLayout";
import { SharedSecondaryButton } from "components/Shared/styles";
import { CREATE_ORG } from "graphql/mutations";
import { useContext, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSchema } from "./validator";
import GlobalContext from "utils/context/GlobalContext";
import MetaPixel from "components/MetaPixel";
import GoogleTag from "components/GoogleTag";
import useWonderWeb3Modal from "services/web3/useWonderWeb3Modal";
import { logout } from "components/Auth";

const OnboardingComponent = () => {
  const { address, chainId, open, disconnect, isConnected } = useWonderWeb3Modal();
  const { setActiveOrg } = useContext(GlobalContext);
  const [orgData, setOrgData] = useState({
    name: "",
    username: "",
    twitterHandle: "",
    productLink: "",
  });

  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);

  const referrerPage = searchParams.get("ref");

  const handleGoBack = (e) => {
    e.preventDefault();
    if (referrerPage === "workspace") {
      return navigate(-1);
    }
    if (referrerPage === "signup") {
      logout("/signup");
    }
    if (referrerPage === "login") {
      logout();
    }
  };

  const goBackLabel = useMemo(() => {
    if (referrerPage === "workspace") {
      return "Go Back";
    }
    if (referrerPage === "signup") {
      return "Back to Signup";
    }
    if (referrerPage === "login") {
      return "Back to Login";
    }
  }, [referrerPage]);

  const navigate = useNavigate();
  const [createOrg, { loading }] = useMutation(CREATE_ORG, {
    notifyOnNetworkStatusChange: true,
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
    setOrgData({ ...orgData, [e.target.name]: e.target.value });
  };
  const validationSchema = useSchema();

  const formConfig = [
    {
      name: "name",
      label: "Name",
      value: orgData.name,
      onChange: handleChange,
      placeholder: "Enter project title",
      required: true,
    },
    {
      name: "username",
      label: "Username",
      value: orgData.username,
      onChange: handleChange,
      placeholder: "username",
      required: true,
      padding: "14px 14px 14px 24px",
      startAdornment: (
        <Typography
          fontFamily={"Poppins"}
          fontSize="15px"
          fontStyle="normal"
          fontWeight={400}
          color="black"
          position="absolute"
          padding="8px 0px 0px 8px"
        >
          @
        </Typography>
      ),
    },
    {
      name: "twitterHandle",
      label: "Twitter Handle",
      onChange: handleChange,
      placeholder: "twitter handle",
      required: true,
      padding: "14px 14px 14px 24px",
      startAdornment: (
        <Typography
          fontFamily={"Poppins"}
          fontSize="15px"
          fontStyle="normal"
          fontWeight={400}
          color="black"
          position="absolute"
          padding="8px 0px 0px 8px"
        >
          @
        </Typography>
      ),
    },
    {
      name: "productLink",
      label: "Product Website",
      onChange: handleChange,
      placeholder: "product-link.xyz",
      required: true,
      padding: "14px 14px 14px 65px",
      startAdornment: (
        <Typography
          fontFamily={"Poppins"}
          fontSize="15px"
          fontStyle="normal"
          fontWeight={400}
          color="black"
          position="absolute"
          padding="8px 0px 0px 8px"
        >
          https://
        </Typography>
      ),
    },
  ];

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(orgData, { abortEarly: false });
      const { data } = await createOrg({
        variables: {
          input: {
            name: orgData.name,
            username: orgData.username,
            cmtyEnabled: true,
            twitterHandle: orgData.twitterHandle,
            productLink: orgData.productLink,
          },
        },
      });
      setActiveOrg(data?.createOrg);
      navigate("/");
    } catch (err) {
      err?.inner?.forEach((e) => {
        setErrors((prev) => ({ ...prev, [e.path]: e.message }));
      });
    }
  };

  return (
    <AuthLayout>
      <MetaPixel />
      <GoogleTag />
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" padding="80px">
          <CircularProgress
            size={60}
            thickness={5}
            sx={{
              color: "#2A8D5C",
              animationDuration: "10000ms",
            }}
          />
        </Box>
      ) : (
        <Grid container direction="column" gap="32px" padding="42px" justifyContent="left" alignItems="left">
          <Box display="flex" gap="6px" flexDirection="column">
            <Typography fontFamily="Poppins" fontSize="24px" fontWeight="700" lineHeight="24px" color="#2A8D5C">
              Welcome!
            </Typography>
            <Label fontWeight={600}>Let's get your community setup.</Label>
          </Box>

          <FormControl
            fullWidth
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {formConfig.map((config, idx) => (
              <Box display="flex" gap="6px" flexDirection="column" width="100%">
                <CustomTextField key={config.name} {...config} />
                {errors[config.name] ? <ErrorTypography>{errors[config.name]}</ErrorTypography> : null}
              </Box>
            ))}
          </FormControl>
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap="12px">
            <SharedSecondaryButton type="button" onClick={handleSubmit}>
              Create Community 💖
            </SharedSecondaryButton>
            <ButtonBase onClick={handleGoBack}>
              <Typography
                fontFamily="Poppins"
                color="black"
                fontSize="12px"
                sx={{
                  textDecoration: "underline",
                  pointer: "cursor",
                  "&:hover": {
                    color: "#84bcff",
                  },
                }}
              >
                {goBackLabel}
              </Typography>
            </ButtonBase>
          </Box>
        </Grid>
      )}
    </AuthLayout>
  );
};

export default OnboardingComponent;
