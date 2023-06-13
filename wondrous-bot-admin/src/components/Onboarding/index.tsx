import { useMutation } from "@apollo/client";
import { Box, CircularProgress, FormControl, Grid, Typography } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import { Label } from "components/CreateTemplate/styles";
import { ErrorTypography } from "components/Login/styles";
import AuthLayout from "components/Shared/AuthLayout";
import { SharedSecondaryButton } from "components/Shared/styles";
import { CREATE_ORG } from "graphql/mutations";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSchema } from "./validator";

const OnboardingComponent = () => {
  const [orgData, setOrgData] = useState({
    name: "",
    username: "",
  });

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
      placeholder: "communities",
      required: true,
      onBlur: async () => {
        if (!orgData.username || !orgData.name) return;
        try {
          await validationSchema.validate(orgData, { abortEarly: false });
        } catch (err) {
          err.inner.forEach((e) => {
            setErrors((prev) => ({ ...prev, [e.path]: e.message }));
          });
        }
      },
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
          },
        },
      });
      navigate("/");
    } catch (err) {
      err?.inner?.forEach((e) => {
        setErrors((prev) => ({ ...prev, [e.path]: e.message }));
      });
    }
  };

  return (
    <AuthLayout>
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
          <SharedSecondaryButton type="button" onClick={handleSubmit}>
            Launch Community 💖
          </SharedSecondaryButton>
        </Grid>
      )}
    </AuthLayout>
  );
};

export default OnboardingComponent;
