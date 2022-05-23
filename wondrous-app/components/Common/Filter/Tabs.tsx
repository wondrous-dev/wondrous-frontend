import { StyledTabs, StyledTab } from 'components/organization/tabs/styles';

export default function FilterTabs({ tabs, onSelect, selected }) {
  return (
    <>
      <StyledTabs value={selected} withMargin={false} withBorder={false}>
        {tabs.map((tab, idx) => (
          <StyledTab value={tab.name} key={tab.name} label={tab.label} onClick={() => onSelect(tab)} />
        ))}
      </StyledTabs>
    </>
  );
}
