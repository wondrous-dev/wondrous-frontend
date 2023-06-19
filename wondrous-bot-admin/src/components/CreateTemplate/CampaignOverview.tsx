import { Grid } from "@mui/material";
import TextFieldComponent from "components/Shared/TextField";
import SelectComponent from "components/Shared/Select";
import Switch from "components/Shared/Switch";
import ToggleComponent from "components/Shared/Toggle";
import { CampaignOverviewTitle, Label } from "./styles";
import TimeboundComponent from "./TimeboundComponent";
import DynamicCondition from "components/DynamicCondition";
import useLevels from "utils/levels/hooks";
import { useContext, useMemo } from "react";
import GlobalContext from "utils/context/GlobalContext";
import OnboardingComponent from "components/AddFormEntity/components/OnboardingComponent";
import CreateQuestContext from "utils/context/CreateQuestContext";
import MaxInput from "./MaxInput";

const REQUIRE_REVIEW_OPTIONS = [
  {
    label: "Yes",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
];

const CampaignOverview = ({ questSettings, setQuestSettings }) => {
  const { activeOrg } = useContext(GlobalContext);
  const { errors, setErrors } = useContext(CreateQuestContext);
  const handleChange = (key, value) => {
    if (errors[key]) {
      setErrors({
        ...errors,
        [key]: null,
      });
    }
    setQuestSettings({
      ...questSettings,
      [key]: value,
    });
  };

  const { levels } = useLevels({
    orgId: activeOrg?.id,
  });

  const levelsOptions = useMemo(() => {
    return Object.keys(levels).map((key) => ({
      label: levels[key],
      value: key,
    }));
  }, [levels]);

  const CONFIG = [
    {
      label: "Level Requirement",
      component: SelectComponent,
      value: questSettings.level,
      componentProps: {
        options: levelsOptions,
        disabled: questSettings.isOnboarding,
      },
      key: "level",
    },
    {
      label: "Time Bound",
      component: TimeboundComponent,
      value: {
        timeBound: questSettings.timeBound,
        startAt: questSettings.startAt,
        endAt: questSettings.endAt,
      },
      key: "timeBound",
    },
    {
      label: "Require Review",
      component: ToggleComponent,
      value: questSettings.requireReview,
      key: "requireReview",
      componentProps: {
        options: REQUIRE_REVIEW_OPTIONS,
        fullWidth: true,
      },
    },
    {
      label: "Condition",
      component: DynamicCondition,
      key: "questConditions",
      componentProps: {
        value: questSettings.questConditions[0],
        setQuestSettings,
      },
    },
    {
      label: "Max Submissions",
      component: MaxInput,
      value: !!questSettings?.maxSubmission,
      componentProps: {
        keyValue: questSettings?.maxSubmission,
        onChange: (value) => {
          if (!value && questSettings.maxSubmission) {
            return handleChange("maxSubmission", null);
          }
          return handleChange("maxSubmission", 1);
        },
      },
      key: "maxSubmission",
    },
    {
      label: "Max Approvals",
      component: MaxInput,
      value: !!questSettings?.maxApproval,
      componentProps: {
        keyValue: questSettings?.maxApproval,
        onChange: (value) => {
          if (!value && questSettings.maxApproval) {
            return handleChange("maxApproval", null);
          }
          return handleChange("maxApproval", 1);
        },
      },
      key: "maxApproval",
    },
    {
      label: "Active Quest",
      component: Switch,
      value: questSettings?.isActive,
      key: "isActive",
    },
    {
      label: "Onboarding Quest",
      component: OnboardingComponent,
      value: questSettings?.isOnboarding,
      key: "isOnboarding",
    },
  ];

  return (
    <>
      {CONFIG.map(({ label, component: Component, key, componentProps = {} }: any, idx) => {
        return (
          <Grid display="flex" justifyContent="flex-start" alignItems="center" width="100%" gap="10%" key={key}>
            <Label>{label}</Label>
            {Component ? (
              <Component
                onChange={(value) => handleChange(key, value)}
                error={errors[key]}
                stateKey={key}
                value={questSettings[key]}
                questSettings={questSettings}
                setQuestSettings={setQuestSettings}
                {...componentProps}
              />
            ) : null}
          </Grid>
        );
      })}
    </>
  );
};

const CampaignOverviewHeader = ({ title = "Quest Settings" }) => (
  <Grid
    padding="14px"
    bgcolor="#2A8D5C"
    sx={{
      borderTopLeftRadius: "16px",
      borderTopRightRadius: "16px",
    }}
  >
    <CampaignOverviewTitle>{title}</CampaignOverviewTitle>
  </Grid>
);

export { CampaignOverview, CampaignOverviewHeader };
