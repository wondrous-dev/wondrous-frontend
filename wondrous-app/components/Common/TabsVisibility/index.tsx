import { TabsVisibilityButton, TabsVisibilityWrapper } from './styles';

interface ITabsVisibilityProps {
  selected: string;
  options: {};
  onChange: (e) => any;
  variant?: boolean;
}

export const TabsVisibility = (props: ITabsVisibilityProps) => {
  const { selected, options, onChange, variant } = props;
  return (
    <TabsVisibilityWrapper variant={variant}>
      {Object.keys(options).map((option) => (
        <TabsVisibilityButton key={option} value={option} isSelected={selected === options[option]} onClick={onChange}>
          {options[option]}
        </TabsVisibilityButton>
      ))}
    </TabsVisibilityWrapper>
  );
};
