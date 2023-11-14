import { Dispatch, useContext, useMemo } from "react";
import TextField from "components/Shared/TextField";
import CreateQuestContext from "utils/context/CreateQuestContext";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { ButtonBase, Grid } from "@mui/material";
import { Label } from "components/CreateTemplate/styles";
import LevelComponent from "components/AddFormEntity/components/LevelComponent";
import { MONTH_DAY_FULL_YEAR, REFERRAL_STATUSES } from "utils/constants";
import { CampaignOverviewSections } from "components/CreateTemplate/CampaignOverview";
import SelectComponent from "components/Shared/Select";
import useLevels from "utils/levels/hooks";
import { useGlobalContext } from "utils/hooks";
import Switch from "components/Shared/Switch";
import CategorySelectComponent from "components/CreateTemplate/CategorySelectComponent";
import MaxInput from "components/CreateTemplate/MaxInput";
import { validateTypes } from "utils/common";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import DateRangePicker from "components/Shared/DatePicker";

// endDate
// referrerPointReward
// referredPointReward
// maxPerUser

interface IProps {
  referralItemSettings: any;
  setReferralItemSettings: Dispatch<any>;
}

const ReferralSettingsComponent = ({ referralItemSettings, setReferralItemSettings }: IProps) => {
  const { errors, setErrors } = useContext(CreateQuestContext);

  const { activeOrg } = useGlobalContext();

  const { levels } = useLevels({
    orgId: activeOrg?.id,
  });

  const handleChange = (key, value) => {
    if (errors[key]) {
      setErrors({
        ...errors,
        [key]: null,
      });
    }
    setReferralItemSettings({
      ...referralItemSettings,
      [key]: value,
    });
  };

  const levelsOptions = useMemo(() => {
    return Object.keys(levels).map((key) => ({
      label: levels[key],
      value: key,
    }));
  }, [levels]);

  const sections: {
    canBeHidden?: boolean;
    showBorder?: boolean;
    settings: {
      label: string;
      component: (props) => JSX.Element;
      componentProps?: { [key: string]: any };
      key: string;
      wrapperProps?: { [key: string]: string };
    }[];
    settingsLayout: { [key: string]: string };
  }[] = [
    {
      settings: [
        {
          label: "Referal Title",
          component: TextField,
          componentProps: {
            stateKey: "name",
            multiline: false,
          },
          key: "name",
        },
        {
          label: "Description",
          component: TextField,
          componentProps: {
            placeholder: "Describe the quest",
            stateKey: "description",
            multiline: true,
            showMaxLength: true,
          },
          key: "description",
        },
      ],
      settingsLayout: {
        flexDirection: "column",
        gap: "14px",
      },
    },
    {
      settings: [
        {
          label: "Level Needed",
          component: SelectComponent,
          key: "level",
          componentProps: {
            options: levelsOptions,
            stateKey: "level",
          },
        },
        {
          label: "Active Referral",
          component: Switch,
          key: "status",
          componentProps: {
            value: referralItemSettings.status === REFERRAL_STATUSES.ACTIVE,
            onChange: (value) => {
              handleChange("status", value ? REFERRAL_STATUSES.ACTIVE : REFERRAL_STATUSES.INACTIVE);
            },
          },
        },

      ],
      settingsLayout: {
        flexDirection: "row",
        alignItems: "center",
      },
    },
    {
      canBeHidden: true,
      showBorder: false,
      settings: [
        {
          label: "End Date",
          component: () => (
            <DateRangePicker
              startToday
              onConfirm={(value) => {
                setReferralItemSettings((prev) => ({
                  ...prev,
                  ...value,
                }));
              }}
              ButtonComponent={(props) => (
                <ButtonBase {...props}>
                  <CustomTextField
                    disabled
                    placeholder="Select Date Range"
                    value={
                      referralItemSettings?.startAt && referralItemSettings?.endAt
                        ? `${referralItemSettings?.startAt?.format(
                            MONTH_DAY_FULL_YEAR
                          )} - ${referralItemSettings?.endAt?.format(MONTH_DAY_FULL_YEAR)}`
                        : null
                    }
                  />
                </ButtonBase>
              )}
            />
          ),
          key: "endDate",
        },
        {
          label: "Max Per User",
          component: MaxInput,
          componentProps: {
            keyValue: referralItemSettings?.maxPerUser,
            handleValueChange: (value) => handleChange("maxPerUser", value),
            onChange: (value) => {
              if (!value && referralItemSettings.maxPerUser) {
                return handleChange("maxPerUser", null);
              }
              return handleChange("maxPerUser", 1);
            },
          },
          key: "maxPerUser",
        },
        {
          label: "Referrer Reward",
          component: TextField,
          componentProps: {
            multiline: false,
            onChange: (value) => {
              const isValid = validateTypes("number", value);
              if (isValid) {
                return handleChange("referrerPointReward", value);
              }
            },
          },
          key: "referrerPointReward",
        },
        {
          label: "Referred Reward",
          component: TextField,
          key: "referredPointReward",
          componentProps: {
            multiline: false,
            onChange: (value) => {
              const isValid = validateTypes("number", value);
              if (isValid) {
                return handleChange("referredPointReward", value);
              }
            },
          },
        },
      ],
      settingsLayout: {
        flexDirection: "row",
        alignItems: "center",
      },
    },
  ];

  return (
    <>
      {sections.map(({ canBeHidden, settingsLayout, settings, showBorder }) => {
        return (
          <CampaignOverviewSections
            canBeHidden={canBeHidden}
            settingsLayout={settingsLayout}
            settings={settings}
            showBorder={showBorder}
            handleChange={handleChange}
            errors={errors}
            entitySettings={referralItemSettings}
            setEntitySettings={setReferralItemSettings}
          />
        );
      })}
    </>
  );
};

export default ReferralSettingsComponent;
