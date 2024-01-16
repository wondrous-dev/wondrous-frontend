import { Dispatch, useContext, useMemo } from "react";
import TextField from "components/Shared/TextField";
import CreateQuestContext from "utils/context/CreateQuestContext";
import { ButtonBase } from "@mui/material";
import { MONTH_DAY_FULL_YEAR, REFERRAL_STATUSES } from "utils/constants";
import { CampaignOverviewSections } from "components/CreateTemplate/CampaignOverview";
import SelectComponent from "components/Shared/Select";
import useLevels from "utils/levels/hooks";
import { useGlobalContext } from "utils/hooks";
import Switch from "components/Shared/Switch";
import MaxInput from "components/CreateTemplate/MaxInput";
import { validateTypes } from "utils/common";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import SingleDatePicker from "components/Shared/DatePicker/SingleDatePicker";

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
          label: "Referral name",
          component: TextField,
          componentProps: {
            stateKey: "name",
            multiline: false,
            placeholder: "Enter referral name",
          },
          key: "name",
        },
        {
          label: "Description",
          component: TextField,
          componentProps: {
            placeholder: "Describe the referral",
            stateKey: "description",
            multiline: true,
            showMaxLength: true,
          },
          wrapperProps: {
            "data-tour": "tutorial-referral-description",
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
      canBeHidden: false,
      showBorder: false,
      settings: [
        {
          label: "End Date",
          component: () => (
            <SingleDatePicker
              value={referralItemSettings?.endDate}
              setValue={(value) => handleChange("endDate", value)}
              ButtonComponent={(props) => (
                <ButtonBase {...props}>
                  <CustomTextField
                    disabled
                    placeholder="Select End Date"
                    value={
                      referralItemSettings?.endDate
                        ? `${referralItemSettings?.endDate?.format(MONTH_DAY_FULL_YEAR)}`
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
